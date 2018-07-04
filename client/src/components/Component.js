/**
 * Base component class that will be inherited and extended by all components in application.
 * This will have the placeholderId, props and template which will be used to construct the template and 
 * render to the DOM.
 */
export default class Component {
    /**
     * Component constructor
     * @param {String} placeHolderId Element Id to inflate component into
     * @param {Object} props properties of the given component, which will contain data and events
     * data is an object with data related to the given component,
     * events are the event listeners that the component will use
     * @param {String} template HTML template to inflate into placeholder
     */
    constructor(placeHolderId, props, template) {
        this.componentElement = document.getElementById(placeHolderId);

        if (template) {
            // load template into innerHTML
            this.componentElement.innerHTML = template;

            // find all refs in component
            this.refs = {}
            const refElems = this.componentElement.querySelectorAll("[ref]");

            // assign each ref to this.refs object
            refElems.forEach(elem => {
                this.refs[elem.getAttribute("ref")] = elem
            })
        }
        if (props.events) {
            this.createEvents(props.events)
        }
    }

    /**
     * Read events component params and attach event listeners to each
     * @param {Object} events Events for the given component
     */
    createEvents(events) {
        Object.keys(events).forEach(eventName => {
            this.componentElement.addEventListener(eventName, events[eventName], false)
        });
    }

    /**
     * Trigger events on the component
     * @param {String} eventName event name
     * @param {Object} detail payload passed to event
     */
    triggerEvents(eventName, detail) {
        const event = new window.CustomEvent(eventName, {
            detail
        })
        this.componentElement.dispatchEvent(event)
    }
}