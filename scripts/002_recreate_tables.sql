-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS about_content CASCADE;
DROP TABLE IF EXISTS hero_content CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions Table
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  bg_color TEXT DEFAULT 'bg-gradient-to-r from-amber-500 to-amber-600',
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Content Table
CREATE TABLE about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT,
  title TEXT,
  subtitle TEXT,
  paragraph1 TEXT,
  paragraph2 TEXT,
  paragraph3 TEXT,
  badge_text TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Content Table
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT,
  title TEXT,
  subtitle TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT,
  client_phone TEXT,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default super admin (password: Mia@admin@4532)
INSERT INTO admin_users (username, password, role) VALUES 
('Mialashes', 'Mia@admin@4532', 'super_admin');

-- Insert default categories
INSERT INTO categories (name) VALUES 
('Soins Cils'),
('Soins Sourcils'),
('Soins Visage'),
('Accessoires');

-- Insert default products
INSERT INTO products (name, description, price, image, category, stock) VALUES 
('Colle Extensions', 'Rétention 12 semaines, Hypoallergénique, longue durée, résistant à l''eau et l''huile. Couleur: noire, Volume: 5ml', 15000, '/colle-15000.jpg', 'Soins Cils', 25),
('Bonder', 'Adapté pour les finitions, après la pose, renforce l''efficacité de la colle et maximise la durée des cils. Volume: 15ml', 10000, '/bonder-10000.jpeg', 'Soins Cils', 20),
('Sealant', 'Gel pratique pour faciliter les effets wispy. Volume: 5ml', 8000, '/sealant-8000.jpg', 'Soins Cils', 30),
('Sérum Cils', 'Pour la pousse des cils naturels. Volume: 5ml', 7000, '/serum-7000.jpeg', 'Soins Cils', 35),
('Shampooing Cils', 'Mousse pour le nettoyage des extensions de cils, pour une hygiène impeccable. Volume: 60ml', 5000, '/shampooing-5000.jpeg', 'Soins Cils', 40),
('Remover', 'Une crème qui enlève les extensions de cils. Volume: 5g', 5000, '/remover-5000.jpeg', 'Soins Cils', 30);

-- Insert default services
INSERT INTO services (title, description, price, image, sort_order) VALUES 
('Extensions de Cils', 'Nous vous proposons toutes les nouvelles poses et effets tendances pour sublimer votre regard.', 'À partir de 30 000 FCFA', '/eyelash-extensions-service.jpg', 1),
('Soins des Sourcils', 'Brow wax, lifting, brow tint, Microblading, Microshading etc.', 'À partir de 5 000 FCFA', '/african-woman-eyebrow-micropigmentation.jpg', 2),
('Soins du Visage', 'Des soins personnalisés pour révéler l''éclat naturel de votre peau et sublimer votre beauté.', 'À partir de 15 000 FCFA', '/african-woman-facial-treatment.jpg', 3);

-- Insert default promotions
INSERT INTO promotions (title, description, badge, bg_color, is_active, sort_order) VALUES 
('Offre de Bienvenue', 'Profitez de -20% sur votre première pose d''extensions de cils', '-20%', 'bg-gradient-to-r from-amber-500 to-amber-600', true, 1),
('Pack Beauté Complète', 'Extensions + Soins sourcils + Soin visage à prix réduit', 'PACK', 'bg-gradient-to-r from-stone-800 to-stone-900', true, 2),
('Parrainage', 'Parrainez une amie et recevez un soin gratuit', 'BONUS', 'bg-gradient-to-r from-amber-600 to-amber-700', true, 3);

-- Insert default about content
INSERT INTO about_content (image, title, subtitle, paragraph1, paragraph2, paragraph3, badge_text) VALUES 
('/about-image.jpeg', 'Notre Histoire', 'L''Excellence au Service de Votre Beauté', 
'Mia Lashes est née d''une passion pour la beauté et le regard. Notre fondatrice, experte en extensions de cils et soins du visage, a créé ce studio pour offrir des prestations haut de gamme dans un cadre élégant et raffiné.',
'Spécialisées dans les extensions de cils, la micropigmentation des sourcils et les soins du visage, nous mettons notre expertise au service de votre beauté naturelle. Chaque détail est pensé pour révéler votre éclat.',
'Notre engagement : vous offrir une expérience unique où professionnalisme, qualité des produits et attention personnalisée se conjuguent pour sublimer votre regard.',
'+ de 5 ans d''expertise');

-- Insert default hero content  
INSERT INTO hero_content (image, title, subtitle) VALUES 
('/bright-modern-african-beauty-salon-with-natural-light.jpg', 'Révélez l''Éclat de Votre Regard', 'Extensions de cils, soins des sourcils et du visage par des expertes passionnées');

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Allow public read about" ON about_content FOR SELECT USING (true);
CREATE POLICY "Allow public read hero" ON hero_content FOR SELECT USING (true);

-- Create policies for all operations (admin will use service role key)
CREATE POLICY "Allow all admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Allow all categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all services" ON services FOR ALL USING (true);
CREATE POLICY "Allow all promotions" ON promotions FOR ALL USING (true);
CREATE POLICY "Allow all about" ON about_content FOR ALL USING (true);
CREATE POLICY "Allow all hero" ON hero_content FOR ALL USING (true);
CREATE POLICY "Allow all sales" ON sales FOR ALL USING (true);
