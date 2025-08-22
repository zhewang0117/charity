<template>
  <div class="map-page-container" style="height: 100vh; width: 100%; position: relative; overflow: visible; margin: 0; padding: 0; left: 0; top: 0;">
    <div class="search-container" style="top: 20px; right: 20px; left: auto;">
      <input
        v-model="searchQuery"
        @keyup.enter="searchPOI"
        placeholder="Search for place..."
        class="search-input"
      />
      <button @click="searchPOI" class="search-button">Search</button>
      <div v-if="searchResults.length > 0" class="search-results">
        <div
          v-for="result in searchResults"
          :key="result.place_id"
          @click="zoomToResult(result)"
          class="result-item"
        >
          {{ result.display_name }}
        </div>
      </div>
    </div>

    <div class="navigation-panel">
      <h3>Route Navigation</h3>
      <div class="input-group">
        <label>Start:</label>
        <input v-model="startPoint" placeholder="Enter start location" @focus="setActiveInput('start')">
      </div>
      <div class="input-group">
        <label>End:</label>
        <input v-model="endPoint" placeholder="Enter end location" @focus="setActiveInput('end')">
      </div>
      <button @click="calculateRoute" class="nav-button">Get Directions</button>
      <button @click="clearRoute" class="nav-button clear">Clear Route</button>
      
      <div v-if="routeInstructions.length > 0" class="route-instructions">
        <h4>Route Instructions</h4>
        <div v-for="(instruction, index) in routeInstructions" :key="index" class="instruction">
          {{ instruction }}
        </div>
      </div>
    </div>

    <div class="map-container">
      <l-map 
        ref="map" 
        v-model:zoom="zoom" 
        :center="center"
        :use-global-leaflet="false"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        <l-marker
          v-for="result in searchResults"
          :key="result.place_id"
          :lat-lng="[result.lat, result.lon]"
        >
          <l-popup>{{ result.display_name }}</l-popup>
        </l-marker>
        
        <!-- 路线标记 -->
        <l-marker v-if="startMarker" :lat-lng="startMarker.latLng">
          <l-icon :icon-url="startIcon" :icon-size="[25, 41]" :icon-anchor="[12, 41]"></l-icon>
          <l-popup>Start: {{ startMarker.text }}</l-popup>
        </l-marker>
        
        <l-marker v-if="endMarker" :lat-lng="endMarker.latLng">
          <l-icon :icon-url="endIcon" :icon-size="[25, 41]" :icon-anchor="[12, 41]"></l-icon>
          <l-popup>End: {{ endMarker.text }}</l-popup>
        </l-marker>
        
        <l-polyline v-if="routePath" :lat-lngs="routePath" color="blue" :weight="5"></l-polyline>
      </l-map>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline, LIcon } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";

// Fix for marker icons not appearing in Vite
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Custom marker icons
const startIcon = ref(new L.Icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'start-marker-icon' 
}));

const endIcon = ref(new L.Icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'end-marker-icon' 
}));

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const zoom = ref(10);
const center = ref([47.41322, -1.219482]);
const searchQuery = ref("");
const searchResults = ref([]);
const map = ref(null);

// Navigation related refs
const startPoint = ref("");
const endPoint = ref("");
const activeInput = ref(null); // 'start' or 'end'
const routePath = ref(null);
const routeInstructions = ref([]);
const startMarker = ref(null);
const endMarker = ref(null);


const searchPOI = async () => {
  if (!searchQuery.value.trim()) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery.value
      )}`
    );
    const data = await response.json();
    searchResults.value = data;

    if (data.length > 0) {
      
      zoomToResult(data[0]);
      
      if (activeInput.value === 'start') {
        startPoint.value = data[0].display_name;
        setStartMarker(data[0]);
      } else if (activeInput.value === 'end') {
        endPoint.value = data[0].display_name;
        setEndMarker(data[0]);
      }
    }
  } catch (error) {
    console.error("failure:", error);
  }
};

const zoomToResult = (result) => {
  if (map.value?.leafletObject) {
    const latLng = L.latLng(parseFloat(result.lat), parseFloat(result.lon));
    map.value.leafletObject.flyTo(latLng, 15);
  }
};

const setActiveInput = (type) => {
  activeInput.value = type;
};

const setStartMarker = (result) => {
  startMarker.value = {
    latLng: [parseFloat(result.lat), parseFloat(result.lon)],
    text: result.display_name
  };
};

const setEndMarker = (result) => {
  endMarker.value = {
    latLng: [parseFloat(result.lat), parseFloat(result.lon)],
    text: result.display_name
  };
};

const calculateRoute = async () => {
  if (!startMarker.value || !endMarker.value) {
    alert("Please set both start and end points");
    return;
  }

  try {
    const start = `${startMarker.value.latLng[1]},${startMarker.value.latLng[0]}`; 
    const end = `${endMarker.value.latLng[1]},${endMarker.value.latLng[0]}`; 
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson&steps=true`
    );
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      // draw the route on the map
      routePath.value = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      // generate step-by-step instructions
      routeInstructions.value = [];
      if (data.routes[0].legs && data.routes[0].legs.length > 0) {
        data.routes[0].legs[0].steps.forEach(step => {
          if (step.maneuver.instruction) {
            routeInstructions.value.push(step.maneuver.instruction);
          }
        });
      }
      
      // adjust map view to fit the route
      if (map.value?.leafletObject) {
        const bounds = L.latLngBounds(routePath.value);
        map.value.leafletObject.flyToBounds(bounds);
      }
    }
  } catch (error) {
    console.error("failure:", error);
  }
};

const clearRoute = () => {
  routePath.value = null;
  routeInstructions.value = [];
  startMarker.value = null;
  endMarker.value = null;
  startPoint.value = "";
  endPoint.value = "";
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

.map-page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-container .leaflet-container {
  width: 100% !important;
  height: 100% !important;
}

.search-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 300px;
}

.search-input {
  width: 70%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
}

.search-button {
  padding: 8px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #45a049;
}

.search-results {
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.navigation-panel {
  position: absolute;
  top: 80px;
  left: 10px;
  z-index: 1000;
  background: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 300px;
}

.navigation-panel h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.input-group {
  margin-bottom: 10px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.nav-button {
  width: 100%;
  padding: 8px 12px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.nav-button:hover {
  background-color: #0b7dda;
}

.nav-button.clear {
  background-color: #f44336;
}

.nav-button.clear:hover {
  background-color: #d32f2f;
}

.route-instructions {
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.route-instructions h4 {
  margin-bottom: 10px;
}

.instruction {
  padding: 8px;
  border-bottom: 1px solid #eee;
  font-size: 0.9em;
}
.start-marker-icon {
  filter: hue-rotate(90deg) brightness(1.2);
}

.end-marker-icon {
  filter: hue-rotate(300deg) brightness(1.2);
}
</style>