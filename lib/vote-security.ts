// Système de sécurité pour empêcher les votes multiples
export class VoteSecurityManager {
  private static readonly STORAGE_KEY = "evalproject_votes"
  private static readonly SESSION_KEY = "evalproject_session"
  private static readonly FINGERPRINT_KEY = "evalproject_fingerprint"

  // Génère un identifiant unique basé sur plusieurs facteurs
  static generateUserFingerprint(): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText("Browser fingerprint", 2, 2)
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency || 0,
      navigator.deviceMemory || 0,
    ].join("|")

    return btoa(fingerprint).slice(0, 32)
  }

  // Génère un ID de session unique
  static generateSessionId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    return `${timestamp}_${random}`
  }

  // Initialise la session utilisateur
  static initializeUserSession(): string {
    let sessionId = localStorage.getItem(this.SESSION_KEY)
    let fingerprint = localStorage.getItem(this.FINGERPRINT_KEY)

    if (!sessionId) {
      sessionId = this.generateSessionId()
      localStorage.setItem(this.SESSION_KEY, sessionId)
    }

    if (!fingerprint) {
      fingerprint = this.generateUserFingerprint()
      localStorage.setItem(this.FINGERPRINT_KEY, fingerprint)
    }

    return `${sessionId}_${fingerprint}`
  }

  // Vérifie si l'utilisateur a déjà voté pour ce projet
  static hasUserVoted(projectId: string): boolean {
    const votedProjects = this.getVotedProjects()
    const userIdentifier = this.initializeUserSession()

    return votedProjects.some((vote) => vote.projectId === projectId && vote.userIdentifier === userIdentifier)
  }

  // Enregistre un vote
  static recordVote(projectId: string): void {
    const votedProjects = this.getVotedProjects()
    const userIdentifier = this.initializeUserSession()

    // Supprime l'ancien vote s'il existe (pour permettre la modification)
    const filteredVotes = votedProjects.filter(
      (vote) => !(vote.projectId === projectId && vote.userIdentifier === userIdentifier),
    )

    filteredVotes.push({
      projectId,
      userIdentifier,
      timestamp: Date.now(),
    })

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredVotes))
  }

  // Récupère la liste des votes
  private static getVotedProjects(): Array<{ projectId: string; userIdentifier: string; timestamp: number }> {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Nettoie les anciens votes (plus de 30 jours)
  static cleanupOldVotes(): void {
    const votedProjects = this.getVotedProjects()
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    const recentVotes = votedProjects.filter((vote) => vote.timestamp > thirtyDaysAgo)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentVotes))
  }

  // Obtient l'identifiant utilisateur pour la base de données
  static getUserIdentifier(): string {
    return this.initializeUserSession()
  }
}
