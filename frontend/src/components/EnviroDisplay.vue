<template>
  <div class="d-flex justify-end" ref="enviroContainer" style="width: 100%;">
    <div class="d-flex flex-row">
      <div class="d-flex align-end">
        <span class="number co2">{{ co2 }}</span>
        <span>ppm</span>
      </div>

      <div class="ml-5">
        <div>
          <span class="number temperature">{{ temperature }}</span>
          <span>℃</span>   
        </div>
        <div class="mt-3">
          <span class="number humidity">{{ humidity }}</span>
          <span>%</span>  
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios'

export default defineComponent({
  data () {
    return {
      socket: {},
      ew: 0,

      co2: 0,
      temperature: 0,
      humidity: 0,
    }
  },

  computed: {
    fontSize() {
      return {
        co2: this.ew * 0.1,
        temperature: this.ew * 0.045,
        humidity: this.ew * 0.045
      }
    }
  },

  methods: {
    updateEnviroDisplayWidth() {
      this.ew = (this.$refs.enviroContainer as any).clientWidth
    },

    getEnvValues() {
      axios.get('/api/v1/env_value')
      .then(res => {
        // console.log(res.data)
        this.co2 = res.data.co2
        this.temperature = res.data.temperature
        this.humidity = res.data.humidity
      })
    }
  },

  beforeMount() {
    this.getEnvValues()
    this.socket = new WebSocket("ws://" + window.location.host + "/ws/env_values")
  },

  mounted() {
    this.socket.addEventListener("message", function(event) {
      console.log(event.data);
    })

    this.updateEnviroDisplayWidth()
    window.addEventListener('resize', this.updateEnviroDisplayWidth)
    // setInterval(this.getEnvValues, 60* 1000)
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/sass/mixin.scss';
.number {
  @include LatoBold;
  line-height: 1;
  &.co2 {
    font-size:  v-bind("fontSize.co2 + 'px'")
  }

  &.temperature {
    font-size: v-bind("fontSize.temperature + 'px'")
  }

  &.humidity {
    font-size: v-bind("fontSize.humidity + 'px'")
  }
}
</style>