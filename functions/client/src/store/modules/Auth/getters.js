const getters = {
  isSpotifyLoggedIn: state => Boolean(state.spotifyAuthAccessCode) && Boolean(state.user),
  user: state => state.user,
  error: state => state.error,
  getAccessToken: state => state.spotifyAuthAccessCode,
  getRefreshToken: state => state.spotifyAuthRefreshCode,
  getUserSpotifyTopArtists: state => state.userSpotifyTopArtists
};

export default getters;
