<template>
<v-container>
    <v-layout row>
            <v-btn icon @click="playPrev">
                <v-icon>skip_previous</v-icon>
            </v-btn>

            <audio 
                ref="player"
                controls
                type="audio/mpeg"
                style="width:100%"
            ></audio>

            <v-btn icon @click="playNext">
                <v-icon>skip_next</v-icon>
            </v-btn>

            <v-btn icon @click="$emit('openQueue')">
                <v-icon>open_in_browser</v-icon>
            </v-btn>
    </v-layout>
</v-container>
</template>

<script>
import player from '@/services/player'

export default {
    name: 'PlayerBottom',

    data() {
        return {
        }
    },

    mounted: function() {
        player.init(this.$refs.player);
    },

    methods: {
        playPrev: function() {
            player.previous();
        },

        playNext: function() {
            player.next();
        }
    }

}
</script>

<style>
</style>
