import api from '../../../api/index';
import queryString from 'query-string';
import router from '../../../router/index';
import * as firebase from 'firebase'

const state = {
    spotifyAuthCode: window.localStorage.getItem("spotAuthCode"),
    user: null,
    loading: false,
    error: null
};
const getters = {
    isSpotifyLoggedIn: state => !!state.spotifyAuthCode,
    user (state) {
        return state.user
    },
    loading (state) {
        return state.loading
    },
    error (state) {
        return state.error
    }
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
    },
    firebaseSignUpUser ({commit}, signUpRequest) {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().createUserWithEmailAndPassword(signUpRequest.email, signUpRequest.password)
            .then(
                response => {
                    commit('setLoading', false)
                    const newUser = {
                        id: response.user.uid
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error); 
                }
            )
    },
    firebaseSignInUser ({commit}, signInRequest) {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().signInWithEmailAndPassword(signInRequest.email, signInRequest.password)
            .then(
                response => {
                    commit('setLoading', false)
                    const oldUser = {
                        id: response.user.uid
                    }
                    commit('setUser', oldUser)
                }
            )
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error); 
                }
            )
    },
    clearError({commit}) {
        commit('clearError')
     }
};
const mutations = {
    setSpotifyAuthCode: (state, access_token) =>{
        state.spotifyAuthCode = access_token;
    },
    setUser: (state, userObject) => {
        state.user = userObject;
    },
    setLoading: (state, isLoading) => {
        state.loading = isLoading;
    },
    setError: (state, error) => {
        state.error = error;
    },
    clearError (state) {
        state.error = null;
    }
};

export default{
    state,
    getters,
    actions,
    mutations
}