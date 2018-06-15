import './styles/index.scss';
import template from "./index.html";
import apiService from "./services/ApiService";

class ViewController {
    constructor() {
        document.getElementById("app").outerHTML = template
    }
}

window.ctrl = new ViewController()