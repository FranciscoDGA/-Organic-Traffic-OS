export interface ModuleManifest {
  name: string;
  version: string;
  dependencies: string[];
  agents: string[];
  workflows: string[];
  routes: string[];
  permissions: string[];
}
