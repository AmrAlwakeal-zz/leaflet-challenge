//=================================================================================//
// sources: Bootcamp Leaflet exercises 
 //Medium : Towards Datascience
 // StackExchange, igismap & Youtube
//=================================================================================//
// Part I : Create map and tiles 
//================================================================================//

// 1. variable for data links:
//-------------------------------
var earthquakesLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// 2. data layer groups: 
//------------------
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

// 3.Overlaymaps:
//---------------
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Techtonic Plates": tectonicPlates
  };
  
// 4. Tile Layers :
//----------------
// SATELLITE MAP 
//--------------
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
});
// GREYSCALE MAP
//-------------
var greyscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
});
// OUTDOOR MAP
//-------------
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "outdoors-v11",
      accessToken: API_KEY
});
  
// Base maps
var baseMaps = {
      "GreyScale": greyscale, 
      "outdoors": outdoors, 
      "Satellite": satellite

      
};
// 6. create map object with defualt layers:
//------------------------------------------
var myMap = L.map("map", {
    center: [36.2048, 138.2529],
    zoom: 3,
    layers: [outdoors, earthquakes]
});

// 7. Create a control for the layers & add the overlay layers to the map with default tile
//-----------------------------------------------------------------------------------------
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

//==========================================================================================//
// Part II : Create Markers , size, color & style  Based on the Magnitude of the Earthquake
//==========================================================================================//

// 1. Function to Determine markerSize: 
//------------------------------------
function markerSize(magnitude) {
    return magnitude * 5;
};

// 2. Function to Determine markerColor:
//-------------------------------------

function markerColor(magnitude) {
    switch (true) {
        case magnitude > 9:
            return "#b52651"
        case magnitude > 7: 
            return "#752070";
        case magnitude > 5:
            return "#ff0000";
        case magnitude > 3: 
            return  "#ffa500";
        case magnitude > 1: 
            return  "#009d00";
        default:
            return "#28ff28";
}
}

// 3. Function to Determine markerStyle: 
//-------------------------------------
function markerStyle(feature) {
    return {
      opacity: 0.5,
      fillOpacity: .5,
      fillColor: markerColor(feature.properties.mag),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

//=================================================================================//
// Part III: Geojson and retrieve Data + Lengend :
//=================================================================================//


// 1. Retrieve earthquakesLink with D3
//---------------------------------------------------------------------
d3.json(earthquakesLink, function(earthquakeData) {
   
    // B. Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
    //----------------------------------------------------------------------------------
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: markerStyle,
        // C. Function to Run Once For Each feature in the features Array
        // Give Each feature a Popup Describing the Place & Time of the Earthquake
        //--------------------------------------------------------------------------
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    // D. Add earthquakeData to earthquakes LayerGroups 
    //------------------------------------------------
    }).addTo(earthquakes);
    // Add earthquakes Layer to the Map
    earthquakes.addTo(myMap);

    // 2. Retrieve platesLink with D3
    //-------------------------------------------------------------
    d3.json(platesLink, function(plateData) {
        //B. Create a GeoJSON Layer the plateData
        L.geoJson(plateData, {
            color: "#DC143C",
            weight: 2
        //C. Add plateData to tectonicPlates LayerGroups 
        }).addTo(tectonicPlates);
        // Add tectonicPlates Layer to the Map
        tectonicPlates.addTo(myMap);
    });

    // 3. Legend 
    //===============
    var legend = L.control({position: 'bottomright'});
        
legend.onAdd = function (map) {
    // Create a div to hold the legend
    var div = L.DomUtil.create('div', 'legend');

    // Define the scales for the legend
    var legendLabel = [
        { label: "9.0+",  color: "#b52651"},
        { label: "7.0 to 9.0",  color: "#752070"},
        { label: "5.0 - 7.0",  color: "#ff0000"},
        { label: "3.0 - 5.0",  color: "#ffa500"},
        { label: "1.0 - 3.0",  color: "#009d00"},
        { label: "0-1", color: "#28ff28"},
    ];
    var legendDiv  = "<table><thead><tr></th><th>Magnitude</th></tr></thead><tbody>"

 // Loop through and generate legend elements
 for (var i = 0; i < legendLabel.length; i++) {
     legendDiv  += `<tr><td class='legendLabel' style=\"background-color:${legendLabel[i].color};\"></td>`;
     legendDiv  += `<td class='legendLabel'>${legendLabel[i].label}</td></tr>`;

 }
 
 // End the table
 legendDiv  += "</tbody></table>";

 div.innerHTML = legendDiv

    // console.log(div.innerHTML);
    return div;
};

legend.addTo(myMap);

});