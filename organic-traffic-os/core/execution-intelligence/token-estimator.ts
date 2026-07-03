import { ExecutionStrategy } from './execution.types';

const strategyMultipliers: Record<ExecutionStrategy, { inputMult: number; outputMult: number; timeMult: number }> = {
  'fast': { inputMult: 1, outputMult: 0.5, timeMult: 0.5 },
  'balanced': { inputMult: 1, outputMult: 1, timeMult: 1 },
  'premium': { inputMult: 1.2, outputMult: 1.5, timeMult: 1.5 },
  'low-cost': { inputMult: 0.8, outputMult: 0.5, timeMult: 0.8 },
  'deep-research': { inputMult: 2, outputMult: 3, timeMult: 3 },
  'long-context': { inputMult: 1.5, outputMult: 2, timeMult: 2 },
  'multi-step': { inputMult: 1.3, outputMult: 2, timeMult: 2.5 },
};

export function estimateTokens(contextTokens: number, strategy: ExecutionStrategy): { inputTokens: number; outputTokens: number } {
  const m = strategyMultipliers[strategy];
  return {
    inputTokens: Math.ceil(contextTokens * m.inputMult),
    outputTokens: Math.ceil(contextTokens * m.outputMult * 0.3),
  };
}

export function estimateCost(inputTokens: number, outputTokens: number, costPerInput: number, costPerOutput: number): number {
  return inputTokens * costPerInput + outputTokens * costPerOutput;
}

export function estimateTimeMs(inputTokens: number, outputTokens: number, strategy: ExecutionStrategy): number {
  const m = strategyMultipliers[strategy];
  const baseTime = (inputTokens + outputTokens) * 0.01;
  return Math.ceil(baseTime * m.timeMult);
}
