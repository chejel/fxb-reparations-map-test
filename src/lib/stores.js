import { writable, derived } from "svelte/store";

export let map = writable();

// Reparations data
export let reparationsData = writable([]);
export let reparationsStateData = writable([]);

// Variables that will trigger sidebar to open
export let selectedCity = writable(); // City selected
export let selectedState = writable(); // State selected
// Panels
export let aboutPanelVisible = writable(false);
export let listPanelVisible = writable(false);
export let citiesPanelVisible = writable(false);
export let statesPanelVisible = writable(false);

export let sidebarVisible = derived([selectedCity, selectedState, aboutPanelVisible, listPanelVisible], ([$selectedCity, $selectedState, $aboutPanelVisible, $listPanelVisible]) => {
  if($selectedCity || $selectedState || $aboutPanelVisible || $listPanelVisible){
    return true;
  } else {
    return false;
  }
})