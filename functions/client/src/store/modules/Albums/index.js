import api from "../../../api/index";

const state = {
  newlyReleasedAlbums: undefined
};

const actions = {
  fetchNewReleasedAlbums: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      api.fetchNewReleasedAlbums().then(({ items }) => {
        commit("SET_NEWLY_RELEASED_ALBUMS", items);
        resolve();
      });
    });
  }
};

const mutations = {
  SET_NEWLY_RELEASED_ALBUMS: (state, albums) => {
    state.newlyReleasedAlbums = albums;
  }
};

export default {
  state,
  actions,
  mutations
};
