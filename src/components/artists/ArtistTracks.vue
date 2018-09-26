<template>
<v-layout>
    <v-flex xs12>
    <v-list
        v-for="album of albums"
        :key="album.id"
        two-line subheader dense style="background:#ECEFF1"
    >
        <v-subheader inset style="margin:20px 0 20px 0">
            <v-list-tile-avatar>
              <img :src="getAlbumArt(album.id)">
            </v-list-tile-avatar>
            {{ album.name }}
        </v-subheader>
        <v-list-tile
            v-for="(track,i) in album.tracks"
            :key="i"
            avatar
        >
            <v-list-tile-action style="min-width:40px">
                <v-btn small icon ripple @click="play(track)" class="ma-0 pa-0">
                    <v-icon>play_circle_filled</v-icon>
                </v-btn>
            </v-list-tile-action>

            <v-list-tile-action style="min-width:40px">
                <v-btn icon small ripple @click="add(track)" class="ma-0 pa-0">
                    <v-icon>playlist_add</v-icon>
                </v-btn>
            </v-list-tile-action>

            <v-list-tile-content>
                <v-list-tile-title>{{ track.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ track.artist.name }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
                <v-btn icon ripple @click="download(track.id)">
                    <v-icon>cloud_download</v-icon>
                </v-btn>
            </v-list-tile-action>
        </v-list-tile>
    </v-list>
    </v-flex>
</v-layout>
</template>

<script>
import config from '@/config'
import { getTrackUrl, download } from '@/utils'
import api from '@/services/api'
import player from '@/services/player'

export default {
    name: 'ArtistTracks',

    props: {
        artist: Number
    },

    data() {
        return {
            offset: 0,
            albums: []
        }
    },

    watch: {
        artist: function() {
            this.update();
        }
    },

    created: function() {
        this.update();
    },

    methods: {
        update: function() {
            if (this.artist != null) {
                let albums = [];

                api.get(`/artists/${this.artist}`)
                .then(r => {
                    albums = r.data.albums;
                    let proms = r.data.albums.map(a => api.get(`/albums/${a.id}/tracks`));
                    return Promise.all(proms);
                })
                .then(r => {
                    r.forEach((tracks, index) => {
                        albums[index].tracks = tracks.data;
                    });
                    this.albums = albums;
                });
            }
        },

        play: function(track) {
            this.$store.commit('queue_clear');
            track.src= getTrackUrl(track.id);
            this.$store.commit('queue_add', track);
            player.play();
        },

        add: function(track) {
            track.src= getTrackUrl(track.id);
            this.$store.commit('queue_add', track);
        },

        download: function(id) {
           download(getTrackUrl(id) + '/download');
        },

        getAlbumArt: function(id) {
            return `${config.files}/album-art/${id}`;
        },
    }

}
</script>

<style>

</style>
