<template>
  <main>
    <div :style="{ 'margin-top': margin.clockTop + 'px' }">
      <v-row justify="center">
        <TimeDisplay />
      </v-row>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import TimeDisplay from '@/components/TimeDisplay.vue'

export default defineComponent({
  components: {
    TimeDisplay
  },

  data() {
    return {
        margin: {
          clockTop: 0,
      }
    }
  },

  methods: {
    updateMargin() {
      const iw:number = window.innerWidth
      this.margin.clockTop = iw * 0.1
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
