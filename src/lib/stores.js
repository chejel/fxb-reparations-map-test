import { writable } from "svelte/store";

export let map = writable();
export let statesMap = writable(); // map data for all states
export let statePolygons = writable(); // show cities with reparations efforts on map

// Reparations data
export let reparationsData = writable();
export let reparationsCityData = writable();
export let reparationsStateData = writable();

// Variables that will trigger sidebar to open
export let selectedCity = writable(); // City selected
export let selectedState = writable(); // State selected

// Panels
export let aboutPanelVisible = writable(true);
export let listPanelVisible = writable(false);
export let citiesPanelVisible = writable(true);
export let countiesPanelVisible = writable(false)
export let statesPanelVisible = writable(false);