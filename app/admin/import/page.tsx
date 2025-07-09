"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ProjectData {
  title: string;
  description: string;
  members: string[];
  field: string;
}

export default function ImportProjects() {
  const [selectedField, setSelectedField] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: number;
    errors: string[];
    imported: ProjectData[];
  } | null>(null);
  const { toast } = useToast();

  const fields = [
    { value: "informatique", label: "Informatique" },
    { value: "genie-civil", label: "Génie Civil" },
    { value: "electronique", label: "Électronique" },
    { value: "mecanique", label: "Mécanique" },
    { value: "gestion", label: "Gestion" },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        if (
          droppedFile.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          droppedFile.type === "application/vnd.ms-excel"
        ) {
          setFile(droppedFile);
        } else {
          toast({
            title: "Erreur",
            description:
              "Veuillez sélectionner un fichier Excel (.xlsx ou .xls)",
            variant: "destructive",
          });
        }
      }
    },
    [toast]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const parseExcelFile = async (file: File): Promise<ProjectData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const projects: ProjectData[] = [];

          // Supposons que la première ligne contient les en-têtes
          // Format attendu: Titre | Description | Membres (séparés par ;)
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row.length >= 3 && row[0]) {
              const members = row[2]
                ? row[2]
                    .toString()
                    .split(";")
                    .map((m: string) => m.trim())
                    .filter((m: string) => m)
                : [];
              projects.push({
                title: row[0].toString().trim(),
                description: row[1] ? row[1].toString().trim() : "",
                members,
                field: selectedField,
              });
            }
          }

          resolve(projects);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () =>
        reject(new Error("Erreur lors de la lecture du fichier"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleImport = async () => {
    if (!file || !selectedField) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier et une filière",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    setProgress(0);
    setResults(null);

    try {
      // Parse Excel file
      setProgress(20);
      const projects = await parseExcelFile(file);

      if (projects.length === 0) {
        throw new Error("Aucun projet trouvé dans le fichier");
      }

      setProgress(40);

      // Import projects to database
      const errors: string[] = [];
      const imported: ProjectData[] = [];

      for (let i = 0; i < projects.length; i++) {
        try {
          const { error } = await supabase.from("projects").insert({
            title: projects[i].title,
            description: projects[i].description,
            field: projects[i].field,
            members: projects[i].members,
          });

          if (error) {
            errors.push(`Ligne ${i + 2}: ${error.message}`);
          } else {
            imported.push(projects[i]);
          }
        } catch (err) {
          errors.push(`Ligne ${i + 2}: Erreur lors de l'insertion`);
        }

        setProgress(40 + (i / projects.length) * 60);
      }

      setResults({
        success: imported.length,
        errors,
        imported,
      });

      if (imported.length > 0) {
        toast({
          title: "Import terminé",
          description: `${imported.length} projet(s) importé(s) avec succès`,
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Erreur d'import",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      setProgress(100);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Titre du projet; Description; Membres (separes par ",")
Systeme de Gestion; Application web pour la gestion; Alice Martin, Bob Dupont, Claire Rousseau`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_projets.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Retour au tableau de bord</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Import de projets
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5" />
                <span>Instructions d'import</span>
              </CardTitle>
              <CardDescription>
                Suivez ces étapes pour importer vos projets depuis un fichier
                Excel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#004838] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-semibold">Préparez votre fichier</div>
                    <div className="text-gray-600">
                      Format Excel avec colonnes: Titre, Description, Membres
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#004838] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-semibold">Sélectionnez la filière</div>
                    <div className="text-gray-600">
                      Tous les projets seront assignés à cette filière
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-[#004838] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-semibold">Importez le fichier</div>
                    <div className="text-gray-600">
                      Glissez-déposez ou sélectionnez votre fichier
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Télécharger le modèle Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Import Form */}
          <Card>
            <CardHeader>
              <CardTitle>Importer les projets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Field Selection */}
              <div className="space-y-2">
                <Label>Filière *</Label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Fichier Excel *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-[#004838] bg-[#004838]/5"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {file ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-[#004838]">
                        {file.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-gray-700">
                        Glissez-déposez votre fichier Excel ici
                      </div>
                      <div className="text-gray-500">ou</div>
                      <label htmlFor="file-input">
                        <Button
                          variant="outline"
                          className="cursor-pointer bg-transparent"
                          asChild
                        >
                          <span>Parcourir les fichiers</span>
                        </Button>
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Import Progress */}
              {importing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Import en cours...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Import Button */}
              <Button
                onClick={handleImport}
                disabled={!file || !selectedField || importing}
                className="w-full bg-[#004838] hover:bg-[#073127]"
              >
                {importing ? "Import en cours..." : "Importer les projets"}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {results.errors.length === 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span>Résultats de l'import</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {results.success}
                    </div>
                    <div className="text-green-700">
                      Projets importés avec succès
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {results.errors.length}
                    </div>
                    <div className="text-red-700">Erreurs rencontrées</div>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-2">
                        Erreurs détectées :
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {results.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {results.imported.length > 0 && (
                  <div>
                    <div className="font-semibold mb-2">Projets importés :</div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {results.imported.map((project, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded border-l-4 border-[#004838]"
                        >
                          <div className="font-semibold">{project.title}</div>
                          <div className="text-sm text-gray-600">
                            Membres: {project.members.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
