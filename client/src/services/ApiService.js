import {
  CancelToken,
  get
} from 'axios';

export default class ApiService {
  constructor(url = 'http://localhost:5000/') {
    this.url = url;
    this.cancelToken = CancelToken.source()
  }

  async httpGet(endpoint = "") {
    this.cancelToken.cancel("Cancelled Ongoing Request");
    this.cancelToken = CancelToken.source();
  }
}