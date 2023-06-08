import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '37132472-47d9b0efe4089b759aaed266f';

  constructor() {
    this.page = 1;
    this.query = null;
    this.perPage = 40;
  }

  getPhotosByQuery() {
    return axios.get(`${this.#BASE_URL}/?`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: this.perPage,
        page: this.page,
      },
    });
  }
}
