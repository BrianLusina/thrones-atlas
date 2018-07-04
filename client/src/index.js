import './styles/index.scss';
// TODO: load leaflet styles
//import "leaflet/dist/leaflet.css";
import template from "./index.html";
import ApiService from "./services/ApiService";
import SearchService from "./services/SearchService";
import InfoPanel from './components/infopanel/InfoPanel'
import Map from './components/map/Map'
import LayerPanel from './components/layerpanel/LayerPanel'
import SearchBar from './components/searchBar/SearchBar'

class ViewController {
    constructor() {
        document.getElementById("app").outerHTML = template;

        this.searchService = new SearchService()

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
        // info component
        this.infoComponent = new InfoPanel("info-panel-placeholder", {
            apiService: this.api
        })

        // map component
        this.mapComponent = new Map("map-placeholder")

        // layer panel
        // When the component triggers the layerToggle event, the callback will then toggle the layer within the map component.
        this.layerPanel = new LayerPanel("layer-panel-placeholder", {
            layerNames: ["kingdom", ...this.locationPointTypes],
            events: {
                // Toggle layer in map controller on "layerToggle" event
                layerToggle: event => {
                    this.mapComponent.toggleLayer(event.detail)
                }
            }
        })

        // search panel
        this.searchPanel = new SearchBar("search-panel-placeholder", {
            searchService: this.searchService,
            events: {
                resultSelected: event => {
                    // show result on map
                    let searchResult = event.detail;

                    if (!this.mapComponent.isLayerShowing(searchResult.layerName)) {
                        // show result layer if currently hidden
                        this.layerPanel.toggleMapLayer(searchResult.layerName)
                    }

                    this.mapComponent.selectLocation(searchResult.id, searchResult.layerName)
                }
            }
        })
    }

    /**
     * Load map data from API
     */
    async loadMapData() {
        // download kingdom geo json data
        const kingdomGeoJson = await this.api.getKingdoms();

        // add boundary data to search service
        this.searchService.addGeoJsonItems(kingdomGeoJson, "kingdom");

        // add data to map
        this.mapComponent.addKingdomGeoJson(kingdomGeoJson);

        // show kingdom boundaries
        this.layerPanel.toggleMapLayer("kingdom")

        // download location point geo data
        for (let locationType of this.locationPointTypes) {
            // Download GeoJSON + metadata
            const geojson = await this.api.getLocations(locationType)

            // add location data to search service
            this.searchService.addGeoJsonItems(geojson, locationType)

            // Add data to map
            this.mapComponent.addLocationGeojson(locationType, geojson, this.getIconUrl(locationType))
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