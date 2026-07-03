import { getExperimentService } from '../../../../../organic-traffic-os/core/experimentation/experimentation.engine';

export function getExperimentServiceSingleton() {
  return getExperimentService();
}
