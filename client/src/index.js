import './styles/index.scss';
// TODO: load leaflet styles
//import "leaflet/dist/leaflet.css";
import template from "./index.html";
import ApiService from "./services/ApiService";
import SearchService from "./services/SearchService";
import InfoPanel from './components/infopanel/InfoPanel'
import Map from './components/map/Map'

class ViewController {
    constructor() {
        document.getElementById("app").outerHTML = template;

        if (window.location.hostname == "localhost") {
            this.api = new ApiService('http://localhost:5000')
        } else {
            this.api = new ApiService("https://api.atlasofthrones.com/")
        }

        this.locationPointTypes = ['castle', 'city', 'town', 'ruin', 'region', 'landmark']
        this.initializeComponents()
        this.loadMapData();
    }

    initializeComponents() {
        this.infoComponent = new InfoPanel("info-panel-placeholder", {
            apiService: this.api
        })
        this.mapComponent = new Map("map-placeholder")
    }

    /**
     * Load map data from API
     */
    async loadMapData() {
        // download kingdom geo json data
        const kingdomGeoJson = await this.api.getKingdoms();

        // add data to map
        this.mapComponent.addKingdomGeoJson(kingdomGeoJson);

        // show kingdom boundaries
        this.mapComponent.toggleLayer("kingdoms");

        // download location point geo data
        for (let locationType of this.locationPointTypes) {
            // Download GeoJSON + metadata
            const geojson = await this.api.getLocations(locationType)

            // Add data to map
            this.mapComponent.addLocationGeojson(locationType, geojson, this.getIconUrl(locationType))

            // Display location layer
            this.mapComponent.toggleLayer(locationType)
        }
    }

    /** 
     * Format icon URL for layer type 
     * @param {String} layerName
     */
    getIconUrl(layerName) {
        return `https://cdn.patricktriest.com/atlas-of-thrones/icons/${layerName}.svg`
    }
}

window.ctrl = new ViewController()