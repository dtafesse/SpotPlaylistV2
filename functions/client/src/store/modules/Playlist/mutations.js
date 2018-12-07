const mutations = {
  SET_PLAYLIST: (state, payload) => {
    state.playlist = payload;
  },
  SET_CURRENT_PLAYLIST_META_DATA: (state, playlistIds) => {
    state.currentPlaylistMetaData = { ...playlistIds };
  },
  SET_RECENTLY_GENERATED_PLAYLISTS: (state, playlists) => {
    state.recentlyGeneratedPlaylist = playlists;
  },
  ADD_TO_RECENTLY_GENERATED_PLAYLISTS: (state, playlist) => {
    state.recentlyGeneratedPlaylist.push({ ...playlist });
  },
  UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER: (state, { key, newValue, id }) => {
    let index = state.recentlyGeneratedPlaylist.findIndex(x => x.id == id);
    state.recentlyGeneratedPlaylist[index][key] = newValue;
  },
  UPDATE_PLAYLIST_NAME: (state, newName) => {
    state.currentPlaylistMetaData.playlistName = newName;
  },
  UPDATE_PLAYLIST_SNAPSHOT_ID: (state, id) => {
    state.currentPlaylistMetaData.snapshot_id = id;
  },
  SET_SPOTIFY_GENERATED_PLAYLIST_ID: (state, playlistId) => {
    state.currentPlaylistMetaData.spotifyGeneratedPlaylistId = playlistId;
  },
  SET_SPOTIFY_GENERATED_SNAPSHOT_ID: (state, snapshot_id) => {
    state.currentPlaylistMetaData.snapshot_id = snapshot_id;
  },
  UPDATE_CURRENT_PLAYLIST_WITH_NEW_TRACK: (state, { track, index }) => {
    // state.playlist[index] = track;
    // state.playlist = state.playlist.map(t => t); // neccesary for it to be reactive

    // remove one element at given idex with given track
    state.playlist.splice(index, 1, track);
  },
  REMOVE_TRACK_FROM_CURRENT_PLAYLIST: (state, index) => {
    state.playlist.splice(index, 1);
  },
  UPDATE_CURRENT_PLAYLIST_META_DATA_WITH_NEW_TRACK_URI_ID: (
    state,
    { track, index }
  ) => {
    let temp = [...state.currentPlaylistMetaData.playlistIds];
    temp[index] = track;
    state.currentPlaylistMetaData.playlistIds = [...temp];

    //state.currentPlaylistMetaData.playlistIds.splice(index, 1, track);
  },
  REMOVE_TRACK_URI_ID_FROM_CURRENT_PLAYLIST_META_DATA: (state, index) => {
    let temp = [...state.currentPlaylistMetaData.playlistIds];
    temp.splice(index, 1);
    state.currentPlaylistMetaData.playlistIds = [...temp];
  },
  UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER_WITH_NEW_TRACK_URI_ID: (
    state,
    { trackUri, id, trackUriPosition }
  ) => {
    let index = state.recentlyGeneratedPlaylist.findIndex(x => x.id == id);

    let temp = [...state.recentlyGeneratedPlaylist[index].playlistIds];
    temp[trackUriPosition] = trackUri;

    state.recentlyGeneratedPlaylist[index].playlistIds = [...temp];
  },
  REMOVE_TRACK_URI_ID_FROM_RECENTLY_GENERATED_PLAYLIST_MEMBER: (
    state,
    { id, trackUriPosition }
  ) => {
    let index = state.recentlyGeneratedPlaylist.findIndex(x => x.id == id);

    let temp = [...state.recentlyGeneratedPlaylist[index].playlistIds];
    temp.splice(trackUriPosition, 1);

    state.recentlyGeneratedPlaylist[index].playlistIds = [...temp];
  },
  SET_FEATURED_PLAYLISTS: (state, playlist) => {
    state.featuredPlaylists = playlist;
  },
  REMOVE_SELECTED_PLAYLIST_FROM_RECENTLY_GENERATED_PLAYLISTS: (
    state,
    index
  ) => {
    let temp = [...state.recentlyGeneratedPlaylist];
    temp.splice(index, 1);
    state.recentlyGeneratedPlaylist = [...temp];
  }
};

export default mutations;
