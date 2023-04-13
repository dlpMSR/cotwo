<template>
  <div id="temp-canvas-container" ref="tempCanvasContainer">
    <canvas id="temp-chart"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
Chart.register(...registerables)

export default defineComponent({
  data() {
    return {
      chart: {} as Chart,
      datasetsTemperature: [],
      datasetsHumidity: [],

      ctxWidth: 400
    }
  },

  methods: {
    getTempList() {
      return axios.get('/api/v1/temperature_trend')
    },
    getHumidList() {
      return axios.get('/api/v1/humidity_trend')
    },

    updateCanvasWidth () {
      this.ctxWidth = (this.$refs.tempCanvasContainer as any).clientWidth
    },

    renderChart() {
      let ctx = document.getElementById("temp-chart") as HTMLCanvasElement
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: '気温 [°C]',
            data: this.datasetsTemperature,
            tension: 0.1,
            borderColor: 'darkorange',
            backgroundColor: 'turquoise',
            yAxisID: 'temperature'
          }, {
            label: '湿度 [％]',
            data: this.datasetsHumidity,
            tension: 0.1,
            borderColor: 'royalblue',
            backgroundColor: 'turquoise',
            yAxisID: 'humidity'
          }]
        },
        options: {
          parsing: {
            xAxisKey: 'timestamp',
            yAxisKey: 'value'
          },
          scales: {
            x: {
              type: 'timeseries',
              time: {
                displayFormats: {
                  minute: 'H:mm',
                  unit: 'minutes',
                },
              },
              ticks: {
                autoSkip: true,
              },
              grid: {
                display: false
              }
            },
            'temperature': {
              type: 'linear',
              position: 'left',
              suggestedMin: -5,
              ticks: {
                stepSize: 5,
                callback: function(t) {
                  return t.toString() + '°C'
                }
              },
            },
            'humidity': {
              position: 'right',
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20,
                callback: function(t) {
                  return t.toString() + '%'
                }
              },
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                boxHeight: 0,
              }
            }
          },
          maintainAspectRatio: false,
        }
      })

    }
  },

  async mounted() {
    this.updateCanvasWidth()
    
    try {
      const res = await this.getTempList()
      this.datasetsTemperature = res.data
    } catch (error) {
      console.log(error)
    }

    try {
      const res = await this.getHumidList()
      this.datasetsHumidity = res.data
    } catch (error) {
      console.log(error)
    }

    this.renderChart()
    window.addEventListener('resize', this.updateCanvasWidth)
  },

  unmounted() {
    window.removeEventListener('resize', this.updateCanvasWidth);
  }
})

</script>

<style scoped lang="scss">
#temp-canvas-container {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

canvas {
  width: v-bind("ctxWidth + 'px'") !important;
}
</style>
