const getters = {
  getRecentlyGeneratedPlaylist: state => state.recentlyGeneratedPlaylist,
  getCurrentPlaylistMetaData: state => state.currentPlaylistMetaData,
  getCurrentPlaylist: state => state.playlist,
  isCurrentPlaylistSavedOnSpotify: state => {
    return (
      state.currentPlaylistMetaData &&
      state.currentPlaylistMetaData.spotifyGeneratedPlaylistId
    );
  },
  getFeaturedPlaylists: state => state.featuredPlaylists
};

export default getters;
