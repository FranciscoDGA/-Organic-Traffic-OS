export { getAutoLearningService } from './auto-learning.service';
export { analyzeResults, detectPatterns } from './learning-analyzer';
export { rankLessons, filterActive, filterSuggestions } from './learning-ranker';
export { validateLearningRecord } from './learning-validator';
export { createLearningRecord } from './learning-record';
export type { LearningRecord, LearningReport, PatternReport, LearningType, LearningCategory } from './auto-learning.types';
