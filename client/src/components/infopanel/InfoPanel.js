import "./info_panel.scss"
import Component from '../Component'
import template from "./info_panel.html";

/**
 * Info Panel Component
 * Download and display metadata for selected items
 * @extends Component
 */
export default class InfoPanel extends Component {

    /**
     * Info Panel constructor
     * @param {String} placeHolderId Placeholder id to mount this component on the DOM
     * @param {Object} props Data passed in to properties of this component
     */
    constructor(placeHolderId, props) {
        super(placeHolderId, props, template);
        this.api = props.apiService;

        // toggle info panel on title click
        this.refs.title.addEventListener("click", () => this.refs.container.classList.toggle("info-active"));
    }

    /**
     * Shows information for the selected map layer
     * @param {String} name Name of the selected map layer
     * @param {String} id Id of the map layer
     * @param {String} type type of the map layer
     */
    async showInfo(name, id, type) {
        // display the location name
        this.refs.title.innerHTML = `<h1>${name}</h1>`

        // download and display the information 
        this.refs.content.innerHTML = type === "kingdom" ?
            await this.getKingdomDetailHtml(id) :
            await this.getLocationDetailHtml(id, type)
    }

    /**
     * Get kingfom detail html
     * @param {String} id kingdom id
     * @returns {String}
     */
    async getKingdomDetailHtml(id) {
        // get kingdom metadata
        let {
            kingdomSize,
            castleCount,
            kingdomSummary
        } = await this.api.getAllKingdomDetails(id);

        // convert the size to an easily readable string
        kingdomSize = kingdomSize.toLocaleString(undefined, {
            maximumFractionDigits: 0
        });

        const summaryHtml = this.getInfoSummary(kingdomSummary);

        return `
        <h3>KINGDOM</h3>
        <div>Size Estimate - ${kingdomSize} km<sup>2</sup></div>
        <div>Number of Castles - ${castleCount}</div>
        ${summaryHtml}
        `
    }

    /**
     * gets the location detail html
     * @param {String} id Location id
     * @param {String} type Type of location
     * @returns {Strin}
     */
    async getLocationDetailHtml(id, type) {
        // Get location metadata
        const locationInfo = await this.api.getLocationSummary(id)

        // Format summary template
        const summaryHTML = this.getInfoSummaryHtml(locationInfo)

        // Return filled HTML template
        return `<h3>${type.toUpperCase()}</h3>${summaryHTML}`
    }

    /**
     * Gets the information summary for the given location
     * @param {String} info Information for the location
     * @returns {String}
     */
    getInfoSummary(info) {
        return `
        <h3>Summary</h3>
        <div>${info.summary}</div>
        <div><a href="${info.url}" target="_blank" rel="noopener">Read More...</a></div>`
    }

}