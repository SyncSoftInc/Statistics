var geoCollection = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-120, 46]
            },
            "properties": {
                "id": "north-west",
                "title": "NORTH WEST",
                statistics: ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-117, 39]
            },
            "properties": {
                "id": "south-west",
                "title": "SOUTH WEST",
                statistics: ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-103, 46]
            },
            "properties": {
                "id": "north-central",
                "title": "NORTH CENTRAL",
                statistics: ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-100, 36]
            },
            "properties": {
                "id": "south-central",
                "title": "SOUTH CENTRAL",
                statistics: ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-87, 43]
            },
            "properties": {
                "id": "great-lakes",
                "title": "GREAT LAKES",
                statistics: ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-77, 41]
            },
            "properties": {
                "id": "north-east",
                "title": "NORTH EAST",
                statistics: ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-85, 34]
            },
            "properties": {
                "id": "south-east",
                "title": "SOUTH EAST",
                statistics: ""
            }
        }
    ]
};

var zoom = 4.3;
var zoomThreshold = zoom + 0.01;

mapboxgl.accessToken = 'pk.eyJ1IjoibHVraXlhIiwiYSI6ImNqdmN2dDFlOTFka3E0M25tNGxqdHduNTUifQ.tCI7E4cYwP_rxlmyX1sD8A';
var map = new mapboxgl.Map({
    container: 'map',
    center: [-100, 38], // starting position
    zoom: zoom // starting zoom
});

var selection = document.getElementById("area");

$("#switch input").click(function () {
    selection = this;

    map.setStyle('mapbox://styles/' + selection.value);
});


map.on('styledata', function () {
    addSources();
    addLayers();
});

function addSources() {
    if (!map.getSource('geoCollection')) {
        map.addSource('geoCollection', {
            "type": "geojson",
            "data": geoCollection
        });
    }

    if (selection.id === "population" && !map.getSource('population')) {
        map.addSource('population', {
            'type': 'vector',
            'url': 'mapbox://mapbox.660ui7x6'
        });
    }
}

function addLayers() {
    switch (selection.id) {
        case "population":
            addPopLayer();
            break;
    }

    addAreaLayer();
}

function addPopLayer() {
    if (map.getLayer('state-population')) return;

    map.addLayer({
        'id': 'state-population',
        'source': 'population',
        'source-layer': 'state_county_population_2014_cen',
        'maxzoom': zoomThreshold,
        'type': 'fill',
        'filter': ['==', 'isState', true],
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'population'],
                0, '#F2F12D',
                500000, '#EED322',
                750000, '#E6B71E',
                1000000, '#DA9C20',
                2500000, '#CA8323',
                5000000, '#B86B25',
                7500000, '#A25626',
                10000000, '#8B4225',
                25000000, '#723122'
            ],
            'fill-opacity': 0.75
        }
    }, 'waterway-label');

    map.addLayer({
        'id': 'county-population',
        'source': 'population',
        'source-layer': 'state_county_population_2014_cen',
        'minzoom': zoomThreshold,
        'type': 'fill',
        'filter': ['==', 'isCounty', true],
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'population'],
                0, '#F2F12D',
                100, '#EED322',
                1000, '#E6B71E',
                5000, '#DA9C20',
                10000, '#CA8323',
                50000, '#B86B25',
                100000, '#A25626',
                500000, '#8B4225',
                1000000, '#723122'
            ],
            'fill-opacity': 0.75
        }
    }, 'waterway-label');
}

var layerIDs = []; // Will contain a list used to filter against.
function addAreaLayer() {
    geoCollection.features.forEach(function (feature) {
        var id = feature.properties['id'];

        // Add a layer for this symbol type if it hasn't been added already.
        if (map.getLayer(id)) return;

        map.addLayer({
            "id": id,
            "type": "symbol",
            "source": "geoCollection",
            "layout": {
                "text-field": "{title}\n{statistics}",
                "text-size": 20
            },
            "paint": {
                "text-color": "#202",
                "text-halo-color": "#fff",
                "text-halo-width": 2
            },
            "filter": ["==", "id", id]
        });

        layerIDs.push(id);
    });
}

function refreshAreaLayers() {
    layerIDs.forEach(function (layerId) {
        map.removeLayer(layerId);
    });

    map.removeSource('geoCollection');

    map.addSource('geoCollection', {
        "type": "geojson",
        "data": geoCollection
    });

    addAreaLayer();
}

function loadData() {
    $.blockUI({
        css: { 'padding': '15px 0', 'font-size': "20px" },
        message: 'Loading ...'
    });

    $.get("api/v1/shipping?startDate=20190101&endDate=20190102", function (json) {
        var data = JSON.parse(json);

        data.ResultData.areas.forEach(function (area) {
            geoCollection.features.forEach(function (feature) {
                if (area.Code === feature.properties.id) {
                    feature.properties.statistics = area.statistics.join("\n");
                }
            });
        });

        refreshAreaLayers();

        $.unblockUI();
    });
}

$(function () {
    $("#area").click();

    loadData();
});