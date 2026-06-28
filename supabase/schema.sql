-- ═══════════════════════════════════════════════════════════════
-- قصتي أنا — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- ─── ENUMS ──────────────────────────────────────────────────────
CREATE TYPE language_type AS ENUM ('ar', 'en');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE product_type AS ENUM ('pdf', 'print', 'bundle');
CREATE TYPE order_status AS ENUM ('pending','generating','qc_review','ready','shipped','delivered','refunded');
CREATE TYPE illustration_style AS ENUM ('watercolor','3d','classic','soft_cartoon','fantasy','comic');
CREATE TYPE story_category AS ENUM ('celebrations','islamic','adventure','sports','educational','character','fantasy','custom');
CREATE TYPE user_role AS ENUM ('customer','admin','operations','content','finance');
CREATE TYPE discount_type AS ENUM ('percentage','fixed');
CREATE TYPE upsell_type AS ENUM ('audio','video','coloring_book','poster','extra_copy');

-- ─── USERS ──────────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  country TEXT DEFAULT 'SA',
  language language_type DEFAULT 'ar',
  role user_role DEFAULT 'customer',
  referral_code TEXT UNIQUE DEFAULT upper(substring(md5(random()::text), 1, 8)),
  referral_count INT DEFAULT 0,
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── STORIES ────────────────────────────────────────────────────
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  category story_category NOT NULL,
  emoji TEXT DEFAULT '📚',
  cover_gradient TEXT DEFAULT 'linear-gradient(160deg,#667EEA,#764BA2)',
  age_min INT DEFAULT 3,
  age_max INT DEFAULT 12,
  page_count INT DEFAULT 20,
  price_sar DECIMAL(8,2) DEFAULT 29.00,
  price_aed DECIMAL(8,2) DEFAULT 29.00,
  price_kwd DECIMAL(8,2) DEFAULT 2.90,
  price_usd DECIMAL(8,2) DEFAULT 8.00,
  available_styles illustration_style[] DEFAULT ARRAY['watercolor','3d','classic','soft_cartoon']::illustration_style[],
  text_prompt_ar TEXT,
  text_prompt_en TEXT,
  image_prompt TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  order_count INT DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ORDERS ─────────────────────────────────────────────────────
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || upper(substring(md5(random()::text), 1, 8)),
  user_id UUID REFERENCES users(id),
  story_id UUID NOT NULL REFERENCES stories(id),
  product_type product_type NOT NULL,
  illustration_style illustration_style DEFAULT 'watercolor',
  language language_type DEFAULT 'ar',

  -- Child info (stored as JSONB for flexibility)
  child_name TEXT NOT NULL,
  child_age INT NOT NULL,
  child_gender gender_type NOT NULL,
  child_info JSONB DEFAULT '{}', -- personality, animal, color, hobby, dream, dedication, photo_url

  -- Upsells
  upsells JSONB DEFAULT '[]',

  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  coupon_code TEXT,

  -- Status
  status order_status DEFAULT 'pending',

  -- Delivery
  pdf_url TEXT,
  audio_url TEXT,
  video_url TEXT,
  coloring_book_url TEXT,
  tracking_number TEXT,
  shipping_address JSONB,

  -- Payment
  payment_id TEXT,
  payment_method TEXT,
  paid_at TIMESTAMPTZ,

  -- Admin
  admin_notes TEXT,
  qc_approved_by UUID REFERENCES users(id),
  qc_approved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── GENERATED STORIES ──────────────────────────────────────────
CREATE TABLE generated_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  story_text JSONB, -- array of {page: int, text: string, image_prompt: string}
  pdf_url TEXT,
  cover_image_url TEXT,
  generation_model TEXT,
  generation_tokens INT,
  generation_cost DECIMAL(8,4),
  generation_time_ms INT,
  attempt_count INT DEFAULT 1,
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── REVIEWS ────────────────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  user_id UUID NOT NULL REFERENCES users(id),
  story_id UUID NOT NULL REFERENCES stories(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  child_name TEXT,
  child_age INT,
  country TEXT,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── COUPONS ────────────────────────────────────────────────────
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(8,2) NOT NULL,
  min_order_value DECIMAL(8,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── COUPON USES ────────────────────────────────────────────────
CREATE TABLE coupon_uses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  discount_applied DECIMAL(8,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(coupon_id, order_id)
);

-- ─── REFERRALS ──────────────────────────────────────────────────
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_id UUID NOT NULL REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  reward_type TEXT DEFAULT 'free_story',
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- ─── EMAIL NOTIFICATIONS LOG ─────────────────────────────────────
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  email_type TEXT NOT NULL, -- 'order_confirm','story_ready','shipped','review_request'
  to_email TEXT NOT NULL,
  subject TEXT,
  status TEXT DEFAULT 'sent',
  provider_id TEXT, -- Resend message ID
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INDEXES ────────────────────────────────────────────────────
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_story_id ON orders(story_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_is_active ON stories(is_active);
CREATE INDEX idx_reviews_story_id ON reviews(story_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_generated_order_id ON generated_stories(order_id);

-- ─── TRIGGERS: auto update updated_at ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── TRIGGER: update story stats on review approval ─────────────
CREATE OR REPLACE FUNCTION update_story_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_approved = true THEN
    UPDATE stories SET
      rating_avg = (SELECT AVG(rating) FROM reviews WHERE story_id = NEW.story_id AND is_approved = true),
      rating_count = (SELECT COUNT(*) FROM reviews WHERE story_id = NEW.story_id AND is_approved = true)
    WHERE id = NEW.story_id;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER review_rating_update AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_story_rating();

-- ─── TRIGGER: update user stats on order ────────────────────────
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'ready' OR NEW.status = 'shipped' OR NEW.status = 'delivered' THEN
    UPDATE users SET
      total_orders = (SELECT COUNT(*) FROM orders WHERE user_id = NEW.user_id AND status NOT IN ('pending','refunded')),
      total_spent = (SELECT COALESCE(SUM(total), 0) FROM orders WHERE user_id = NEW.user_id AND status NOT IN ('pending','refunded'))
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER order_user_stats AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- ─── RLS: Row Level Security ─────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_stories ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "users_own_data" ON users FOR ALL USING (auth.uid() = id);

-- Users can read/insert their own orders
CREATE POLICY "orders_own_data" ON orders FOR ALL USING (auth.uid() = user_id);

-- Users can read their own generated stories
CREATE POLICY "gen_own_data" ON generated_stories
FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Anyone can read approved reviews
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "reviews_own_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anyone can read active stories (no RLS needed, public table)
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;

-- ─── SEED DATA: Initial Stories ──────────────────────────────────
INSERT INTO stories (slug, title_ar, title_en, category, emoji, cover_gradient, age_min, age_max, page_count, is_featured, sort_order,
  text_prompt_ar, image_prompt) VALUES

('birthday-hero', 'بطل عيد الميلاد', 'Birthday Hero', 'celebrations', '🎂',
 'linear-gradient(160deg,#667EEA,#764BA2)', 3, 10, 20, true, 1,
 'اكتب قصة أطفال عربية جميلة بعنوان "بطل عيد الميلاد" لطفل يُدعى [CHILD_NAME]، عمره [AGE]، [GENDER]. شخصيته: [PERSONALITY]. القصة تدور حول يوم عيد ميلاده الرائع. اكتبها بلغة عربية فصيحة مبسطة مناسبة للعمر، ٢٠ صفحة، كل صفحة ٣-٤ جمل. اسم الطفل يظهر في كل صفحة تقريباً.',
 'Warm and magical birthday illustration for a children''s book, watercolor style, vibrant colors, [CHILD_GENDER] child as hero, festive birthday decorations, stars and balloons'),

('world-cup-dream', 'حلم كأس العالم', 'World Cup Dream', 'sports', '⚽',
 'linear-gradient(160deg,#F093FB,#F5576C)', 4, 12, 22, true, 2,
 'اكتب قصة أطفال عربية بعنوان "حلم كأس العالم" لطفل يُدعى [CHILD_NAME]، عمره [AGE]. القصة عن رحلته لتحقيق حلمه في كرة القدم وتمثيل بلده في كأس العالم.',
 'Football/soccer themed children''s book illustration, young [CHILD_GENDER] player as hero, stadium, world cup trophy, vibrant sports colors'),

('space-explorer', 'رحلة إلى الفضاء', 'Space Explorer', 'adventure', '🚀',
 'linear-gradient(160deg,#4FACF7,#00F2FE)', 4, 10, 18, true, 3,
 'اكتب قصة أطفال عربية بعنوان "رحلة إلى الفضاء" لطفل يُدعى [CHILD_NAME]، عمره [AGE]. رحلة خيالية إلى الفضاء يكتشف فيها الكواكب والنجوم.',
 'Space adventure children''s book illustration, young [CHILD_GENDER] astronaut, colorful planets, stars, rocket ship, magical universe'),

('ramadan-journey', 'رحلة رمضان', 'Ramadan Journey', 'islamic', '🕌',
 'linear-gradient(160deg,#43E97B,#38F9D7)', 4, 12, 20, true, 4,
 'اكتب قصة أطفال عربية بعنوان "رحلة رمضان" لطفل يُدعى [CHILD_NAME]، عمره [AGE]. قصة تعليمية جميلة عن قيم رمضان الكريم، الصوم، الصدقة، والصلاة بأسلوب محبب للأطفال.',
 'Ramadan themed children''s book illustration, Islamic patterns, crescent moon, lanterns, warm golden colors, Arabic architecture'),

('brave-princess', 'الأميرة الشجاعة', 'Brave Princess', 'character', '👸',
 'linear-gradient(160deg,#FA709A,#FEE140)', 3, 9, 18, false, 5,
 'اكتب قصة أطفال عربية بعنوان "الأميرة الشجاعة" لطفلة تُدعى [CHILD_NAME]، عمرها [AGE]. قصة عن أميرة شجاعة وذكية تحل المشكلات بالحكمة لا بالسيف.',
 'Brave princess children''s book illustration, young girl as princess, magical castle, soft pink and gold colors, empowering and adventurous'),

('first-day-school', 'أول يوم في المدرسة', 'First Day at School', 'educational', '🏫',
 'linear-gradient(160deg,#A18CD1,#FBC2EB)', 3, 7, 16, false, 6,
 'اكتب قصة أطفال عربية بعنوان "أول يوم في المدرسة" لطفل يُدعى [CHILD_NAME]، عمره [AGE]. قصة مطمئنة ومشجعة عن تجربة أول يوم مدرسي.',
 'First day of school children''s book illustration, young child with backpack, colorful classroom, friendly teacher, cheerful morning'),

('ocean-kingdom', 'مملكة المحيط', 'Ocean Kingdom', 'fantasy', '🌊',
 'linear-gradient(160deg,#FF9A9E,#FECFEF)', 4, 10, 20, false, 7,
 'اكتب قصة أطفال عربية بعنوان "مملكة المحيط" لطفل يُدعى [CHILD_NAME]، عمره [AGE]. مغامرة خيالية تحت الماء في مملكة المحيط السحرية.',
 'Underwater ocean kingdom children''s book illustration, colorful fish, coral reefs, magical sea creatures, blue and turquoise colors'),

('future-doctor', 'أنا طبيب المستقبل', 'I Am a Future Doctor', 'educational', '🩺',
 'linear-gradient(160deg,#A1C4FD,#C2E9FB)', 3, 8, 16, false, 8,
 'اكتب قصة أطفال عربية بعنوان "أنا طبيب المستقبل" لطفل يُدعى [CHILD_NAME]، عمره [AGE]. قصة ملهمة عن طفل يحلم بأن يصبح طبيباً ويساعد الناس.',
 'Doctor themed children''s book illustration, young child as doctor, medical tools, hospital, caring and inspiring, soft blue and white colors'),

('eid-champion', 'بطل العيد', 'Eid Champion', 'islamic', '🌙',
 'linear-gradient(160deg,#FDDB92,#D1FDFF)', 3, 10, 18, false, 9,
 'اكتب قصة أطفال عربية بعنوان "بطل العيد" لطفل يُدعى [CHILD_NAME]، عمره [AGE]. قصة جميلة عن فرحة العيد والعطاء والمحبة.',
 'Eid celebration children''s book illustration, Islamic holiday, crescent moon and star, gift giving, family celebration, warm festive colors');
