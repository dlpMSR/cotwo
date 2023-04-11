<template>
  <main>
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="6">
          <div style="max-width: 600px; margin: 0 auto;">
            <v-row ref="displayCurrentCo2Value">
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
              <span style="font-size: 1.7rem;">過去6時間の推移</span>
              <Co2Chart />
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="6">
          <div style="max-width: 600px; margin: 0 auto;">
            <span>まだないよ┗(^o^ )┓</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import Co2Chart from '@/components/Co2Chart.vue'

export default defineComponent({
  components: {
    Co2Chart
  },

  data() {
    return {
      socket: {} as WebSocket,

      co2: 0,
      temperature: 0,
      humidity: 0,


    }
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
