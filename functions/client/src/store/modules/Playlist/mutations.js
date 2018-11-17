const mutations = {
  SET_PLAYLIST: (state, payload) => {
    state.playlist = payload;
  },
  SET_CURRENT_PLAYLIST_META_DATA: (state, playlistIds) => {
    state.currentPlaylistMetaData = playlistIds;
  },
  SET_RECENTLY_GENERATED_PLAYLISTS: (state, playlists) => {
    state.recentlyGeneratedPlaylist = playlists;
  },
  ADD_TO_RECENTLY_GENERATED_PLAYLISTS: (state, playlist) => {
    state.recentlyGeneratedPlaylist.push(playlist);
  },
  UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER: (state, { key, newValue, id }) => {
    let index = state.recentlyGeneratedPlaylist.findIndex(x => x.id == id);
    state.recentlyGeneratedPlaylist[index][key] = newValue;
  },
  UPDATE_PLAYLIST_NAME: (state, newName) => {
    state.currentPlaylistMetaData.playlistName = newName;
  },
  SET_SPOTIFY_GENERATED_PLAYLIST_ID: (state, playlistId) => {
    state.currentPlaylistMetaData.spotifyGeneratedPlaylistId = playlistId;
  },
  SET_SPOTIFY_GENERATED_SNAPSHOT_ID: (state, snapshot_id) => {
    state.currentPlaylistMetaData.snapshot_id = snapshot_id;
  }
};

export default mutations;
