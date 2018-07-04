import "./map.scss"
import Component from '../Component'
import L from "leaflet";
import template from "./map.html"

// alternativley we can use a string as the template, this is because Leaflet is handling the rendering of the html
// const template = '<div ref="mapContainer" class="map-container"></div>';

/**
 * Map component that will be used to render a Map
 * @extends Component
 */
export default class Map extends Component {

    /**
     * Constructor for the given Map constructor
     * @param {String} placeHolderId Placeholder id used to inflate the map
     * @param {Object} props Data properties that will be passed to a Map instance
     */
    constructor(placeHolderId, props) {
        super(placeHolderId, props, template);

        // initialize a leaflet map
        this.map = L.map(this.refs.mapContainer, {
            center: [5, 20],
            zoom: 4,
            maxZoom: 8,
            minZoom: 4,
            maxBounds: [
                [50, -30],
                [-45, 100]
            ]
        });

        // position the zoom control at the bottom right of the component
        this.map.zoomControl.setPosition("bottomright");
        // layers of the map, key/value pair with the title as the key and layer as the value
        this.layers = {};

        // store the currently selected region
        this.selectedRegion = null

        // render the Carto map base layer
        // ref https://carto.com/blog/game-of-thrones-basemap/
        L.tileLayer(
            'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png', {
                crs: L.CRS.EPSG4326
            }
        ).addTo(this.map)
    }

    /**
     * Add location geojson to the leaflet instance
     * @param {String} locationType Location type string
     * @param {Object} geoJson GeoJSON feature
     * @param {String} iconUrl Icon url for displaying icon for location
     */
    addLocationGeoJson(locationType, geoJson, iconUrl) {
        // initialize a new GeoJSON feature
        this.layers[locationType] = L.geoJSON(geoJson, {

            /**
             * show marker on location
             * @param {Object} feature
             * @param {Object} latlang
             */
            pointToLayer: (feature, latlang) => {
                return L.marker(latlang, {
                    icon: L.icon({
                        iconUrl,
                        iconSize: [24, 56]
                    }),
                    title: feature.properties.name
                })
            },
            onEachFeature: this.onEachLocation.bind(this)
        })
    }

    /**
     * Assign a popup and event listener to each locaation
     * @param {Object} feature Feature 
     * @param {Object} layer Layer on map
     */
    onEachLocation(feature, layer) {
        layer.bindPopup(feature.properties.name, {
            closeButton: false
        });
        layer.on({
            click: e => {
                // deselect highlighed region
                this.setHighlightedRegion(null);
                const {
                    name,
                    id,
                    type
                } = feature.properties;
                this.triggerEvent("locationSelected", {
                    name,
                    id,
                    type
                })
            }
        })
    }

    /**
     * Highlight the selected region
     * @param {Object} layer 
     */
    setHighlightedRegion(layer) {
        // if a layer is currently selected, deselect it
        if (this.selectedRegion) {
            this.layers.kingdom.resetStyle(this.selectedRegion)
        }

        // select the provided region
        this.selectedRegion = layer
        if (this.selectedRegion) {
            this.selectedRegion.bringToFront();
            this.selectedRegion.setStyle({
                color: "blue"
            })
        }
    }


}