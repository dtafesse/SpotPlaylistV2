const mutations = {
  UPDATE_SEARCH_QUERY_CLEAR: (state, payload) => {
    state.searchQueryCleared = payload;
  },
  RESET_GENERATED_PLAYLIST: state => {
    state.newGeneratedPlaylist = [];
  },
  PUSH_TO_GENERATED_PLAYLIST: (state, track) => {
    state.newGeneratedPlaylist.push(track);
  },
  SET_SELECTED_ARTIST_ID: (state, payload) => {
    state.selectedArtistId = payload;
  },
  SET_QUERY_RESULTS_SEARCH_QUERY: (state, payload) => {
    state.queryResult = payload;
  },
  SET_LOADING: (state, payload) => {
    state.loading = payload;
  },
  ADD_TO_SELECTED_ALBUMS: (state, item) => {
    state.selectedAlbums.push(item);
  },
  ADD_TO_SELECTED_ARTISTS: (state, item) => {
    state.selectedArtists.push(item);
  },
  REMOVE_ITEM_FROM_SELECTED_ALBUMS: (state, index) => {
    state.selectedAlbums.splice(index, 1);
  },
  REMOVE_ITEM_FROM_SELECTED_ARTISTS: (state, index) => {
    state.selectedArtists.splice(index, 1);
  },
  REMOVE_ALL_SELECTED_ALBUMS: state => {
    state.selectedAlbums = [];
  },
  REMOVE_ALL_SELECTED_ARTISTS: state => {
    state.selectedArtists = [];
  }
};

export default mutations;
