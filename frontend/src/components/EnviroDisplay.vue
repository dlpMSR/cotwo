<template>
  <div class="d-flex justify-end" ref="enviroContainer" style="width: 100%;">
    <div class="d-flex flex-row ">
      <div class="d-flex">
        <span class="unit align-self-start" :style="{ 'margin-right': margin.betweenTempHumid + 'px' }">
          CO<sub>2</sub>
        </span>
        <span class="number co2">{{ co2 }}</span>
        <span class="unit align-self-end">ppm</span>
      </div>

      <div class="temp-humidity">
        <div class="d-flex">
          <span class="number temperature me-auto">{{ temperature.toFixed(1) }}</span>
          <span class="unit align-self-end">°C</span>   
        </div>

        <div class="d-flex" :style="{ 'margin-top': margin.betweenTempHumid + 'px' }">
          <span class="number humidity me-auto">{{ humidity.toFixed(1) }}</span>
          <span class="unit align-self-end">%</span>  
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
      socket: {} as WebSocket,
      elementWidth: 0,

      co2: 0,
      temperature: 0,
      humidity: 0,
    }
  },

  computed: {
    fontSize() {
      return {
        co2: this.elementWidth * 0.12,
        temperature: this.elementWidth * 0.07,
        humidity: this.elementWidth * 0.07,
        unit: this.elementWidth * 0.03
      }
    },

    margin() {
      return {
        leftTempHumid: this.elementWidth * 0.03,
        betweenTempHumid: this.elementWidth * 0.02,
        betweenValUnit: this.elementWidth * 0.02
      }
    }
  },

  methods: {
    updateEnviroDisplayWidth() {
      this.elementWidth = (this.$refs.enviroContainer as any).clientWidth
    },

    getEnvValues() {
      axios.get('/api/v1/env_value')
      .then(res => {
        this.co2 = res.data.co2
        this.temperature = res.data.temperature
        this.humidity = res.data.humidity
      })
    }
  },

  beforeMount() {
    this.getEnvValues()
  },

  mounted() {
    this.socket = new WebSocket("ws://" + window.location.host + "/ws/env_values")
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data).message
      this.co2 = message.co2
      this.temperature = message.temperature
      this.humidity = message.humidity
    })

    this.updateEnviroDisplayWidth()
    window.addEventListener('resize', this.updateEnviroDisplayWidth)
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/sass/mixin.scss';

.temp-humidity {
  margin-left: v-bind("margin.leftTempHumid + 'px'");
}
.number {
  @include LatoBold;
  line-height: 1;
  text-shadow: 1px 1px 2px white;
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

.unit {
    @include LatoBold;
    line-height: 1;
    text-shadow: 1px 1px 2px white;
    font-size: v-bind("fontSize.unit + 'px'");
}
</style>