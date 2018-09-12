<template>
<v-container>
    <v-list two-line subheader dense>
        <v-list-tile
            v-for="(item,i) in items"
            :key="i"
            avatar
        >
            <v-list-tile-action>
                <v-btn icon ripple>
                    <v-icon>play_circle_filled</v-icon>
                </v-btn>
            </v-list-tile-action>

            <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.artist }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
                <v-btn icon ripple>
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </v-list-tile-action>            
        </v-list-tile>    
    </v-list>
</v-container>    
</template>

<script>
export default {
    name: 'Tracks',

    data() {
        return {
            items: [
                {
                    title: 'Super canción',
                    artist: 'Dios'
                },
                {
                    title: 'Super canción',
                    artist: 'Dios'
                },
                {
                    title: 'Super canción',
                    artist: 'Dios'
                },
                {
                    title: 'Super canción',
                    artist: 'Dios'
                }
            ]
        }
    },

    methods: {
        a: function() {
            
        }
    }

}
</script>

<style>

</style>
