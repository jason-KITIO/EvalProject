"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Search,
  Upload,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  MousePointer,
  Eye,
  Settings,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  duration: number;
}

export default function GuidePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const steps: GuideStep[] = [
    {
      id: "welcome",
      title: "Bienvenue sur EvalProject",
      description: "Découvrez comment utiliser notre plateforme d'évaluation",
      icon: <Star className="w-6 h-6" />,
      duration: 3000,
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[#004838] to-[#073127] rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Star className="w-16 h-16 text-[#E2FB6C]" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#E2FB6C] rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#E2FB6C] rounded-full animate-bounce delay-300"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">EvalProject</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              La plateforme moderne pour évaluer les projets universitaires de
              manière anonyme et transparente.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-[#004838] text-white animate-fade-in">
                Anonyme
              </Badge>
              <Badge className="bg-[#004838] text-white animate-fade-in delay-100">
                Transparent
              </Badge>
              <Badge className="bg-[#004838] text-white animate-fade-in delay-200">
                Efficace
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "navigation",
      title: "Navigation sur la plateforme",
      description: "Apprenez à naviguer dans l'interface",
      icon: <MousePointer className="w-6 h-6" />,
      duration: 4000,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 animate-slide-down">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#004838] rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">EvalProject</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="animate-fade-in delay-300">
                  Se connecter
                </Button>
                <Button className="bg-[#004838] hover:bg-[#073127] animate-fade-in delay-500">
                  Commencer
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card className="animate-scale-in delay-700">
                <CardContent className="p-4 text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-[#004838]" />
                  <p className="text-sm">Voir les projets</p>
                </CardContent>
              </Card>
              <Card className="animate-scale-in delay-900">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-[#004838]" />
                  <p className="text-sm">Évaluer</p>
                </CardContent>
              </Card>
              <Card className="animate-scale-in delay-1100">
                <CardContent className="p-4 text-center">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-[#004838]" />
                  <p className="text-sm">Administration</p>
                </CardContent>
              </Card>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#004838] to-[#073127] animate-progress"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-600">
              Interface intuitive avec navigation claire et accessible
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "search-filter",
      title: "Recherche et filtrage",
      description: "Trouvez facilement les projets qui vous intéressent",
      icon: <Search className="w-6 h-6" />,
      duration: 4500,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative animate-slide-right">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004838] focus:border-transparent transition-all"
                  placeholder="Rechercher un projet..."
                  value="Robot autonome"
                  readOnly
                />
                <div className="absolute inset-0 border-2 border-[#004838] rounded-md animate-pulse-border"></div>
              </div>
              <div className="animate-slide-right delay-300">
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004838] transition-all">
                  <option>Électronique</option>
                </select>
              </div>
              <div className="animate-slide-right delay-500">
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md">
                  <option>Meilleure note</option>
                </select>
              </div>
              <div className="animate-slide-right delay-700">
                <div className="text-sm text-gray-600 flex items-center py-2">
                  3 projet(s) trouvé(s)
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className={`animate-fade-in-up delay-${
                    800 + i * 200
                  } hover:shadow-lg transition-all`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Robot Autonome {i}</h3>
                        <Badge variant="secondary">Électronique</Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>4.{i}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600">
              Filtrez par filière, recherchez par mots-clés et triez selon vos
              préférences
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "rating",
      title: "Système d'évaluation",
      description: "Découvrez comment noter un projet selon 4 critères",
      icon: <Star className="w-6 h-6" />,
      duration: 5000,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2 animate-fade-in">
                Évaluer : Robot Autonome
              </h3>
              <p className="text-gray-600 animate-fade-in delay-200">
                Donnez votre évaluation selon les critères suivants
              </p>
            </div>
            <div className="space-y-6">
              {[
                { label: "Qualité de la présentation", value: 4, delay: 400 },
                { label: "Aspect technique", value: 5, delay: 800 },
                { label: "Innovation", value: 4, delay: 1200 },
                { label: "Note globale", value: 4, delay: 1600 },
              ].map((criterion, index) => (
                <div
                  key={index}
                  className={`space-y-2 animate-slide-up delay-${criterion.delay}`}
                >
                  <label className="block text-sm font-medium">
                    {criterion.label}
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-all duration-300 ${
                          star <= criterion.value
                            ? "text-yellow-400 fill-current animate-star-fill"
                            : "text-gray-300"
                        }`}
                        style={{
                          animationDelay: `${criterion.delay + star * 100}ms`,
                        }}
                      />
                    ))}
                    <span
                      className="ml-2 font-semibold animate-fade-in"
                      style={{ animationDelay: `${criterion.delay + 600}ms` }}
                    >
                      {criterion.value}/5
                    </span>
                  </div>
                </div>
              ))}
              <div className="animate-slide-up delay-2000">
                <label className="block text-sm font-medium mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004838] transition-all"
                  rows={3}
                  placeholder="Excellent travail sur l'intelligence artificielle..."
                  value="Excellent travail sur l'intelligence artificielle..."
                  readOnly
                />
              </div>
              <Button className="w-full bg-[#004838] hover:bg-[#073127] animate-slide-up delay-2400">
                <CheckCircle className="w-4 h-4 mr-2" />
                Enregistrer l'évaluation
              </Button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600">
              Système de notation sur 5 étoiles avec commentaires optionnels
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "admin",
      title: "Administration",
      description: "Gérez vos projets et consultez les résultats",
      icon: <Settings className="w-6 h-6" />,
      duration: 4000,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Import de projets</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center animate-pulse-border">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-bounce" />
                  <p className="text-sm text-gray-600">
                    Glissez-déposez votre fichier Excel
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="animate-scale-in delay-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Statistiques</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Projets</span>
                    <span className="font-bold text-2xl animate-count-up">
                      24
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Votes</span>
                    <span className="font-bold text-2xl animate-count-up delay-300">
                      156
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Note Moyenne</span>
                    <span className="font-bold text-2xl animate-count-up delay-500">
                      4.2/5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="animate-slide-up delay-600">
            <CardHeader>
              <CardTitle>Résultats en temps réel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Système de Gestion", rating: 4.8, votes: 12 },
                  { name: "Robot Autonome", rating: 4.5, votes: 8 },
                  { name: "Plateforme E-commerce", rating: 4.2, votes: 15 },
                ].map((project, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between animate-slide-right delay-${
                      800 + index * 200
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-sm text-gray-600">
                        {project.votes} vote(s)
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={project.rating * 20} className="w-20" />
                      <span className="font-semibold">{project.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="text-center">
            <p className="text-gray-600">
              Dashboard complet avec import Excel et export des résultats
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "Sécurité et anonymat",
      description: "Système anti-vote multiple et protection des données",
      icon: <CheckCircle className="w-6 h-6" />,
      duration: 3500,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="animate-scale-in text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
                <h3 className="font-semibold mb-2">Anonymat garanti</h3>
                <p className="text-sm text-gray-600">
                  Aucune donnée personnelle collectée
                </p>
              </CardContent>
            </Card>
            <Card className="animate-scale-in delay-300 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600 animate-pulse delay-300" />
                </div>
                <h3 className="font-semibold mb-2">Anti-vote multiple</h3>
                <p className="text-sm text-gray-600">
                  Empreinte digitale unique
                </p>
              </CardContent>
            </Card>
            <Card className="animate-scale-in delay-500 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-purple-600 animate-spin-slow" />
                </div>
                <h3 className="font-semibold mb-2">Modification possible</h3>
                <p className="text-sm text-gray-600">
                  Changez votre vote si nécessaire
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gradient-to-r from-[#004838] to-[#073127] rounded-lg p-6 text-white text-center animate-fade-in delay-700">
            <h3 className="text-xl font-semibold mb-2">🔒 Sécurité maximale</h3>
            <p className="opacity-90">
              Votre identité reste protégée tout en empêchant les votes
              multiples grâce à notre système de fingerprinting avancé.
            </p>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStep < steps.length - 1) {
              setCurrentStep((prev) => prev + 1);
              setAnimationKey((prev) => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 100 / (steps[currentStep].duration / 100);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setAnimationKey((prev) => prev + 1);
  };

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setIsPlaying(false);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap flex-row gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Retour</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#004838] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Guide d'utilisation
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handlePlay} variant="outline" size="sm">
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isPlaying ? "Pause" : "Lecture auto"}
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
                Recommencer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Étape {currentStep + 1} sur {steps.length}
              </h2>
              <div className="text-sm text-gray-600">
                {Math.round(
                  ((currentStep + progress / 100) / steps.length) * 100
                )}
                % terminé
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#004838] to-[#E2FB6C] h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${
                    ((currentStep + progress / 100) / steps.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepChange(index)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  index === currentStep
                    ? "border-[#004838] bg-[#004838] text-white shadow-lg scale-105"
                    : index < currentStep
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {step.icon}
                  {index < currentStep && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="text-sm font-medium">{step.title}</div>
              </button>
            ))}
          </div>

          {/* Current Step Content */}
          <div
            key={animationKey}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#004838] rounded-full flex items-center justify-center text-white">
                  {steps[currentStep].icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {steps[currentStep].title}
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="animate-fade-in">{steps[currentStep].content}</div>

            {/* Step Progress */}
            {isPlaying && (
              <div className="mt-8">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-[#004838] h-1 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentStep + 1} / {steps.length}
              </span>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "bg-[#004838] scale-150"
                        : index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={() =>
                handleStepChange(Math.min(steps.length - 1, currentStep + 1))
              }
              disabled={currentStep === steps.length - 1}
              className="flex items-center space-x-2 bg-[#004838] hover:bg-[#073127]"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-gradient-to-r from-[#004838] to-[#073127] rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Prêt à commencer ?</h3>
            <p className="text-lg opacity-90 mb-6">
              Maintenant que vous connaissez la plateforme, commencez à évaluer
              des projets !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button
                  size="lg"
                  className="bg-[#E2FB6C] text-[#004838] hover:bg-[#E2FB6C]/90"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Évaluer des projets
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#004838] bg-transparent"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Accès administrateur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
