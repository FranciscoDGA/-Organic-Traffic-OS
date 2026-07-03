import { CoreError, CoreLayer } from '../types';
export class OrganicCoreError extends Error implements CoreError {
  constructor(public code: string, message: string, public layer: CoreLayer, public recoverable: boolean) {
    super(message);
    this.name = 'OrganicCoreError';
  }
}
