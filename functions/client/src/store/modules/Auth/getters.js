const getters = {
  isSpotifyLoggedIn: state => !!state.spotifyAuthAccessCode,
  user: state => state.user,
  error: state => state.error,
  getAccessToken: state => state.spotifyAuthAccessCode,
  getRefreshToken: state => state.spotifyAuthRefreshCode
};

export default getters;
