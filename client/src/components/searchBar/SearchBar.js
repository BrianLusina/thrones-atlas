import Component from '../Component'
import "./searchBar.scss";
import template from "./searchbar.html";


/**
 * SearchBar component
 * "Debounce" refers to the practice of waiting for a break in the input before executing an operation. 
 * Here, the component is configured to wait for a break of at least 500ms between keystrokes before performing the search.
 * 500ms was chosen since the average computer user types at 8,000 keystrokes-per-hour, or one keystroke every 450 milliseconds. 
 * Using debounce is an important performance optimization to avoid computing new search results every time the user taps a key.
 * @extends Component
 */
export default class SearchBar extends Component {

    /** SearchBar Component Constructor
     * @param { Object } props.events.resultSelected Result selected event listener
     * @param { Object } props.searchService SearchService instance to use
     * */
    constructor(placeHolderId, props) {
        super(placeHolderId, props, template);
        this.searchService = props.searchService;
        this.searchDebounce = null;

        this.refs.input.addEventListener("keyup", ({
            target: {
                value
            }
        }) => this.onSearch(value))
    }


    /**
     * handles search
     * @param {String} value Search value
     */
    onSearch(value) {
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => this.search(value), 500)
    }

    /**
     * Search for the given term and display results in UI
     * @param {String} term Search term
     */
    search(term) {
        // clear search results
        this.refs.results.innerHTML = "";

        // get search results
        this.searchResults = this.searchService.search(term).slice(0, 10);

        // display search results in UI
        this.searchResults.forEach(result => this.displaySearchResult(result));
    }

    /**
     * Displays the search result in the UI
     * @param {Object} searchResult 
     */
    displaySearchResult(searchResult) {
        let layerItem = document.createElement('div')
        layerItem.textContent = searchResult.name
        layerItem.addEventListener('click', () => this.searchResultSelected(searchResult))
        this.refs.results.appendChild(layerItem)
    }

    /** 
     * Display the selected search result 
     * @param {Object} searchResult
     */
    searchResultSelected(searchResult) {
        // Clear search input and results
        this.refs.input.value = ''
        this.refs.results.innerHTML = ''

        // Send selected result to listeners
        this.triggerEvent('resultSelected', searchResult)
    }
}