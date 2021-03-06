const state = {
  currentTrack: undefined,
  currentArtwork: "",
  audioElement: undefined,
  shuffledPlaylist: [],
  playing: true,
  currentTime: "0:00",
  progress: 0,
  remainingTime: "",
  volume: 0,
  mouseDown: false,
  duration: 0,
  currentTrackIndex: 0,
  autoPlay: false,
  repeat: false,
  mute: false,
  shuffle: false,
  previewUrlForCurrentTrack: false
};

export default state;
