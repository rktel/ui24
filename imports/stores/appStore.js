import { writable } from 'svelte/store';

function createHeight() {
    const { subscribe, update } = writable(0);

    return {
        subscribe,
        set: (newValue) => update(value => newValue),
    };
}

export const appHeight = createHeight();