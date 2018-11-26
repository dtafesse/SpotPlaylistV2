const getters = {
  getArtistId: state => state.selectedArtistId,
  isSearchQueryCleared: state => state.searchQueryCleared,
  getQueryResult: state => state.queryResult,
  isLoading: state => state.loading,
  getSelectedAlbums: state => state.selectedAlbums,
  getSelectedArtists: state => state.selectedArtists,
  getNewGeneratedPlaylist: state => state.newGeneratedPlaylist
};

export default getters;
