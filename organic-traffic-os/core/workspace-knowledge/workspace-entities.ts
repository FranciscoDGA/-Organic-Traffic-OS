import { Entity } from './workspace-knowledge.types';

export const workspaceEntities: Record<string, Entity[]> = {
  passacumaru: [
    { id: 'edital', name: 'Edital', type: 'documento', description: 'Documento oficial que convoca para concurso', relationships: ['concurso', 'banca'], importance: 10, synonyms: ['aviso', 'publicacao', 'convocatoria'], required: true },
    { id: 'concurso', name: 'Concurso', type: 'evento', description: 'Processo seletivo para cargos publicos', relationships: ['edital', 'banca', 'prova'], importance: 10, synonyms: ['seletivo', 'processo'], required: true },
    { id: 'banca', name: 'Banca', type: 'organizacao', description: 'Organizacao responsavel pela prova', relationships: ['concurso', 'prova'], importance: 9, synonyms: ['organizadora', 'certadora'], required: true },
    { id: 'prova', name: 'Prova', type: 'evento', description: 'Avaliacao do concurso', relationships: ['concurso', 'banca'], importance: 9, synonyms: ['avaliacao', 'exame'], required: true },
    { id: 'aprovacao', name: 'Aprovacao', type: 'resultado', description: 'Resultado positivo no concurso', relationships: ['concurso', 'prova'], importance: 8, synonyms: ['aprovado', 'classificado'], required: false },
    { id: 'inss', name: 'INSS', type: 'orgao', description: 'Instituto Nacional do Seguro Social', relationships: ['concurso', 'edital'], importance: 7, synonyms: ['previdencia'], required: false },
  ],
  garimpeibrasil: [
    { id: 'renda-fixa', name: 'Renda Fixa', type: 'investimento', description: 'Investimento com retorno predefinido', relationships: ['cdb', 'lci', 'lca', 'tesouro-direto'], importance: 10, synonyms: ['renda fixa', 'fixed income'], required: true },
    { id: 'cdb', name: 'CDB', type: 'investimento', description: 'Certificado de Deposito Bancario', relationships: ['renda-fixa', 'banco'], importance: 9, synonyms: ['certificado'], required: false },
    { id: 'selic', name: 'Selic', type: 'indicador', description: 'Taxa basica de juros', relationships: ['renda-fixa', 'poupanca'], importance: 10, synonyms: ['taxa selic', 'juros'], required: true },
    { id: 'tesouro-direto', name: 'Tesouro Direto', type: 'investimento', description: 'Investimento em titulos publicos', relationships: ['renda-fixa', 'governo'], importance: 9, synonyms: ['tesouro', 'titulos'], required: false },
  ],
};

export function getWorkspaceEntities(workspaceId: string): Entity[] {
  return workspaceEntities[workspaceId] || [];
}
