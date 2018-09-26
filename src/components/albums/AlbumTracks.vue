<template>
<v-container ref="container">
    <v-list two-line subheader dense style="background:#ECEFF1">
        <v-list-tile
            v-for="(track,i) in tracks"
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
</v-container>
</template>

<script>
import { getTrackUrl, download } from '@/utils'
import api from '@/services/api'
import player from '@/services/player'

export default {
    name: 'AlbumTracks',

    props: {
        album: Number
    },

    data() {
        return {
            offset: 0,
            tracks: []
        }
    },

    watch: {
        album: function() {
            this.update();
        }
    },

    created: function() {
        this.update();
    },

    methods: {
        update: function() {
            if (this.album != null) {
                let url = `/tracks?album=${this.album}&limit=20&offset=${this.offset}`;

                api.get(url)
                .then(r => {
                    if (this.offset === 0) this.tracks = r.data;
                    else this.tracks = [...this.tracks, ...r.data];
                })
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
        }
    }

}
</script>

<style>

</style>
