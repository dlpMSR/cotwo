<template>
  <div id="co2-canvas-container" ref="co2CanvasContainer">
    <canvas id="co2-chart"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
Chart.register(...registerables)

export default defineComponent({
  data() {
    return {
      chart: {} as Chart,
      datasets: [],

      ctxWidth: 400
    }
  },

  methods: {
    getCo2List () {
      return axios.get('/api/v1/co2_trend')
    },

    updateCanvasWidth () {
      this.ctxWidth = (this.$refs.co2CanvasContainer as any).clientWidth
    },

    renderChart() {
      let ctx = document.getElementById("co2-chart")
      new Chart(ctx, {
        type: 'line',
        data: {
          loaded: false,
          datasets: [{
            label: '二酸化炭素濃度 [ppm]',
            data: this.datasets,
            tension: 0.1,
            borderColor: 'lightseagreen',
            backgroundColor: 'turquoise'
          }]
        },
        options: {
          parsing: {
            xAxisKey: 'timestamp',
            yAxisKey: 'value'
          },
          scales: {
            x: {
              type: 'time',
              time: {
                displayFormats: {
                  minute: 'H:mm',
                  unit: 'minutes',
                  stepSize: 20
                },
              },
              ticks: {
                autoSkip: true,
                beginAtZero: true
              },
              grid: {
                display: false
              }
            },
            y: {
              min: 0,
            }
          },
          elements: {
            point: {
              radius: 0
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
      const res = await this.getCo2List()
      this.datasets = res.data
    } catch (error) {
      console.log(error)
    }

    this.renderChart()
    window.addEventListener('resize', this.updateCanvasWidth)
  }
})
</script>

<style scoped lang="scss">
#co2-canvas-container {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

canvas {
  width: v-bind("ctxWidth + 'px'") !important;
}
</style>
