"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, ArrowLeft, Users, MessageCircle, Trophy, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { ProjectRatingDialog } from "@/components/ProjectRatingDialog"
import { VoteSecurityManager } from "@/lib/vote-security"

interface Project {
  id: string
  title: string
  description: string
  field: string
  members: string[]
  created_at: string
}

interface Rating {
  id: string
  presentation: number
  technical: number
  innovation: number
  overall: number
  created_at: string
  user_session: string
}

interface Comment {
  id: string
  content: string
  created_at: string
  user_session: string
}

interface ProjectStats {
  average_rating: number
  total_votes: number
  ratings_breakdown: {
    presentation: number
    technical: number
    innovation: number
    overall: number
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRatingDialog, setShowRatingDialog] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProjectDetails()
    }
  }, [params.id])

  const fetchProjectDetails = async () => {
    try {
      // Fetch project info
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .single()

      if (projectError) throw projectError
      setProject(projectData)

      // Fetch ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_id", params.id)
        .order("created_at", { ascending: false })

      if (ratingsError) throw ratingsError
      setRatings(ratingsData || [])

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("project_id", params.id)
        .order("created_at", { ascending: false })

      if (commentsError) throw commentsError
      setComments(commentsData || [])

      // Calculate stats
      if (ratingsData && ratingsData.length > 0) {
        const totalRatings = ratingsData.length
        const avgPresentation = ratingsData.reduce((sum, r) => sum + r.presentation, 0) / totalRatings
        const avgTechnical = ratingsData.reduce((sum, r) => sum + r.technical, 0) / totalRatings
        const avgInnovation = ratingsData.reduce((sum, r) => sum + r.innovation, 0) / totalRatings
        const avgOverall = ratingsData.reduce((sum, r) => sum + r.overall, 0) / totalRatings

        setStats({
          average_rating: avgOverall,
          total_votes: totalRatings,
          ratings_breakdown: {
            presentation: avgPresentation,
            technical: avgTechnical,
            innovation: avgInnovation,
            overall: avgOverall,
          },
        })
      } else {
        setStats({
          average_rating: 0,
          total_votes: 0,
          ratings_breakdown: {
            presentation: 0,
            technical: 0,
            innovation: 0,
            overall: 0,
          },
        })
      }
    } catch (error) {
      console.error("Error fetching project details:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du projet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAnonymousName = (userSession: string, index: number) => {
    // Générer un nom anonyme basé sur l'index et une partie du hash de session
    const names = [
      "Évaluateur Alpha",
      "Évaluateur Beta",
      "Évaluateur Gamma",
      "Évaluateur Delta",
      "Évaluateur Epsilon",
      "Évaluateur Zeta",
      "Évaluateur Eta",
      "Évaluateur Theta",
      "Évaluateur Iota",
      "Évaluateur Kappa",
      "Évaluateur Lambda",
      "Évaluateur Mu",
    ]
    return names[index % names.length] || `Évaluateur ${index + 1}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h2>
          <Link href="/projects">
            <Button>Retour aux projets</Button>
          </Link>
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
            <div className="flex items-center space-x-4">
              <Link href="/projects" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Retour aux projets</span>
              </Link>
            </div>
            <Button
              onClick={() => setShowRatingDialog(true)}
              className={`${
                VoteSecurityManager.hasUserVoted(project.id)
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-[#004838] hover:bg-[#073127]"
              }`}
            >
              {VoteSecurityManager.hasUserVoted(project.id) ? "Modifier mon vote" : "Évaluer ce projet"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations du projet */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                    <Badge variant="secondary" className="mb-4">
                      {project.field}
                    </Badge>
                  </div>
                  {stats && stats.average_rating > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-6 h-6 text-yellow-400" />
                      <span className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{project.members.join(", ")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Créé le {formatDate(project.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques détaillées */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Statistiques détaillées</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#004838]">
                        {stats.ratings_breakdown.presentation.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Présentation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#004838]">
                        {stats.ratings_breakdown.technical.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Technique</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#004838]">
                        {stats.ratings_breakdown.innovation.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Innovation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#004838]">
                        {stats.ratings_breakdown.overall.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Global</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liste des votes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Évaluations reçues ({ratings.length})</span>
                  {stats && stats.total_votes > 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ratings.length > 0 ? (
                  <div className="space-y-4">
                    {ratings.map((rating, index) => (
                      <div key={rating.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-900">
                            {getAnonymousName(rating.user_session, index)}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(rating.created_at)}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="font-semibold">{rating.presentation}</span>
                            </div>
                            <div className="text-xs text-gray-600">Présentation</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="font-semibold">{rating.technical}</span>
                            </div>
                            <div className="text-xs text-gray-600">Technique</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="font-semibold">{rating.innovation}</span>
                            </div>
                            <div className="text-xs text-gray-600">Innovation</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="font-semibold text-[#004838]">{rating.overall}</span>
                            </div>
                            <div className="text-xs text-gray-600">Global</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune évaluation pour le moment</p>
                    <p className="text-sm text-gray-500">Soyez le premier à évaluer ce projet !</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec commentaires */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Commentaires ({comments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <div key={comment.id} className="border-l-4 border-[#004838] pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {getAnonymousName(comment.user_session, index)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Aucun commentaire</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résumé rapide */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Note moyenne</span>
                      <span className="font-semibold">{stats.average_rating.toFixed(1)}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total votes</span>
                      <span className="font-semibold">{stats.total_votes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commentaires</span>
                      <span className="font-semibold">{comments.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Filière</span>
                      <Badge variant="outline">{project.field}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Modale d'évaluation */}
      {showRatingDialog && (
        <ProjectRatingDialog
          project={project}
          onClose={() => setShowRatingDialog(false)}
          onSuccess={() => {
            fetchProjectDetails()
            setShowRatingDialog(false)
          }}
        />
      )}
    </div>
  )
}
