// URL for earthquake data from USGS API
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create a tile layer using OpenStreetMap for the base map
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize the Leaflet map with center coordinates and zoom level
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streets]
});

// Define base map layers
let baseMaps = {
    "streets": streets
};

// Initialize layer groups for earthquake data and tectonic plates
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

// Define overlay layers
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

// Add layer control to the map
L.control.layers(baseMaps, overlays).addTo(myMap);

// Function to style the markers based on depth and magnitude
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag), 
        fillColor: chooseColor(feature.geometry.coordinates[2]) 
    };
}

// Function to choose marker color based on depth
function chooseColor(depth) {
    if (depth <= 10) return "red";
    else if (depth > 10 && depth <= 25) return "orange";
    else if (depth > 25 && depth <= 40) return "yellow";
    else if (depth > 40 && depth <= 55) return "pink";
    else if (depth > 55 && depth <= 70) return "blue";
    else return "green";
}

// Function to choose marker radius based on magnitude
function chooseRadius(magnitude) {
    return magnitude * 5;
}

// Fetch earthquake data and add it to the map
d3.json(url).then(function (data) { 
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.id); 
        },
        style: styleInfo
    }).addTo(earthquake_data); 
    earthquake_data.addTo(myMap);

    // Fetch tectonic plate data and add it to the map
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { 
        L.geoJson(data, {
            color: "yellow",  
            weight: 3
        }).addTo(tectonics); 
        tectonics.addTo(myMap);
    });
});

// Add legend to the map
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth Color Legend</h4>";
    div.innerHTML += '<i style="background: red"></i><span>(Depth < 10)</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>(10 < Depth <= 25)</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>(25 < Depth <= 40)</span><br>';
    div.innerHTML += '<i style="background: pink"></i><span>(40 < Depth <= 55)</span><br>';
    div.innerHTML += '<i style="background: blue"></i><span>(55 < Depth <= 70)</span><br>';
    div.innerHTML += '<i style="background: green"></i><span>(Depth > 70)</span><br>';

    return div;
};
// Add the legend to the map
legend.addTo(myMap);

// Fetch specific earthquake data with ID "nc73872510" and log information
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); 
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); 
    console.log(coordinates[1]); 
    console.log(coordinates[2]); 
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);
});
