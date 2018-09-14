<template>
  <v-container style="height:100%;max-height:100%" class="pa-0">
    <v-dialog
      v-model="show_queue"
      width="90%"
      scrollable
    >
      <queue @close="show_queue = false"></queue>
    </v-dialog>

    <v-dialog
      v-model="show_save"
      scrollable
    >
      <v-card>
        <v-card-text>
              <v-text-field
                label="Name"
                v-model="new_playlist"
                :rules="[(v) => v.length > 0 ? true : 'Debe ingresar un nombre']"
              ></v-text-field>      

              <v-btn style="float:right" :disabled="!new_playlist.length" @click="save">
                Guardar
                <v-icon>save</v-icon>
              </v-btn>        
          </v-card-text>
      </v-card>
    </v-dialog>

    <toolbar
      id="header"
      v-model="filter"
    ></toolbar>

    <v-tabs
      centered
      color="blue-grey darken-4"
      dark
      icons-and-text
      fixed-tabs
      height="50%"
      v-model="tab"
    >
      <v-tabs-slider color="white"></v-tabs-slider>
      <v-tab href="#tab-tracks" title="Tracks">
        <v-icon>library_music</v-icon>
      </v-tab>

      <v-tab href="#tab-artists" title="Artists">
        <v-icon>people</v-icon>
      </v-tab>

      <v-tab href="#tab-albums" title="Albums">
        <v-icon>album</v-icon>
      </v-tab>

      <!-- <v-tab href="#tab-genres" title="Tags">
        <v-icon>style</v-icon>
      </v-tab>       -->
    </v-tabs>

    <v-tabs-items v-model="tab" id="content">
      <v-tab-item id="tab-tracks">
          <tracks
            v-if="tab == 'tab-tracks'"
            :filter="filter"
          ></tracks>
      </v-tab-item>

      <v-tab-item id="tab-albums" style="overflow:auto">
        <album-list
          v-if="tab == 'tab-albums'"
          :filter="filter"
        ></album-list>
      </v-tab-item>

      <v-tab-item id="tab-artists" style="overflow:auto">
        <artist-list
          v-if="tab == 'tab-artists'"
          :filter="filter"
        ></artist-list>
      </v-tab-item>
    </v-tabs-items>

    <player-bottom id="footer" @openQueue="show_queue = true" @save="show_save = true"></player-bottom>

  </v-container>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import PlayerBottom from '@/components/PlayerBottom'
import Tracks from '@/components/tracks/Tracks'
import AlbumList from '@/components/albums/AlbumList'
import ArtistList from '@/components/artists/ArtistList'
import Queue from '@/components/tracks/Queue'

export default {
  name: 'Home',

  components: {
    Tracks,
    Toolbar,
    PlayerBottom,
    AlbumList,
    ArtistList,
    Queue
  },

  data() {
    return {
      tab: 'tab-tracks',
      show_queue: false,
      show_save: false,
      filter: '',
      debouncedFilter: null,
      new_playlist: ''
    }
  },

  created: function() {
    let playlist = this.$localStorage.get('rockola_playlist');
    if (playlist) {
      let playlist_saved = JSON.parse(this.$localStorage.get('rockola_playlist'));
      this.$store.commit('playlists_set', playlist_saved);
    }
  },

  methods: {
    save: function() {
      let playlist_saved = JSON.parse(this.$localStorage.get('rockola_playlist')) || [];
      let playlist = {
        name: this.new_playlist,
        tracks: this.$store.state.queue
      };

      playlist_saved.push(playlist)
      this.$localStorage.set('rockola_playlist', JSON.stringify(playlist_saved))
      this.$store.commit('playlists_add', playlist);
      this.show_save = false;
    }
  }
}
</script>

<style scoped>
#content {
  height:73%;   
  overflow:auto;
  background: #ECEFF1;
}

#footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
