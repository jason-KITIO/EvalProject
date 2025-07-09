"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Star,
  Search,
  Filter,
  Users,
  MessageCircle,
  Trophy,
  ArrowLeft,
  Grid,
  List,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { VoteSecurityManager } from "@/lib/vote-security";
import { ProjectRatingDialog } from "@/components/ProjectRatingDialog";

interface Project {
  id: string;
  title: string;
  description: string;
  field: string;
  members: string[];
  average_rating: number;
  total_votes: number;
  comments_count: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  // Vue : "grid" ou "list"
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fields = [
    { value: "all", label: "Toutes les filières" },
    { value: "informatique", label: "Informatique" },
    { value: "genie-civil", label: "Génie Civil" },
    { value: "electronique", label: "Électronique" },
    { value: "mecanique", label: "Mécanique" },
    { value: "gestion", label: "Gestion" },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, selectedField, sortBy]);

  // Reset page à 1 quand filteredProjects change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProjects]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select(`
          *,
          ratings (
            presentation,
            technical,
            innovation,
            overall
          ),
          comments (
            id
          )
        `);

      if (error) throw error;

      const processedProjects =
        data?.map((project) => ({
          ...project,
          average_rating: calculateAverageRating(project.ratings),
          total_votes: project.ratings?.length || 0,
          comments_count: project.comments?.length || 0,
        })) || [];

      setProjects(processedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (ratings: any[]) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.overall, 0);
    return sum / ratings.length;
  };

  const filterAndSortProjects = () => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.members.some((member) =>
          member.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesField =
        selectedField === "all" || project.field === selectedField;

      return matchesSearch && matchesField;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.average_rating - a.average_rating;
        case "votes":
          return b.total_votes - a.total_votes;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  // Pagination calculations
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Retour</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#004838] rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Évaluation des Projets
                </h1>
              </div>
            </div>
            <Link href="/admin/login">
              <Button variant="outline">Administration</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Meilleure note</SelectItem>
                <SelectItem value="votes">Plus de votes</SelectItem>
                <SelectItem value="name">Nom A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Boutons pour changer la vue */}
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                size="sm"
                aria-label="Vue Grille"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
                aria-label="Vue Liste"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Affichage selon la vue */}
        {currentProjects.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEvaluate={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {currentProjects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  onEvaluate={() => setSelectedProject(project)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        )}
      </main>

      {/* Modale d'évaluation */}
      {selectedProject && (
        <ProjectRatingDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSuccess={() => {
            fetchProjects();
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onEvaluate,
}: {
  project: Project;
  onEvaluate: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">
              {project.average_rating.toFixed(1)}
            </span>
          </div>
        </div>
        <Badge variant="secondary" className="mb-2 w-max">
          {project.field}
        </Badge>
        <p className="text-gray-700 flex-grow">{project.description}</p>
        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-3">
          <Users className="w-4 h-4" />
          <span>{project.members.join(", ")}</span>
        </div>
      </div>
      <div className="p-4 border-t flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span>({project.total_votes} votes)</span>
          {project.average_rating > 0 && (
            <Trophy className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        <Button
          className={`${
            VoteSecurityManager.hasUserVoted(project.id)
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-[#004838] hover:bg-[#073127]"
          }`}
          onClick={onEvaluate}
          size="sm"
        >
          {VoteSecurityManager.hasUserVoted(project.id)
            ? "Modifier mon vote"
            : "Évaluer"}
        </Button>
      </div>
    </div>
  );
}

function ProjectListItem({
  project,
  onEvaluate,
}: {
  project: Project;
  onEvaluate: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="md:flex-1 flex flex-row justify-between">
        <div>
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <div>
            <Badge variant="secondary" className="mt-2 inline-block">
              {project.field}
            </Badge>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 text-gray-600 mt-2 text-sm">
            <Users className="w-4 h-4" />
            <span>{project.members.join(", ")}</span>
          </div>
          <p className="text-gray-700 mt-1">{project.description}</p>
        </div>

        <div className="flex items-center space-x-1 gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold">
            {project.average_rating.toFixed(1)}
          </span>
          <div>{project.total_votes} vote(s)</div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-5 h-5" />
            <span>{project.comments_count}</span>
          </div>
          {project.average_rating > 0 && (
            <Trophy className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        <Button
          className={`mt-2 ${
            VoteSecurityManager.hasUserVoted(project.id)
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-[#004838] hover:bg-[#073127]"
          }`}
          onClick={onEvaluate}
          size="sm"
        >
          {VoteSecurityManager.hasUserVoted(project.id)
            ? "Modifier mon vote"
            : "Évaluer"}
        </Button>
      </div>
    </div>
  );
}
