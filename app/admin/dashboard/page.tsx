"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  Star,
  Plus,
  Download,
  LogOut,
  Trash2,
  Edit,
  Upload,
  Trophy,
  MessageCircle,
  TrendingUp,
  Award,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  field: string
  members: string[]
  created_at: string
  updated_at?: string
}

interface DashboardStats {
  totalProjects: number
  totalVotes: number
  averageRating: number
  topProject: string
}

interface ProjectResult {
  id: string
  title: string
  field: string
  members: string[]
  average_rating: number
  total_votes: number
  comments_count: number
  ratings: {
    presentation: number
    technical: number
    innovation: number
    overall: number
  }[]
  comments: {
    content: string
    created_at: string
  }[]
}

interface FieldStats {
  field: string
  count: number
  average_rating: number
  total_votes: number
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectResults, setProjectResults] = useState<ProjectResult[]>([])
  const [fieldStats, setFieldStats] = useState<FieldStats[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalVotes: 0,
    averageRating: 0,
    topProject: "",
  })
  const [loading, setLoading] = useState(true)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    field: "",
    members: "",
  })

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showEditProject, setShowEditProject] = useState(false)
  const [editProject, setEditProject] = useState({
    title: "",
    description: "",
    field: "",
    members: "",
  })

  const [selectedField, setSelectedField] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const router = useRouter()
  const { toast } = useToast()

  const fields = [
    { value: "informatique", label: "Informatique" },
    { value: "genie-civil", label: "Génie Civil" },
    { value: "electronique", label: "Électronique" },
    { value: "mecanique", label: "Mécanique" },
    { value: "gestion", label: "Gestion" },
  ]

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
    fetchResults()
  }, [])

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/admin/login")
    }
  }

  const fetchDashboardData = async () => {
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })

      if (projectsError) throw projectsError

      // Fetch ratings for stats
      const { data: ratingsData, error: ratingsError } = await supabase.from("ratings").select("*")

      if (ratingsError) throw ratingsError

      setProjects(projectsData || [])

      // Calculate stats
      const totalProjects = projectsData?.length || 0
      const totalVotes = ratingsData?.length || 0
      const averageRating = ratingsData?.length
        ? ratingsData.reduce((sum, rating) => sum + rating.overall, 0) / ratingsData.length
        : 0

      // Find top project
      const projectRatings = new Map()
      ratingsData?.forEach((rating) => {
        if (!projectRatings.has(rating.project_id)) {
          projectRatings.set(rating.project_id, [])
        }
        projectRatings.get(rating.project_id).push(rating.overall)
      })

      let topProjectId = ""
      let topRating = 0
      projectRatings.forEach((ratings, projectId) => {
        const avg = ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
        if (avg > topRating) {
          topRating = avg
          topProjectId = projectId
        }
      })

      const topProject = projectsData?.find((p) => p.id === topProjectId)?.title || "Aucun"

      setStats({
        totalProjects,
        totalVotes,
        averageRating,
        topProject,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchResults = async () => {
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
            content,
            created_at
          )
        `)

      if (error) throw error

      const processedResults =
        data?.map((project) => ({
          ...project,
          average_rating: project.ratings?.length
            ? project.ratings.reduce((sum: number, r: any) => sum + r.overall, 0) / project.ratings.length
            : 0,
          total_votes: project.ratings?.length || 0,
          comments_count: project.comments?.length || 0,
        })) || []

      setProjectResults(processedResults)

      // Calculate field statistics
      const fieldStatsMap = new Map()
      processedResults.forEach((project) => {
        if (!fieldStatsMap.has(project.field)) {
          fieldStatsMap.set(project.field, {
            field: project.field,
            count: 0,
            total_rating: 0,
            total_votes: 0,
          })
        }
        const stat = fieldStatsMap.get(project.field)
        stat.count += 1
        stat.total_rating += project.average_rating
        stat.total_votes += project.total_votes
      })

      const fieldStatsArray = Array.from(fieldStatsMap.values()).map((stat) => ({
        field: stat.field,
        count: stat.count,
        average_rating: stat.count > 0 ? stat.total_rating / stat.count : 0,
        total_votes: stat.total_votes,
      }))

      setFieldStats(fieldStatsArray)
    } catch (error) {
      console.error("Error fetching results:", error)
    }
  }

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.field) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("projects").insert({
        title: newProject.title,
        description: newProject.description,
        field: newProject.field,
        members: newProject.members
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m),
      })

      if (error) throw error

      toast({
        title: "Succès",
        description: "Projet ajouté avec succès",
      })

      setNewProject({ title: "", description: "", field: "", members: "" })
      setShowAddProject(false)
      fetchDashboardData()
      fetchResults()
    } catch (error) {
      console.error("Error adding project:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le projet",
        variant: "destructive",
      })
    }
  }

  const handleEditProject = async () => {
    if (!editProject.title || !editProject.field || !editingProject) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title: editProject.title,
          description: editProject.description,
          field: editProject.field,
          members: editProject.members
            .split(",")
            .map((m) => m.trim())
            .filter((m) => m),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingProject.id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Projet modifié avec succès",
      })

      setEditProject({ title: "", description: "", field: "", members: "" })
      setEditingProject(null)
      setShowEditProject(false)
      fetchDashboardData()
      fetchResults()
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le projet",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setEditProject({
      title: project.title,
      description: project.description,
      field: project.field,
      members: project.members.join(", "),
    })
    setShowEditProject(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return

    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Projet supprimé avec succès",
      })

      fetchDashboardData()
      fetchResults()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const exportData = async () => {
    try {
      const { data: ratingsData } = await supabase.from("ratings").select(`
          *,
          projects (title, field, members)
        `)

      const { data: commentsData } = await supabase.from("comments").select(`
          *,
          projects (title)
        `)

      // Create CSV content
      let csvContent = "Projet,Filière,Membres,Présentation,Technique,Innovation,Global,Commentaire\n"

      ratingsData?.forEach((rating) => {
        const project = rating.projects
        const comment = commentsData?.find((c) => c.project_id === rating.project_id)?.content || ""
        csvContent += `"${project.title}","${project.field}","${project.members.join(", ")}",${rating.presentation},${rating.technical},${rating.innovation},${rating.overall},"${comment}"\n`
      })

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "evaluations_projets.csv"
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Succès",
        description: "Données exportées avec succès",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      })
    }
  }

  const filteredResults = projectResults
    .filter((project) => selectedField === "all" || project.field === selectedField)
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.average_rating - a.average_rating
        case "votes":
          return b.total_votes - a.total_votes
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
            <div className="flex items-center space-x-4">
              <Link href="/admin/import">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer des projets
                </Button>
              </Link>
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meilleur Projet</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{stats.topProject}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Gestion des Projets</TabsTrigger>
            <TabsTrigger value="results">Résultats</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Projets</h2>
              <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
                <DialogTrigger asChild>
                  <Button className="bg-[#004838] hover:bg-[#073127]">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un projet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau projet</DialogTitle>
                    <DialogDescription>Remplissez les informations du projet</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du projet *</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="Nom du projet"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="field">Filière *</Label>
                      <Select
                        value={newProject.field}
                        onValueChange={(value) => setNewProject({ ...newProject, field: value })}
                      >
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

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Description du projet"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="members">Membres (séparés par des virgules)</Label>
                      <Input
                        id="members"
                        value={newProject.members}
                        onChange={(e) => setNewProject({ ...newProject, members: e.target.value })}
                        placeholder="Jean Dupont, Marie Martin, Pierre Durand"
                      />
                    </div>

                    <Button onClick={handleAddProject} className="w-full bg-[#004838] hover:bg-[#073127]">
                      Ajouter le projet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showEditProject} onOpenChange={setShowEditProject}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier le projet</DialogTitle>
                    <DialogDescription>Modifiez les informations du projet</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Titre du projet *</Label>
                      <Input
                        id="edit-title"
                        value={editProject.title}
                        onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
                        placeholder="Nom du projet"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-field">Filière *</Label>
                      <Select
                        value={editProject.field}
                        onValueChange={(value) => setEditProject({ ...editProject, field: value })}
                      >
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

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editProject.description}
                        onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                        placeholder="Description du projet"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-members">Membres (séparés par des virgules)</Label>
                      <Input
                        id="edit-members"
                        value={editProject.members}
                        onChange={(e) => setEditProject({ ...editProject, members: e.target.value })}
                        placeholder="Jean Dupont, Marie Martin, Pierre Durand"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleEditProject} className="flex-1 bg-[#004838] hover:bg-[#073127]">
                        Modifier le projet
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowEditProject(false)
                          setEditingProject(null)
                          setEditProject({ title: "", description: "", field: "", members: "" })
                        }}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {fields.find((f) => f.value === project.field)?.label || project.field}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(project)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <strong>Membres:</strong> {project.members.join(", ")}
                      </div>
                      <div className="text-sm text-gray-500">
                        Créé le {new Date(project.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
                <p className="text-gray-600 mb-4">Commencez par ajouter votre premier projet</p>
                <Button onClick={() => setShowAddProject(true)} className="bg-[#004838] hover:bg-[#073127]">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un projet
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {/* Statistics by Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Statistiques par Filière</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fieldStats.map((stat) => (
                      <div key={stat.field} className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">
                            {fields.find((f) => f.value === stat.field)?.label || stat.field}
                          </div>
                          <div className="text-sm text-gray-600">{stat.count} projet(s)</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{stat.average_rating.toFixed(1)}/5</div>
                          <div className="text-sm text-gray-600">{stat.total_votes} vote(s)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Top 3 Projets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredResults.slice(0, 3).map((project, index) => (
                      <div key={project.id} className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{project.title}</div>
                          <div className="text-sm text-gray-600">
                            {project.average_rating.toFixed(1)}/5 • {project.total_votes} vote(s)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Activité Récente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectResults
                      .filter((p) => p.comments.length > 0)
                      .slice(0, 3)
                      .map((project) => (
                        <div key={project.id} className="border-l-4 border-[#004838] pl-3">
                          <div className="font-semibold text-sm">{project.title}</div>
                          <div className="text-xs text-gray-600">{project.comments_count} commentaire(s)</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Filtrer par filière</Label>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les filières</SelectItem>
                      {fields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Trier par</Label>
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
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-gray-600">{filteredResults.length} projet(s) affiché(s)</div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats Détaillés</CardTitle>
                <CardDescription>Classement des projets avec notes détaillées et commentaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredResults.map((project, index) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-bold text-lg">#{index + 1}</span>
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <Badge variant="secondary">
                              {fields.find((f) => f.value === project.field)?.label || project.field}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Membres:</strong> {project.members.join(", ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-bold text-lg">{project.average_rating.toFixed(1)}</span>
                            <span className="text-gray-500">/5</span>
                          </div>
                          <div className="text-sm text-gray-600">{project.total_votes} vote(s)</div>
                        </div>
                      </div>

                      {/* Detailed Ratings */}
                      {project.ratings.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm font-medium">Présentation</div>
                            <div className="flex items-center space-x-1">
                              <Progress
                                value={
                                  (project.ratings.reduce((sum, r) => sum + r.presentation, 0) /
                                    project.ratings.length) *
                                  20
                                }
                                className="flex-1 h-2"
                              />
                              <span className="text-sm">
                                {(
                                  project.ratings.reduce((sum, r) => sum + r.presentation, 0) / project.ratings.length
                                ).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Technique</div>
                            <div className="flex items-center space-x-1">
                              <Progress
                                value={
                                  (project.ratings.reduce((sum, r) => sum + r.technical, 0) / project.ratings.length) *
                                  20
                                }
                                className="flex-1 h-2"
                              />
                              <span className="text-sm">
                                {(
                                  project.ratings.reduce((sum, r) => sum + r.technical, 0) / project.ratings.length
                                ).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Innovation</div>
                            <div className="flex items-center space-x-1">
                              <Progress
                                value={
                                  (project.ratings.reduce((sum, r) => sum + r.innovation, 0) / project.ratings.length) *
                                  20
                                }
                                className="flex-1 h-2"
                              />
                              <span className="text-sm">
                                {(
                                  project.ratings.reduce((sum, r) => sum + r.innovation, 0) / project.ratings.length
                                ).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Global</div>
                            <div className="flex items-center space-x-1">
                              <Progress
                                value={
                                  (project.ratings.reduce((sum, r) => sum + r.overall, 0) / project.ratings.length) * 20
                                }
                                className="flex-1 h-2"
                              />
                              <span className="text-sm">
                                {(
                                  project.ratings.reduce((sum, r) => sum + r.overall, 0) / project.ratings.length
                                ).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comments */}
                      {project.comments.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Commentaires ({project.comments.length})</div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {project.comments.slice(0, 3).map((comment, commentIndex) => (
                              <div key={commentIndex} className="bg-gray-50 p-2 rounded text-sm">
                                <p>{comment.content}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                                </div>
                              </div>
                            ))}
                            {project.comments.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{project.comments.length - 3} autre(s) commentaire(s)
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
                    <p className="text-gray-600">Aucun projet n'a encore été évalué ou ne correspond aux filtres.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
