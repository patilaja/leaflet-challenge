
//Constants
const markerscale = 5;

//Variable declaration
//API endpoint URL 
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Create Layergroup instance
var earthquakeMap = new L.LayerGroup();

//Legend variable
var legend = L.control({ position: 'bottomright' });

//Read through JSON data, add layers and markers
d3.json(earthquake_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonRes, latlng) {
            return L.circleMarker(latlng, { radius: (geoJsonRes.properties.mag * markerscale) });
        },

        style: function (geoJsonFeatures) {
            return {
                fillColor: Color(geoJsonFeatures.properties.mag),
                fillOpacity: 0.6,
                weight: 0.2,
                color: 'black'
            }
        },

        //Build Popup info: date, location and magnitude
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h6 style='text-align:center;'>Date: " + new Date(feature.properties.time) +
                "</h6> <hr> <p style='text-align:center;'>Location: " + feature.properties.title + "</P>" +
                "<hr> <p style='text-align:center;'>Magnitude: " + feature.properties.mag + "</P>");
        }
    }).addTo(earthquakeMap);

    //Create earthquake maps - Step 1
    createMap(earthquakeMap);
});


//Function for the legand colors
function Color(magnitude) {
    // Return color based on magnitude value 
    if (magnitude >= 5) {
        return "red";
    }
    else if (magnitude >= 4) {
        return "orange";
    }
    else if (magnitude >= 3) {
        return "gold";
    }
    else if (magnitude >= 2) {
        return "yellow";
    }
    else if (magnitude >= 1) {
        return "yellowgreen";
    }
    else {
         return "greenyellow";
    }
};

//Create maps
function createMap() {

    var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 12,
        id: 'mapbox.outdoors',
        style: 'mapbox://styles/p-craig-peddie/<styletoken>',
        accessToken: API_KEY
    });
   
    //Base Layers
    var baseLayers = {
        "Outdoors": outdoors
    };

    //Add overlays
    var overlays = {
        "Earthquakes": earthquakeMap
    };

    //Add  layers to mymap div
    var mymap = L.map('map', {
        center: [37.8968, -119.5828],
        zoom: 4,
        layers: [outdoors,earthquakeMap]
    });

    //Add legend info
    legend.onAdd = function (map) {

        //Earthquake band labels
        var div = L.DomUtil.create("div", "info legend"),
        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

      //Get colors for each label or magnitude range info
      for (var i = 0; i < labels.length; i++) {
        div.innerHTML += '<i style="background:' + Color(i) + '"></i> ' +
                labels[i] + '<br>' ;
      }

        return div;
    };
    legend.addTo(mymap);
};


