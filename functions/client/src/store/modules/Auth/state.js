const state = {
  user: null,
  error: null,
  spotifyAuthAccessCode: window.localStorage.getItem("spotifyAuthAccessCode"),
  spotifyAuthRefreshCode: window.localStorage.getItem("spotifyAuthRefreshCode"),
  userSpotifyTopArtists: null
};

export default state;
