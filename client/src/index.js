import './styles/index.scss';
import template from "./index.html";
import ApiService from "./services/ApiService";
import SearchService from "./services/SearchService";
import InfoPanel from './components/infopanel/InfoPanel'

class ViewController {
    constructor() {
        document.getElementById("app").outerHTML = template
        this.initializeComponents()
    }

    initializeComponents() {
        this.infoComponent = new InfoPanel("info-panel-placeholder")
    }
}

window.ctrl = new ViewController()