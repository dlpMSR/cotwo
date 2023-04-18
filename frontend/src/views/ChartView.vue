<template>
  <main>
    <v-container style="max-width: 1200px;">
      <v-row class="col-12 mb-5">
        <span style="font-size: 2.2rem">セキュアサイクル 若松ひびきのオフィス</span>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12" md="12" lg="6">
          <div style="max-width: 600px; margin: 0 auto;" class="pr-3">
            <v-row>
              <div class="v-col-7">
                <span style="font-size: 2rem;">二酸化炭素濃度</span>
              </div>
              <div class="v-col-5">
                <div class="d-flex justify-end">
                  <span class="me-3" style="font-size: 1.3rem;">現在</span>
                  <span style="font-size: 3rem;">{{ co2 }}</span>
                  <span class="align-self-end ms-1" style="font-size: 1.3rem;">ppm</span>
                </div>
              </div>
            </v-row>
            
            <div>
              <span style="font-size: 1.7rem;">過去12時間の推移</span>
              <Co2Chart />
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="12" lg="6">
          <div style="max-width: 600px; margin: 0 auto;" class="pl-3">
            <v-row>
              <div class="v-col-7">
                <span style="font-size: 2rem;">気温と湿度</span>
              </div>
              <div class="v-col-5">
                <div class="d-flex justify-end">
                  <span class="me-3" style="font-size: 1.3rem;">現在</span>
                  <div class="me-2">
                    <span style="font-size: 3rem;">{{ temperature }}</span>
                    <span class="align-self-end" style="font-size: 1.3rem;">°C</span>
                  </div>
                  <div>
                    <span style="font-size: 3rem;">{{ humidity }}</span>
                    <span class="align-self-end" style="font-size: 1.3rem;">%</span>
                  </div>
                </div>
              </div>
            </v-row>
            
            <div>
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
    }
  },

  methods: {
    async getEnvValues() {
      try {
        const res = await axios.get('/api/v1/env_value')
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
      this.co2 = message.co2
      this.temperature = message.temperature
      this.humidity = message.humidity
    })
  }
})
</script>

<style scoped lang="scss">
span {
  color: #404040;
}
</style>
