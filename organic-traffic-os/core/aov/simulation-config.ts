import { SimulationConfig } from './autonomous.types';

export const defaultConfig: SimulationConfig = {
  totalDays: 30,
  workspaces: ['passacumaru', 'qualoseguro', 'utilprobrasil', 'tabuometro', 'aiagencyos'],
  mode: 'sandbox',
  autoStart: false,
};

export const workspaceMissionWeights: Record<string, { types: string[]; avgPerDay: number }> = {
  passacumaru: { types: ['new_article', 'refresh', 'faq'], avgPerDay: 2.5 },
  qualoseguro: { types: ['new_article', 'campaign', 'landing'], avgPerDay: 3.0 },
  utilprobrasil: { types: ['new_article', 'review', 'comparison'], avgPerDay: 2.0 },
  tabuometro: { types: ['new_article', 'editorial', 'analysis'], avgPerDay: 3.5 },
  aiagencyos: { types: ['new_article', 'case_study', 'pillar_page'], avgPerDay: 1.8 },
};
