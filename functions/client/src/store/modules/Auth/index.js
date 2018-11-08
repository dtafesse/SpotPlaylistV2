import api from '../../../api/index';
import queryString from 'query-string';
import router from '../../../router/index';

const state = {
    spotifyAuthCode: window.localStorage.getItem("spotAuthCode")
};
const getters = {
    isSpotifyLoggedIn: state => !!state.spotifyAuthCode
};
const actions = {
    loginSpotify: () => { 
        api.loginSpotify();
    },

    finalizeSpotifyLogin: ({commit}, searchQuery) => {
        const query = queryString.parse(searchQuery);
        commit("setSpotifyAuthCode", query.access_token);
        window.localStorage.setItem("spotAuthCode", query.access_token);
        router.push('/saved/playlists');
    },
    logoutSpotify: ({commit}) => {
        commit("setSpotifyAuthCode", null);
        window.localStorage.removeItem("spotAuthCode");
    }
    
};
const mutations = {
    setSpotifyAuthCode: (state, access_token) =>{
        state.spotifyAuthCode = access_token;
    }
};

export default{
    state,
    getters,
    actions,
    mutations
}