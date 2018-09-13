<template>
  <v-container style="height:100%">
    <menu-lateral v-model="menu_lateral"></menu-lateral>

    <v-dialog
      v-model="show_queue"
      width="50%"
      scrollable
    >
      <queue @close="show_queue = false"></queue>        
    </v-dialog>   

    <toolbar @menu="menu_lateral = true" id="header"></toolbar>

    <v-tabs
      centered
      color="primary"
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
          ></tracks> 
      </v-tab-item>

      <v-tab-item id="tab-albums" style="overflow:auto">
        <album-list
          v-if="tab == 'tab-albums'"
        ></album-list>
      </v-tab-item>

      <v-tab-item id="tab-artists" style="overflow:auto">
        <artist-list
          v-if="tab == 'tab-artists'"
        ></artist-list>
      </v-tab-item>
    </v-tabs-items>    

    <player-bottom id="footer" @openQueue="show_queue = true"></player-bottom>

  </v-container>
</template>

<script>
import MenuLateral from '@/components/MenuLateral'
import Toolbar from '@/components/Toolbar'
import PlayerBottom from '@/components/PlayerBottom'
import Tracks from '@/components/tracks/Tracks'
import AlbumList from '@/components/albums/AlbumList'
import ArtistList from '@/components/artists/ArtistList'
import Queue from '@/components/tracks/Queue'

export default {
  name: 'Home',

  components: {
    MenuLateral,
    Tracks,
    Toolbar,
    PlayerBottom,
    AlbumList,
    ArtistList,
    Queue
  },

  data() {
    return {
      menu_lateral: false,
      tab: 'tab-tracks',
      show_queue: false
    }
  }
  
}
</script>

<style scoped>
#header {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
}

#content {
  max-height: 75%;
  overflow:auto;
}

#footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
