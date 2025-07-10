import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Star,
  Users,
  BarChart3,
  Shield,
  Zap,
  Globe,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#004838] rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              EvalProject
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900"
            >
              Comment ça marche
            </Link>
            <Link href="/guide" className="text-gray-600 hover:text-gray-900">
              Guide d'utilisation
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {/* <Link href="/admin/login">
              <Button variant="ghost" className="text-gray-600">
                Se connecter
              </Button>
            </Link> */}
            <Link href="/projects">
              <Button className="bg-[#004838] hover:bg-[#073127] text-white">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Une plateforme pour évaluer
              <span className="text-[#004838]">
                {" "}
                les projets universitaires
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Simplifiez l'évaluation des soutenances avec notre système de
              notation anonyme, transparent et efficace. Gérez facilement les
              critères, les commentaires et les résultats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button
                  size="lg"
                  className="bg-[#004838] hover:bg-[#073127] text-white px-8 py-3"
                >
                  Commencer l'évaluation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 px-8 py-3 bg-transparent"
                >
                  <BookOpen className="mr-2 w-5 h-5" />
                  Voir le guide
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="relative mt-16">
            <div className="absolute top-10 left-10 w-16 h-16 bg-[#E2FB6C] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-12 h-12 bg-[#004838] rounded-full opacity-10 animate-bounce"></div>
            <div className="absolute bottom-10 left-1/4 w-8 h-8 bg-[#073127] rounded-full opacity-15"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#004838] mb-2">500+</div>
              <div className="text-gray-600">Projets évalués</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#004838] mb-2">50+</div>
              <div className="text-gray-600">Universités partenaires</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#004838] mb-2">10k+</div>
              <div className="text-gray-600">Évaluations réalisées</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités avancées pour une évaluation optimale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre plateforme offre tous les outils nécessaires pour gérer
              efficacement l'évaluation de vos projets universitaires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-[#E2FB6C] rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#004838]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Évaluation anonyme
                </h3>
                <p className="text-gray-600">
                  Système de notation anonyme garantissant l'objectivité et la
                  transparence des évaluations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-[#E2FB6C] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#004838]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Critères multiples
                </h3>
                <p className="text-gray-600">
                  Définissez plusieurs critères d'évaluation adaptés à vos
                  besoins spécifiques.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-[#E2FB6C] rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#004838]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Gestion des équipes
                </h3>
                <p className="text-gray-600">
                  Affichez les membres de chaque projet et gérez facilement les
                  informations d'équipe.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-[#E2FB6C] rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#004838]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Import/Export Excel
                </h3>
                <p className="text-gray-600">
                  Importez vos projets depuis Excel et exportez les résultats
                  facilement.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-[#E2FB6C] rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-[#004838]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Responsive Design
                </h3>
                <p className="text-gray-600">
                  Interface optimisée pour tous les appareils : mobile, tablette
                  et ordinateur.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-[#E2FB6C] rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-[#004838]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Classements automatiques
                </h3>
                <p className="text-gray-600">
                  Génération automatique des classements basés sur les notes et
                  critères définis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple et efficace en quelques étapes pour évaluer
              vos projets universitaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#004838] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Importez vos projets
              </h3>
              <p className="text-gray-600">
                Ajoutez facilement vos projets via un fichier Excel ou
                manuellement. Organisez-les par filière et définissez les
                équipes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#004838] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Évaluez anonymement
              </h3>
              <p className="text-gray-600">
                Les évaluateurs notent les projets selon plusieurs critères sans
                avoir besoin de créer un compte. Un système empêche les votes
                multiples.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#004838] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Consultez les résultats
              </h3>
              <p className="text-gray-600">
                Accédez aux classements, notes moyennes et commentaires.
                Exportez facilement toutes les données au format Excel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages des universités qui utilisent déjà notre plateforme
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Cette plateforme a révolutionné notre processus d'évaluation. Les étudiants apprécient la
                  transparence et nous gagnons un temps précieux."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#E2FB6C] rounded-full flex items-center justify-center mr-3">
                    <span className="font-semibold text-[#004838]">MD</span>
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Marie Dubois</div>
                    <div className="text-sm text-gray-500">Université de Lyon</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "L'interface est intuitive et le système de notation anonyme garantit l'objectivité. Nos soutenances
                  sont maintenant plus équitables."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#E2FB6C] rounded-full flex items-center justify-center mr-3">
                    <span className="font-semibold text-[#004838]">PL</span>
                  </div>
                  <div>
                    <div className="font-semibold">Prof. Pierre Leclerc</div>
                    <div className="text-sm text-gray-500">École Polytechnique</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "L'export des données nous permet d'analyser facilement les tendances. Un outil indispensable pour
                  notre département."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#E2FB6C] rounded-full flex items-center justify-center mr-3">
                    <span className="font-semibold text-[#004838]">AM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Anne Martin</div>
                    <div className="text-sm text-gray-500">Université de Bordeaux</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-[#004838] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à révolutionner vos évaluations ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez les universités qui font confiance à notre plateforme pour
            gérer leurs évaluations de projets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects">
              <Button
                size="lg"
                className="bg-[#E2FB6C] text-[#004838] hover:bg-[#E2FB6C]/90 px-8 py-3"
              >
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/guide">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 px-8 py-3 bg-transparent"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Voir le guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#E2FB6C] rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#004838]" />
                </div>
                <span className="text-xl font-semibold">EvalProject</span>
              </div>
              <p className="text-gray-400">
                La plateforme de référence pour l'évaluation des projets
                universitaires.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Statut
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Carrières
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Jason Kitio. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
