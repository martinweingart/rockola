<template>
    <v-layout row wrap ref="container">
        <v-flex md2 xs4  v-for="album of albums" :key="album.id" class="ma-3">
            <v-card>
              <v-responsive style="max-height:150px;">
                  <img
                    style="width:100%"
                    src="@/assets/noalbum.jpeg"
                    />
              </v-responsive>
              
                <v-card-title class="pa-2 ma-0">
                    <div style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;">
                        <div style="font-size:70%;">{{ album.name }}</div>
                        <div style="font-size:60%">{{ album.artist.name }}</div>
                    </div>
                </v-card-title>

              <v-divider light></v-divider>

              <v-card-actions class="pa-1 ma-0">
                <v-btn icon small @click="play(album.id)">
                    <v-icon>play_circle_outline</v-icon>
                </v-btn>

                <v-btn icon small @click="add(album.id)">
                    <v-icon>playlist_add</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon small>
                    <v-icon>more_vert</v-icon>
                </v-btn>                
              </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>
import { getTrackUrl } from '@/utils'
import api from '@/services/api'
import player from '@/services/player'

export default {
    name: 'AlbumList',

    props: {
        filter: String
    },        

    data() {
        return {
            albums: [],
            offset: 0
        }
    },

    watch: {
        filter: function() {
            this.offset = 0;
            this.update();
        }
    },    

    created: function() {
        this.update();
    },


    mounted: function() {
        let content = document.getElementById('content');
        content.onscroll = () => {
            let bottom = content.scrollTop + content.offsetHeight === this.$refs.container.offsetHeight;
            if (bottom) {
                this.offset += 20;
                this.update();
            }
        };        
    },    

    methods: {
        update: function() {
            let url = `/albums?limit=20&offset=${this.offset}`;
            if (this.filter) url+= `&q=${this.filter}`;

            api.get(url)
            .then(r => {
                if (this.offset === 0) this.albums = r.data;
                else this.albums = this.albums.concat(r.data);
            })
        },

        play: function(id) {
            api.get(`/albums/${id}/tracks`)
            .then(r => {
                this.$store.commit('queue_clear')

                for(let track of r.data) {
                    track.src= getTrackUrl(track.id);
                    this.$store.commit('queue_add', track);
                }
                player.play();
            })
        },

        add: function(id) {
            api.get(`/albums/${id}/tracks`)
            .then(r => {
                for(let track of r.data) {
                    track.src= getTrackUrl(track.id);
                    this.$store.commit('queue_add', track);
                }
            })
        }
    }

}
</script>

<style>

</style>
