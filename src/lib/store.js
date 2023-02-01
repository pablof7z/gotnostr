import { writable } from 'svelte/store';

export const invoiceStatus = writable('initial');
export const invoice = writable({});
export const relays = writable({});