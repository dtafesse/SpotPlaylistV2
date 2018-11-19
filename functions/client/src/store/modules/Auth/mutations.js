const mutations = {
  setUser: (state, userObject) => {
    state.user = userObject;
  },
  setError: (state, error) => {
    state.error = error;
  },
  clearError(state) {
    state.error = null;
  },
  setSpotifyAuthCodes: (state, { access_token, refresh_token }) => {
    state.spotifyAuthAccessCode = access_token;
    state.spotifyAuthRefreshCode = refresh_token;
  }
};

export default mutations;
