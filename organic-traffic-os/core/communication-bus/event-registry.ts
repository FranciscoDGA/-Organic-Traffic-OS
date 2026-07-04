import { EventType } from './communication.types';

interface RegistryEntry { id: string; eventType: EventType; component: string; registeredAt: string; }

const registry: RegistryEntry[] = [];

export function registerComponent(id: string, eventTypes: EventType[], component: string) {
  eventTypes.forEach(type => { registry.push({ id, eventType: type, component, registeredAt: new Date().toISOString() }); });
}

export function unregisterComponent(id: string) {
  const idx = registry.findIndex(r => r.id === id);
  if (idx !== -1) registry.splice(idx, 1);
}

export function getRegistry() { return registry; }
export function getRegisteredForType(type: EventType) { return registry.filter(r => r.eventType === type); }
