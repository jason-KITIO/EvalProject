-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  field VARCHAR(100) NOT NULL,
  members TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_session VARCHAR(255) NOT NULL,
  presentation INTEGER NOT NULL CHECK (presentation >= 1 AND presentation <= 5),
  technical INTEGER NOT NULL CHECK (technical >= 1 AND technical <= 5),
  innovation INTEGER NOT NULL CHECK (innovation >= 1 AND innovation <= 5),
  overall INTEGER NOT NULL CHECK (overall >= 1 AND overall <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_session)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_session VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ratings_project_id ON ratings(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_field ON projects(field);

-- Insert sample data
INSERT INTO projects (title, description, field, members) VALUES
('Système de Gestion Hospitalière', 'Application web pour la gestion des patients et du personnel médical', 'informatique', ARRAY['Alice Martin', 'Bob Dupont', 'Claire Rousseau']),
('Pont Intelligent', 'Conception d''un pont avec capteurs IoT pour surveillance structurelle', 'genie-civil', ARRAY['David Moreau', 'Emma Leroy']),
('Robot Autonome', 'Robot de navigation autonome avec intelligence artificielle', 'electronique', ARRAY['François Bernard', 'Gabrielle Petit', 'Henri Dubois']),
('Moteur Hybride', 'Développement d''un moteur hybride haute performance', 'mecanique', ARRAY['Isabelle Roux', 'Julien Blanc']),
('Plateforme E-commerce', 'Solution complète de commerce électronique avec IA', 'informatique', ARRAY['Kevin Noir', 'Laura Vert', 'Marc Bleu']),
('Analyse Financière Automatisée', 'Système d''analyse et de prédiction financière', 'gestion', ARRAY['Nina Rose', 'Oscar Jaune']);
