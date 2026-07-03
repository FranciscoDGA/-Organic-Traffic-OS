-- organic-traffic-os/supabase/schema.sql

-- Habilitar a extensão pgcrypto para UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabelas da Sprint 01.5

-- 1. blogs
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT,
    niche TEXT,
    audience TEXT,
    main_goal TEXT,
    monetization TEXT,
    tone_of_voice TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. organic_keywords
CREATE TABLE IF NOT EXISTS public.organic_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    search_intent TEXT,
    estimated_volume INTEGER,
    estimated_difficulty TEXT,
    monetization_potential TEXT,
    priority TEXT,
    cluster TEXT,
    source TEXT,
    status TEXT DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. content_ideas
CREATE TABLE IF NOT EXISTS public.content_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES public.organic_keywords(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content_type TEXT,
    cluster TEXT,
    priority TEXT,
    status TEXT DEFAULT 'draft',
    suggested_date DATE,
    cta TEXT,
    related_product TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. seo_briefs
CREATE TABLE IF NOT EXISTS public.seo_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
    content_idea_id UUID REFERENCES public.content_ideas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    primary_keyword TEXT,
    secondary_keywords JSONB,
    search_intent TEXT,
    outline JSONB,
    faq JSONB,
    internal_links JSONB,
    external_references JSONB,
    cta TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. agent_tasks
CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL,
    task_type TEXT NOT NULL,
    input JSONB,
    output JSONB,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. agent_logs
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.agent_tasks(id) ON DELETE CASCADE,
    agent_name TEXT,
    level TEXT DEFAULT 'info',
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. ai_usage_logs
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.agent_tasks(id) ON DELETE CASCADE,
    provider TEXT,
    model TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    estimated_cost NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organic_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Políticas Iniciais (Apenas Service Role via backend)
-- O frontend não acessa os dados diretamente nesta fase da Sprint 01.5.

CREATE POLICY "Bloquear acesso publico a blogs" ON public.blogs FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico a keywords" ON public.organic_keywords FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico a ideas" ON public.content_ideas FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico a briefs" ON public.seo_briefs FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico a tasks" ON public.agent_tasks FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico a logs" ON public.agent_logs FOR ALL USING (false);
CREATE POLICY "Bloquear acesso publico a ai_usage" ON public.ai_usage_logs FOR ALL USING (false);
