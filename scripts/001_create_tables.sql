-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotions table
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  bg_color TEXT DEFAULT 'bg-gradient-to-r from-amber-600 to-amber-800',
  text_color TEXT DEFAULT 'text-white',
  image TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about_content table
CREATE TABLE about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT,
  title TEXT,
  subtitle TEXT,
  paragraph1 TEXT,
  paragraph2 TEXT,
  paragraph3 TEXT,
  badge_text TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_content table
CREATE TABLE hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT,
  title TEXT,
  subtitle TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  client_name TEXT,
  client_phone TEXT,
  payment_method TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default super admin
INSERT INTO admin_users (username, password, role) 
VALUES ('Mialashes', 'Mia@admin@4532', 'super_admin');

-- Insert default categories
INSERT INTO categories (name) VALUES 
('Soins Cils'),
('Soins Peau'),
('Accessoires');

-- Insert default products
INSERT INTO products (name, description, price, image, category, stock) VALUES
('Colle Extensions', 'Rétention 12 semaines, Hypoallergénique, longue durée, résistant à l''eau et l''huile. Couleur: noire. Volume: 5ml', 15000, '/colle-15000.jpg', 'Soins Cils', 20),
('Bonder', 'Adapté pour les finitions, après la pose, renforce l''efficacité de la colle et maximise la durée des cils. Volume: 15ml', 10000, '/bonder-10000.jpeg', 'Soins Cils', 15),
('Sealant', 'Gel pratique pour faciliter les effets wispy. Volume: 5ml', 8000, '/sealant-8000.jpg', 'Soins Cils', 25),
('Sérum Cils', 'Pour la pousse des cils naturels. Volume: 5ml', 7000, '/serum-7000.jpeg', 'Soins Cils', 30),
('Shampooing Cils', 'Mousse pour le nettoyage des extensions de cils, pour une hygiène impeccable. Volume: 60ml', 5000, '/shampooing-5000.jpeg', 'Soins Cils', 40),
('Remover', 'Une crème qui enlève les extensions de cils. Volume: 5g', 5000, '/remover-5000.jpeg', 'Soins Cils', 35);

-- Insert default services
INSERT INTO services (title, description, price, image, sort_order) VALUES
('Extensions de Cils', 'Nous vous proposons toutes les nouvelles poses et effets tendances.', 'À partir de 30 000 FCFA', '/eyelash-extensions-service.jpg', 1),
('Soins des Sourcils', 'Brow wax, lifting, brow tint, Microblading, Microshading etc.', 'À partir de 5 000 FCFA', '/african-woman-eyebrow-micropigmentation.jpg', 2),
('Soins du Visage', 'Des soins personnalisés pour révéler l''éclat naturel de votre peau et sublimer votre beauté.', 'À partir de 15 000 FCFA', '/african-woman-facial-treatment.jpg', 3);

-- Insert default promotions
INSERT INTO promotions (title, description, badge, bg_color, text_color, active, sort_order) VALUES
('Nouvelle Cliente ?', 'Bénéficiez de -20% sur votre première pose de cils', 'BIENVENUE', 'bg-gradient-to-r from-amber-600 to-amber-800', 'text-white', true, 1),
('Pack Beauté Complète', 'Extensions + Soin Sourcils + Soin Visage à prix réduit', '-25%', 'bg-gradient-to-r from-stone-800 to-stone-950', 'text-white', true, 2),
('Parrainage', 'Parrainer une amie et recevez chacune un soin offert', 'OFFRE SPÉCIALE', 'bg-gradient-to-r from-rose-400 to-rose-600', 'text-white', true, 3);

-- Insert default about content
INSERT INTO about_content (image, title, subtitle, paragraph1, paragraph2, paragraph3, badge_text) VALUES
('/about-image.jpeg', 'Notre Histoire', 'L''art de sublimer votre regard', 
'Mia Lashes est né d''une passion pour la beauté et le bien-être. Notre fondatrice, experte en extensions de cils et soins du visage, a créé ce havre de paix pour offrir à chaque cliente une expérience unique et personnalisée.',
'Spécialisées dans la mise en valeur du visage, nous proposons des prestations haut de gamme : extensions de cils, micropigmentation des sourcils et soins du visage. Chaque détail est pensé pour révéler une beauté naturelle, élégante et maîtrisée.',
'Notre engagement : vous offrir un service d''exception dans un cadre luxueux et apaisant, où chaque visite devient un moment de pure détente.',
'5+ ans d''expertise');

-- Insert default hero content
INSERT INTO hero_content (image, title, subtitle) VALUES
('/bright-modern-african-beauty-salon-with-natural-light.jpg', 'Révélez l''Éclat de Votre Regard', 'Extensions de cils, soins des sourcils et du visage dans un cadre luxueux');

-- Enable Row Level Security (but allow public read for most tables since this is a public website)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies for public-facing content
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read on promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Allow public read on about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Allow public read on hero_content" ON hero_content FOR SELECT USING (true);

-- Admin write policies (using service role for admin operations)
CREATE POLICY "Allow all for service role on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on promotions" ON promotions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on about_content" ON about_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on hero_content" ON hero_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on sales" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role on admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);
