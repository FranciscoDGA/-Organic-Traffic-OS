import { HeadlessAuthConfig, HeadlessProvider } from './headless-cms.types';
import { HeadlessAdapter } from './adapters/headless-adapter.interface';
import { MockHeadlessAdapter } from './adapters/mock-headless-adapter';
import { StrapiAdapter } from './adapters/strapi-adapter';
import { DirectusAdapter } from './adapters/directus-adapter';
import { SanityAdapter } from './adapters/sanity-adapter';

export function createAdapter(config: HeadlessAuthConfig): HeadlessAdapter {
  switch (config.provider) {
    case 'strapi':
      return new StrapiAdapter(config.api_url, config.api_token);
    case 'directus':
      return new DirectusAdapter(config.api_url, config.api_token);
    case 'sanity':
      return new SanityAdapter(config.project_id || '', config.api_token);
    case 'mock':
    default:
      return new MockHeadlessAdapter();
  }
}
