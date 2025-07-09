import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EvalProject - Plateforme d'évaluation de projets universitaires",
  description:
    "Système de notation anonyme pour les soutenances universitaires avec gestion des critères multiples et export des résultats.",
  keywords: "évaluation, projets, université, notation, soutenance, anonyme",
  authors: [
    {
      name: "Jason Kitio",
      url: "https://github.com/JasonKitio",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
