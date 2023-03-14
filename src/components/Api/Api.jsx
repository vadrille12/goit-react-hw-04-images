const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32947980-69693e3c3da6102d615bc169f';

function fetchQuery(searchQuery, page) {
  return fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}
      &image_type=photo&orientation=horizontal&page=
      ${page}&per_page=20`
  ).then(response => response.json());
}

const api = { fetchQuery };

export default api;
