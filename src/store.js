import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    queue: [],
    playing: 0,
    playlist: null,
    playlists: [],
  },

  mutations: {
    queue_add (state, track) {
      state.queue.push(track)
    },

    queue_clear (state) {
      state.queue = [];
      state.playing = 0;
    },

    queue_increment (state) {
      state.playing = state.playing + 1;
    },

    queue_decrement (state) {
      state.playing = state.playing - 1;
    },

    queue_set (state, tracks) {
      state.queue = tracks;
      state.playing = 0;
    },

    set_playing (state, playing) {
      state.playing = playing;
    },

    queue_remove (state, index) {
      if (state.playing == index) state.playing++;
      state.queue.splice(index, 1);
    },

    playlists_set(state, playlists) {
      state.playlists = playlists;
    },

    playlists_add (state, playlist) {
      state.playlists.push(playlist);
    },

    playlist_set (state, name) {
      state.playlist = name;
    }
  },

  actions: {

  }
})
