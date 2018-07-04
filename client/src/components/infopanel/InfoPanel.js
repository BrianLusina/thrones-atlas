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
}