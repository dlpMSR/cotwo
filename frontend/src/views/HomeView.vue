<template>
  <main>
    <v-container fluid :style="{ 'margin-top': margin.topClock + 'px' }">
      <v-row justify="center" class="padding-horizontal-clock">
        <TimeDisplay />
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row justify="center" class="padding-horizontal-clock">
        <EnviroDisplay />
      </v-row>
    </v-container>
  </main>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import TimeDisplay from '@/components/TimeDisplay.vue'
import EnviroDisplay from '@/components/EnviroDisplay.vue'

export default defineComponent({
  components: {
    TimeDisplay, EnviroDisplay
  },

  data() {
    return {
      iw: 0,
    }
  },

  computed: {
    margin() {
      return {
        topClock: this.iw * 0.025
      }
    },

    padding() {
      return {
        horizontalClock: this.iw * 0.25,
      }
    }
  },

  methods: {
    updateMargin() {
      this.iw = window.innerWidth
    }
  },

  beforeMount() {
    this.updateMargin()
  },

  mounted() {
    window.addEventListener('resize', this.updateMargin)
  }
})
</script>

<style>
.margin-top-clock {
  margin-top: v-bind("margin.topClock + 'px'");
}

.padding-horizontal-clock {
  padding-right: v-bind("padding.horizontalClock + 'px'");
  padding-left: v-bind("padding.horizontalClock + 'px'");
}
</style>
