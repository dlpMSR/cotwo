<template>
  <main>
    <v-container style="max-width: 1200px;">
      <v-row class="col-12 mb-5 ">
        <span class="mr-3" style="font-size: 2.2rem">{{ location }}</span>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12" md="6" lg="6">
          <div style="max-width: 600px; margin: 0 auto;" class="pa-2">
            <v-row>
              <div class="v-col-6">
                <span style="font-size: 2rem;">二酸化炭素濃度</span>
              </div>
              <div class="v-col-6">
                <div class="d-flex justify-end">
                  <span class="me-3" style="font-size: 1.3rem;">現在</span>
                  <span style="font-size: 3rem;">{{ co2 }}</span>
                  <span class="align-self-end ms-1" style="font-size: 1.3rem;">ppm</span>
                </div>

                <div class="d-flex justify-end mt-1">
                  <span v-if="lastUpdatedAt != ''" class="annotation-text">更新: {{ lastUpdatedAt }}</span>
                </div>
              </div>
            </v-row>
            
            <div class="mt-2">
              <span style="font-size: 1.7rem;">過去12時間の推移</span>
              <Co2Chart />
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="6" lg="6">
          <div style="max-width: 600px; margin: 0 auto;" class="pa-2">
            <v-row>
              <div class="v-col-6">
                <span style="font-size: 2rem;">気温と湿度</span>
              </div>
              <div class="v-col-6">
                <div class="d-flex justify-end">
                  <span class="me-3" style="font-size: 1.3rem;">現在</span>
                  <div class="d-flex me-2">
                    <span style="font-size: 3rem;">{{ temperature }}</span>
                    <span class="align-self-end" style="font-size: 1.3rem;">°C</span>
                  </div>
                  <div class="d-flex">
                    <span class="sev-seg" style="font-size: 3rem;">{{ humidity }}</span>
                    <span class="align-self-end" style="font-size: 1.3rem;">%</span>
                  </div>
                </div>

                <div class="d-flex justify-end mt-1">
                  <span v-if="lastUpdatedAt != ''" class="annotation-text">更新: {{ lastUpdatedAt }}</span>
                </div>
              </div>
            </v-row>
            
            <div class="mt-2">
              <span style="font-size: 1.7rem;">過去12時間の推移</span>
              <TempHumidityChart />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import Co2Chart from '@/components/Co2Chart.vue'
import TempHumidityChart from '@/components/TempHumidityChart.vue'
import axios from 'axios'
import { format } from 'date-fns'

export default defineComponent({
  components: {
    Co2Chart, TempHumidityChart
  },

  data() {
    return {
      socket: {} as WebSocket,

      co2: 0,
      temperature: 0,
      humidity: 0,
      lastUpdatedAt: '',

      location: import.meta.env.VITE_LOCATION
    }
  },

  methods: {
    async getEnvValues() {
      try {
        const res = await axios.get('/api/v1/environment/measurement')
        this.co2 = res.data.co2
        this.temperature = res.data.temperature
        this.humidity = res.data.humidity
      } catch (error) {
        console.log(error)
      }
    }
  },

  beforeMount() {
    this.getEnvValues()
  },

  mounted() {
    this.socket = new WebSocket("ws://" + window.location.host + "/ws/env_values")
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data).message
      this.lastUpdatedAt = format(new Date(), 'MM/dd HH:mm:ss')
      this.co2 = message.co2
      this.temperature = message.temperature
      this.humidity = message.humidity
    })
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/sass/mixin.scss';

span {
  color: #404040;
}

.annotation-text {
  color: #707070;
  font-size: 1.2rem;
}
</style>
