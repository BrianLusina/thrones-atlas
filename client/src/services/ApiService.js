/**
 * ApiService.
 * Used to interact with the API by performing get requests to retrieve information
 * All get requests return an object.
 */

import {
  CancelToken,
  get
} from 'axios';

export default class ApiService {
  /**
   * Constructor for the ApiService class. This constructs new objects by passing in the optional
   * url
   * @param {String} url 
   */
  constructor(url = 'http://0.0.0.0:5000/') {
    this.url = url;
    this.cancelToken = CancelToken.source()
  }

  /**
   * Performs a get request to the given endpoint
   * @param {String} endpoint [Optional]
   * @returns {Object}
   */
  async httpGet(endpoint = "") {
    this.cancelToken.cancel("Cancelled Ongoing Request");
    this.cancelToken = CancelToken.source();
    const response = await get(`${this.url}${endpoint}`, {
      cancelToken: this.cancelToken.token
    });
    return response.data;
  }

  /**
   * Gets all the types for a given location
   * @param {String} type String type for a given location
   * @returns {Object}
   */
  async getLocations(type) {
    return this.httpGet(`locations/${type}`);
  }

  /**
   * Gets the summary of a given location
   * @param {String} id  Locations id
   * @returns {Object}
   */
  async getLocationSummary(id) {
    return this.httpGet(`locations/${id}/summary`);
  }

  /**
   * Gets all the kingdomes
   * @returns {Object}
   */
  async getKingdoms() {
    return this.httpGet(`kingdoms`)
  }

  /**
   * Gets the size of a kingdome
   * @param {String} id Kingdom id
   * @returns {Object}
   */
  async getKingdomSize(id) {
    return this.httpGet(`kingdoms/${id}/size`);
  }

  /**
   * Gets the count of castles that belong to a kingdom
   * @param {String} id Kingdom id
   * @returns {Object} 
   */
  async getCastleCount(id) {
    return this.httpGet(`kingdoms/${id}/castles`);
  }

  /**
   * Gets summary data for a singl kingdom
   * @param {String} id Kingdom id
   * @returns {Object}
   */
  async getKingdomSummary(id) {
    return this.httpGet(`kingdoms/${id}/summary`);
  }

  /**
   * Gets all the kingdom details as an object
   * @param {String} id Kingdom id
   * @returns {Object}
   */
  async getAllKingdomDetails(id) {
    return {
      kingdomSize: await this.getKingdomSize(id),
      castleCount: await this.getCastleCount(id),
      kingdomSummary: await this.getKingdomSummary(id)
    }
  }
}