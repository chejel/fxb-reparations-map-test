import { writable } from 'svelte/store';

export let map = writable();
export let countiesMap = writable(); // map data for all counties
export let statesMap = writable(); // map data for all states
export let countyPolygons = writable(); // show counties with reparations efforts on map
export let statePolygons = writable(); // show cities with reparations efforts on map

// Reparations data
export let reparationsData = writable();
export let reparationsCityData = writable();
export let reparationsCountyData = writable();
export let reparationsStateData = writable();

// Variables that will trigger sidebar to open
export let selectedLocation = writable(); // Object containing selected city/county and state name
export let selectedState = writable(); // State selected

// Panels
export let aboutPanelVisible = writable(true);
export let listPanelVisible = writable(false);
export let citiesPanelVisible = writable(true);
export let countiesPanelVisible = writable(false);
export let statesPanelVisible = writable(false);
export let cardScroll = writable(false); // scroll to top of new card if user scrolled to bottom on previous card and then selected a city on the map
