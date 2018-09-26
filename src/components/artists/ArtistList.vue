<template>
    <v-layout row wrap ref="container">
        <v-dialog v-model="show_tracks" scrollable width="90%">
            <v-card>
                <v-card-title class="black white--text">
                    Artist Tracks
                    <v-divider></v-divider>
                    <v-btn icon dark @click.native="show_tracks = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pa-0 ma-0">
                    <artist-tracks :artist="selected"></artist-tracks>
                </v-card-text>
            </v-card>
        </v-dialog>


        <v-flex md2 xs4  v-for="artist of artists" :key="artist.id" class="ma-3">
            <v-card>
              <v-responsive
                @click="openTracks(artist.id)"
                style="max-height:150px;cursor:pointer"
            >
                  <img
                    v-if="artist.photo"
                    style="width:100%"
                    :src="getUrlFoto(artist.id)"
                    />

                  <img
                    v-else
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
import config from '@/config'
import api from '@/services/api'
import player from '@/services/player'
import ArtistTracks from '@/components/artists/ArtistTracks'

export default {
    name: 'ArtistList',

    props: {
        filter: String
    },

    components: {
        ArtistTracks
    },

    data() {
        return {
            artists: [],
            offset: 0,
            show_tracks: false,
            selected: null
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
            let url = `/artists?limit=20&offset=${this.offset}`;
            if (this.filter) url+= `&q=${this.filter}`;

            api.get(url)
            .then(r => {
                if (this.offset === 0) this.artists = r.data;
                else this.artists = this.artists.concat(r.data);
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

        getUrlFoto: function(id) {
            return `${config.files}/artist-photo/${id}`;
        },

        openTracks: function(id) {
            this.selected = id;
            this.show_tracks = true;
        }


    }

}
</script>

<style>

</style>
