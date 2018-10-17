// const ROOT_URL = 'https://spotrestapi-kgfipe.turbo360-vertex.com';
const ROOT_URL_PROD =
  'https://us-central1-spotplaylist-dev.cloudfunctions.net/server';

//const ROOT_URL = ROOT_URL_PROD;
const ROOT_URL = '/server';

export default {
  fetchAlbumTracks() {
    return fetch('/server/api/album', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  // temp way to fetch artwork until search by top rated tracks of artists in implement
  fetchArtwork() {
    const id = '6NijWPXUijjGcrdkQFcflv';
    return fetch(`/server/api/artwork/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  fetchTopTracks(artistId) {
    return fetch(`${ROOT_URL}/api/artists/${artistId}/toptracks`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  fetchArtistId(artist) {
    return fetch(`${ROOT_URL}/api/artists/${artist}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  }
};
