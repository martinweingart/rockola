<template>
    <v-layout row wrap ref="container">
        <v-flex md2 xs4  v-for="artist of artists" :key="artist.id" class="ma-3">
            <v-card>
              <v-responsive style="max-height:150px;">
                  <img
                    style="width:100%"
                    src="@/assets/noartist.jpeg"
                    />
              </v-responsive>

                <v-card-title class="pa-2 ma-0">
                    <div style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;">
                        <div>{{ artist.name }}</div>
                    </div>
                </v-card-title>

              <v-divider light></v-divider>

              <v-card-actions class="pa-1 ma-0">
                <v-btn icon small @click="play(artist)">
                    <v-icon>play_circle_outline</v-icon>
                </v-btn>

                <v-btn icon small @click="add(artist)">
                    <v-icon>playlist_add</v-icon>
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
    name: 'ArtistList',

    data() {
        return {
            artists: [],
            offset: 0
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
            let url = `/artists?limit=20&offset=${this.offset}`;
            api.get(url)
            .then(r => {
                this.artists = this.artists.concat(r.data);
            })
        },

        play: function(artist) {
            let proms = artist.albums.map(a => api.get(`/albums/${a.id}/tracks`));

            Promise.all(proms)
            .then(albums_tracks => {
                this.$store.commit('queue_clear')
                for(let tracks of albums_tracks) {
                    for(let track of tracks.data) {
                        track.src= getTrackUrl(track.id);
                        this.$store.commit('queue_add', track);
                    }
                }
                player.play();
            });
        },

        add: function(artist) {
            let proms = artist.albums.map(a => api.get(`/albums/${a.id}/tracks`));

            Promise.all(proms)
            .then(albums_tracks => {
                for(let tracks of albums_tracks) {
                    for(let track of tracks.data) {
                        track.src= getTrackUrl(track.id);
                        this.$store.commit('queue_add', track);
                    }
                }
            });
        },

       
    }

}
</script>

<style>

</style>
