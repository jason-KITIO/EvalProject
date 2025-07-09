"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { VoteSecurityManager } from "@/lib/vote-security"

interface Project {
  id: string
  title: string
}

interface Rating {
  presentation: number
  technical: number
  innovation: number
  overall: number
}

interface ProjectRatingDialogProps {
  project: Project
  onClose: () => void
  onSuccess: () => void
}

export function ProjectRatingDialog({ project, onClose, onSuccess }: ProjectRatingDialogProps) {
  const [rating, setRating] = useState<Rating>({ presentation: 0, technical: 0, innovation: 0, overall: 0 })
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Optionnel : charger le vote existant si utilisateur a déjà voté
  useEffect(() => {
    async function loadExistingVote() {
      const userIdentifier = VoteSecurityManager.getUserIdentifier()
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_id", project.id)
        .eq("user_session", userIdentifier)
        .single()

      if (!error && data) {
        setRating({
          presentation: data.presentation,
          technical: data.technical,
          innovation: data.innovation,
          overall: data.overall,
        })
      }

      // Optionnel : charger dernier commentaire de l'utilisateur sur ce projet
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .select("content")
        .eq("project_id", project.id)
        .eq("user_session", userIdentifier)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (!commentError && commentData) {
        setComment(commentData.content)
      }
    }
    loadExistingVote()
  }, [project.id])

  const handleRatingSubmit = async () => {
    setSubmitting(true)
    try {
      const userIdentifier = VoteSecurityManager.getUserIdentifier()
      const hasVoted = VoteSecurityManager.hasUserVoted(project.id)

      if (hasVoted) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from("ratings")
          .update({
            presentation: rating.presentation,
            technical: rating.technical,
            innovation: rating.innovation,
            overall: rating.overall,
            updated_at: new Date().toISOString(),
          })
          .eq("project_id", project.id)
          .eq("user_session", userIdentifier)

        if (updateError) throw updateError

        toast({
          title: "Vote modifié",
          description: "Votre évaluation a été mise à jour avec succès",
        })
      } else {
        // Create new vote
        const { error: ratingError } = await supabase.from("ratings").insert({
          project_id: project.id,
          presentation: rating.presentation,
          technical: rating.technical,
          innovation: rating.innovation,
          overall: rating.overall,
          user_session: userIdentifier,
        })

        if (ratingError) throw ratingError

        VoteSecurityManager.recordVote(project.id)

        toast({
          title: "Vote enregistré",
          description: "Votre évaluation a été enregistrée avec succès",
        })
      }

      // Insert or update comment
      if (comment.trim()) {
        // Vérifier si un commentaire existe déjà pour cet utilisateur et projet
        const { data: existingComment, error: commentCheckError } = await supabase
          .from("comments")
          .select("id")
          .eq("project_id", project.id)
          .eq("user_session", userIdentifier)
          .single()

        if (!commentCheckError && existingComment) {
          // Mise à jour du commentaire existant
          const { error: commentUpdateError } = await supabase
            .from("comments")
            .update({ content: comment, updated_at: new Date().toISOString() })
            .eq("id", existingComment.id)

          if (commentUpdateError) throw commentUpdateError
        } else {
          // Création d'un nouveau commentaire
          const { error: commentInsertError } = await supabase.from("comments").insert({
            project_id: project.id,
            content: comment,
            user_session: userIdentifier,
          })

          if (commentInsertError) throw commentInsertError
        }
      }

      onClose()
      onSuccess()
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre évaluation",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number
    onChange: (value: number) => void
    label: string
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 ${star <= value ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Évaluer : {project.title}</DialogTitle>
          <DialogDescription>Donnez votre évaluation selon les critères suivants</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <StarRating
            value={rating.presentation}
            onChange={(value) => setRating({ ...rating, presentation: value })}
            label="Qualité de la présentation"
          />

          <StarRating
            value={rating.technical}
            onChange={(value) => setRating({ ...rating, technical: value })}
            label="Aspect technique"
          />

          <StarRating
            value={rating.innovation}
            onChange={(value) => setRating({ ...rating, innovation: value })}
            label="Innovation"
          />

          <StarRating
            value={rating.overall}
            onChange={(value) => setRating({ ...rating, overall: value })}
            label="Note globale"
          />

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez vos impressions sur ce projet..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleRatingSubmit}
            disabled={submitting || rating.overall === 0}
            className="w-full bg-[#004838] hover:bg-[#073127]"
          >
            {submitting ? "Enregistrement..." : "Enregistrer l'évaluation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
