import Fuse from "fuse.js";

export default class SearchService {
    constructor() {
        this.options = {
            keys: ['name'],
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1
        }
        this.searchBase = []
        this.fuse = new Fuse([], this.options)
    }

    /**
     * Add JSON items to Fuse intance searchbase
     * @param {Object} geojson Array of geojson items to add to searchbase
     * @param { String } geojson[].properties.name Name of the GeoJSON item
     * @param { String } geojson[].properties.id ID of the GeoJSON item
     * @param {String} layerName Name of the geojson map layer for the given items
     */
    addGeoJsonItems(geojson, layerName) {
        this.searchBase = this.searchBase.concat(geojson.map(({
            properties: {
                name,
                id
            }
        }) => {
            return {
                layerName,
                id,
                name
            }
        }))

        // re-initialize fuse instance
        this.fuse = new Fuse(this.searchBase, this.options)
    }

    /**
     * Search for the given term using fuse
     * @param {String} term 
     * @returns {Array} Returns results from fuse
     */
    search(term) {
        return this.fuse.search(term)
    }
}