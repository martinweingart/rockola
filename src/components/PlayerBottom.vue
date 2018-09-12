<template>
<v-container>
    <v-layout row>
            <v-btn icon>
                <v-icon>skip_previous</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>play_circle_outline</v-icon>
            </v-btn>

            <v-progress-linear
                background-color="grey lighten-4"
                color="grey"
                v-model="song_progress"
            ></v-progress-linear>

            <v-btn icon>
                <v-icon>skip_next</v-icon>
            </v-btn>
    </v-layout>
</v-container>
</template>

<script>
export default {
    name: 'PlayerBottom',

    data() {
        return {
            song_progress: 70
        }
    }

}
</script>

<style>

</style>
