const mutations = {
  UPDATE_SEARCH_QUERY_CLEAR: (state, payload) => {
    state.searchQueryCleared = payload;
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
  ADD_TO_SELECTED_ITEMS: (state, item) => {
    state.selectedItems.push(item);
  },
  REMOVE_ITEM_FROM_SELECTED_ITEMS: (state, index) => {
    state.selectedItems.splice(index, 1);
  },
  REMOVE_ALL_SELECTED_ITEMS: state => {
    state.selectedItems = [];
  }
};

export default mutations;
