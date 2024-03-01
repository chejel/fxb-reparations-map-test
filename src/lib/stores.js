import { writable } from "svelte/store";

export let map = writable();

// Reparations data
export let reparationsData = writable();
export let reparationsStateData = writable();

// Variables that will trigger sidebar to open
export let selectedCity = writable(); // City selected
export let selectedCounty = writable(); // County selected
export let selectedState = writable(); // State selected

// Panels
export let aboutPanelVisible = writable(true);
export let listPanelVisible = writable(false);
export let citiesPanelVisible = writable(true);
export let countiesPanelVisible = writable(false)
export let statesPanelVisible = writable(false);