<template>
  <div id="co2-canvas-container" ref="co2CanvasContainer">
    <canvas id="co2-chart"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
Chart.register(...registerables)

export default defineComponent({
  data() {
    return {
      chart: {} as Chart,
      datasets: [],
      datasetsMa: [],

      ctxWidth: 400
    }
  },

  methods: {
    getCo2List () {
      return axios.get('/api/v1/co2_trend')
    },

    getCo2MaList() {
      return axios.get('/api/v1/co2_ma')
    },

    updateCanvasWidth () {
      this.ctxWidth = (this.$refs.co2CanvasContainer as any).clientWidth
    },

    renderChart() {
      let ctx = document.getElementById("co2-chart") as HTMLCanvasElement
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
          {
            label: '10分間移動平均 [ppm]',
            data: this.datasetsMa,
            tension: 0.1,
            borderColor: 'lightseagreen',
            backgroundColor: 'lightseagreen'
          },
            {
            label: '二酸化炭素濃度 [ppm]',
            data: this.datasets,
            tension: 0.1,
            borderColor: 'paleturquoise',
            backgroundColor: 'paleturquoise'
          },
        ]
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
            y: {
              min: 0,
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

      this.chart = markRaw(chart) as any
    },

    async redrawChartWithData() {
      try {
        const res = await this.getCo2List()
        this.datasets = res.data
        this.chart.update() 
      } catch (error) {
        console.log(error)
      }
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

    try {
      const res = await this.getCo2MaList()
      this.datasetsMa = res.data
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
