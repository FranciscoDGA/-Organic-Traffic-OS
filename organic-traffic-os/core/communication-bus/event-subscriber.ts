import { Subscriber } from './communication.types';

const subscribers: Subscriber[] = [];

export function addSubscriber(subscriber: Subscriber) { subscribers.push(subscriber); }
export function removeSubscriber(id: string) { const idx = subscribers.findIndex(s => s.id === id); if (idx !== -1) subscribers.splice(idx, 1); }
export function getSubscribers() { return subscribers; }
export function getSubscribersByComponent(component: string) { return subscribers.filter(s => s.component === component); }
