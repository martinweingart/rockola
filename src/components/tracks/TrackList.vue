<template>
    <v-list two-line subheader dense style="background:#ECEFF1">
        <div style="padding:10px"></div>
        <v-subheader 
            v-if="avatar"
            inset 
            style="margin:0"
        >
            <v-list-tile-avatar>
              <img :src="avatarSrc">
            </v-list-tile-avatar>
            {{ avatarText }}
        </v-subheader>

        <v-list-tile
            class="pa-0 ma-0"
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
                <v-list-tile-title>{{ track.track }} - {{ track.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ track.artist.name }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
                <v-btn icon ripple @click="download(track.id)">
                    <v-icon>cloud_download</v-icon>
                </v-btn>
            </v-list-tile-action>
        </v-list-tile>
    </v-list>    
</template>

<script>
import { getTrackUrl, download } from '@/utils'
import player from '@/services/player'

export default {
    name: 'TrackList',
    
    props: {
        avatar: {
            type: Boolean,
            default: () => false
        },
        avatarSrc: String,
        avatarText: String,
        tracks: Array
    },

    methods: {
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
