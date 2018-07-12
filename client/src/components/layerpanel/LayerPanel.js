import "./layer-panel.scss";
import Component from '../Component'
import template from "./layer-panel.html";

/**
 * Layer Panel Component that takes an array of layer names and renders them as a list of buttons. 
 * The component will also emit a layerToggle event whenever one of these buttons is pressed. 
 * Render and control layer-toggle side-panel
 * @extends Component
 */
export default class LayerPanel extends Component {
    constructor(placeHolderId, props) {
        super(placeHolderId, props, template);

        // toggle layer panel on click (mobile only)
        this.refs.toggle.addEventListener("click", () => this.toggleLayerPanel())

        //add a toggle button for each layer
        props.layerNames.forEach(name => this.addLayerButton(name))
    }

    /**
     * Toggle and append a new layer
     * @param {String} layerName 
     */
    addLayerButton(layerName) {
        let layerItem = document.createElement("div");
        layerItem.textContent = `${layerName}s`;
        layerItem.setAttribute('ref', `${layerName}-toggle`);
        layerItem.addEventListener("click", e => {
            this.toggleMapLayer(layerName)
        });
        this.refs.buttons.appendChild(layerItem)
    }

    /**
     * Toggle the info panel (only appears on Mobile)
     */
    toggleLayerPanel() {
        this.refs.panel.classList.toggle("layer-panel-active");
    }

    /**
     * Toggle map layer visibility
     * @param {String} layerName Layer name
     */
    toggleMapLayer(layerName) {
        // toggle active ui elements
        this.componentElement.querySelector(`[ref=${layerName}-toggle]`).classList.toggle("toggle-active");

        // trigger layer toggle callback
        this.triggerEvent("layerToggle", layerName)
    }
}