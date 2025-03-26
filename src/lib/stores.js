import { writable } from 'svelte/store';

export let map = writable();
export let statesMap = writable(); // map data for all states

// Reparations data
export let reparationsData = writable();
export let reparationsCityData = writable();
export let reparationsCountyData = writable();
export let reparationsStateData = writable();
export let filteredLocations = writable(); // locations based on applied filters/toggles
export let toggleTags = writable(); // for listing applied filters/toggles as tags in list of locations

// Variables that will trigger sidebar to open
export let selectedLocation = writable(); // Object containing selected city/county and state name

// Panels
export let aboutPanelVisible = writable(true);
export let listPanelVisible = writable(false);
export let citiesPanelVisible = writable(true);
export let countiesPanelVisible = writable(false);
export let statesPanelVisible = writable(false);
export let cardScroll = writable(false); // scroll to top of new card if user scrolled to bottom on previous card and then selected a city on the map
