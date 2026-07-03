import { getAutoLearningService } from '../../../../../organic-traffic-os/core/auto-learning/auto-learning.service';

export function getAutoLearningServiceSingleton() {
  return getAutoLearningService();
}
