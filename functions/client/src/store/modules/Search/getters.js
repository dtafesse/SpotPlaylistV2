const getters = {
  getArtistId: state => state.selectedArtistId,
  isSearchQueryCleared: state => state.searchQueryCleared,
  getQueryResult: state => state.queryResult,
  isLoading: state => state.loading,
  getSelectedItems: state => state.selectedItems,
  getNewGeneratedPlaylist: state => state.newGeneratedPlaylist
};

export default getters;
