import fs from 'fs';
import path from 'path';
import { 
  BriefTemplate, SearchIntent, Entities, Questions, Outline, SeoBrief, InternalLinks, References, WritingGuidelines
} from '../models/brief-models';
import { BriefScoreEngine } from './brief-score';

export class BriefEngine {
  static async generateBrief(blogId: string, itemId: string, itemTitle: string): Promise<any> {
    const dir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'briefs', itemId);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Mock data based on inputs
    const template: BriefTemplate = {
      id: itemId,
      titulo: itemTitle,
      objetivo: 'Gerar tráfego orgânico',
      categoria: 'Geral',
      cluster: 'Principal',
      tipo: 'Artigo SEO',
      status: 'Aprovado',
      versao: 1,
      autor: 'AI Brief Engine',
      criado_em: new Date().toISOString()
    };

    const intent: SearchIntent = {
      intencao_principal: 'Informacional',
      intencoes_secundarias: ['Transacional'],
      problemas: ['Falta de clareza', 'Dúvidas sobre o tema'],
      objetivos: ['Entender o conceito', 'Passar na prova']
    };

    const entities: Entities = {
      obrigatorias: ['Concurso', 'Edital', 'Aprovação'],
      secundarias: ['Banca IVIN', 'Prefeitura']
    };

    const questions: Questions = {
      obrigatorias: ['O que é?', 'Como funciona?'],
      complementares: ['Quando sai o edital?'],
      relacionadas: ['Vale a pena?']
    };

    const outline: Outline = {
      h1: itemTitle,
      introducao: 'Introdução magnética sobre o tema',
      h2: ['Visão Geral', 'Principais Pontos', 'Como se Preparar'],
      h3: ['Detalhe 1', 'Detalhe 2'],
      h4: [],
      resumo: 'Resumo do artigo em 2 parágrafos',
      faq: true,
      cta: 'Assine nossa Newsletter'
    };

    const seo: SeoBrief = {
      meta_title: `${itemTitle} - Guia Definitivo`,
      meta_description: `Descubra tudo sobre ${itemTitle} neste guia completo e atualizado.`,
      slug: itemTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      keyword_principal: itemTitle,
      keywords_secundarias: ['guia', 'completo', 'passo a passo'],
      schema_recomendado: 'Article'
    };

    const links: InternalLinks = {
      paginas_recomendadas: ['/home', '/sobre'],
      artigos_relacionados: ['/artigo-anterior'],
      categorias: ['/categoria-principal'],
      produtos: []
    };

    const refs: References = {
      fontes: ['http://exemplo.com/fonte-oficial'],
      documentacao: [],
      links_oficiais: [],
      observacoes: 'Baseado em dados atuais.'
    };

    const guidelines: WritingGuidelines = {
      tom: 'Profissional e Encorajador',
      publico: 'Concurseiros',
      objetivo: 'Informar e Engajar',
      nivel_tecnico: 'Intermediário',
      tamanho_esperado: '1500 palavras',
      formato: 'Blog Post'
    };

    // Calculate Score
    const score = BriefScoreEngine.calculate(intent, entities, questions, outline, seo, links, refs);

    // Save 9 JSONs
    fs.writeFileSync(path.join(dir, 'brief-template.json'), JSON.stringify({ ...template, score }, null, 2));
    fs.writeFileSync(path.join(dir, 'search-intent.json'), JSON.stringify(intent, null, 2));
    fs.writeFileSync(path.join(dir, 'entities.json'), JSON.stringify(entities, null, 2));
    fs.writeFileSync(path.join(dir, 'questions.json'), JSON.stringify(questions, null, 2));
    fs.writeFileSync(path.join(dir, 'outline.json'), JSON.stringify(outline, null, 2));
    fs.writeFileSync(path.join(dir, 'seo-brief.json'), JSON.stringify(seo, null, 2));
    fs.writeFileSync(path.join(dir, 'internal-links.json'), JSON.stringify(links, null, 2));
    fs.writeFileSync(path.join(dir, 'references.json'), JSON.stringify(refs, null, 2));
    fs.writeFileSync(path.join(dir, 'writing-guidelines.json'), JSON.stringify(guidelines, null, 2));

    return { id: itemId, score, status: 'Gerado' };
  }
}
