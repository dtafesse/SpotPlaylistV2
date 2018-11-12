import api from '../../../api/index';
import queryString from 'query-string';
import router from '../../../router/index';
import * as firebase from 'firebase'

const state = {
    spotifyAuthCode: window.localStorage.getItem("spotAuthCode"),
    user: null
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
    },
    firebaseSignUpUser ({commit}, signUpRequest) {
        firebase.auth().createUserWithEmailAndPassword(signUpRequest.email, signUpRequest.password)
            .then(
                user => {
                    const newUser = {
                        id: user.UID
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    console.log(error); //TODO: Need to display error for user
                }
            )
    },
    firebaseSignInUser ({commit}, signInRequest) {
        firebase.auth().signInWithEmailAndPassword(signInRequest.email, signInRequest.password)
            .then(
                user => {
                    const oldUser = {
                        id: user.UID
                    }
                    commit('setUser', oldUser)
                }
            )
            .catch(
                error => {
                    console.log(error); //TODO: Need to display error for user
                }
            )
    }
};
const mutations = {
    setSpotifyAuthCode: (state, access_token) =>{
        state.spotifyAuthCode = access_token;
    },
    setUser: (state, userObject) => {
        state.user = userObject;
    }
};

export default{
    state,
    getters,
    actions,
    mutations
}