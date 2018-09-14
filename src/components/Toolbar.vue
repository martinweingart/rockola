<template>
  <v-toolbar dark color="black">
    <v-icon>music_note</v-icon>

    <v-toolbar-title class="white--text">Rockola!</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon
      v-show="!show_filter"
      @click="show_filter = true"
    >
      <v-icon>search</v-icon>
    </v-btn>

    <transition name="slide">
      <v-text-field
        v-show="show_filter"
        placeholder="Search..."
        hide-details
        single-line
        prepend-icon="search"
        append-icon="close"
        :value="value"
        @click:append="clear"
        @input="$emit('input', $event)"
      ></v-text-field>      
    </transition>

    <v-menu offset-y v-if="$store.state.playlists.length > 0">
      <v-btn
        title="Playlists Saved"
        slot="activator"
        dark
        icon
      >
        <v-icon>list</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(playlist, index) in $store.state.playlists"
          :key="index"
          @click="play(playlist)"
        >
          <v-list-tile-title>
            <v-icon class="white--text mr-2">play_arrow</v-icon> 
            {{ playlist.name }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import player from '@/services/player'

export default {
    name: 'Toolbar',

    props: ['value'],

    data() {
      return {
        show_filter: false
      }
    },

    methods: {
      clear: function() {
        this.show_filter = false;
        this.$emit('input', '');
      },

      play: function(playlist) {
        this.$store.commit('queue_set', playlist.tracks);
        this.$store.commit('playlist_set', playlist.name);
        player.play();
      }
    }

}
</script>

<style>
.slide-enter-active {
  transition: all .5s ease;
}
.slide-enter, .slide-leave-to {
  opacity: 0;
}
</style>
