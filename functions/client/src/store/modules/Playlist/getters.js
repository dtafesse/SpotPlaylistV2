const getters = {
  getRecentlyGeneratedPlaylist: state => state.recentlyGeneratedPlaylist,
  getCurrentPlaylistMetaData: state => state.currentPlaylistMetaData,
  getCurrentPlaylist: state => state.playlist,
  isCurrentPlaylistSavedOnSpotify: state =>
    !!state.currentPlaylistMetaData.spotifyGeneratedPlaylistId
};

export default getters;
