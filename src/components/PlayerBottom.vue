<template>
<v-container>
    <v-layout row>
            <v-btn icon>
                <v-icon>skip_previous</v-icon>
            </v-btn>

            <audio 
                controls src="assets/youraudio.mp3" type="audio/mpeg"
                style="width:100%"
            ></audio>

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
audio__controls {
  height: 70%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

  audio__controls__progress {
    height: 20px;
    display: flex;
    justify-content: space-between;
  }
audio__controls__progress__currentTime, audio__controls__progress__songDuration {
      width: 3em;
      font-size: 12px;
      font-family: Helvetica, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    audio__controls__progress__bar {
      flex-grow: 1;
      align-self: center;
      border-radius: 5px;
      background: black;
      height: 5px;
      position: relative;
    }
      audio__controls__progress__percent {
        position: absolute;
        height: inherit;
        border-radius: 5px;
        content: "";
        background: white;
        z-index: 5;
      }
</style>
