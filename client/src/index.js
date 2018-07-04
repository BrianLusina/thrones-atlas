import './styles/index.scss';
import template from "./index.html";
import ApiService from "./services/ApiService";
import SearchService from "./services/SearchService";

class ViewController {
    constructor() {
        document.getElementById("app").outerHTML = template
    }
}

window.ctrl = new ViewController()