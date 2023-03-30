<template>
  <div class="clock">
    <div class="d-flex flex-row align-center date">
      <div>
        <span class="number">
          {{ year }}/{{ month }}/{{ date }}
        </span>
      </div>

      <div class="weekday">
        <span>
          ({{ weekday }})
        </span>
      </div>
    </div>

    <div class="d-flex flex-row align-end">
      <div>
        <span class="time number">
          {{ hour }}
        </span>
      </div>
      
      <div>
        <span class="time colon">:</span>
      </div>

      <div>
        <span class="time number">
          {{ minute }}
        </span>
      </div>
        
      <div>
        <span class="number second">
          {{ second }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  data() {
    return {
      currentTime: new Date(),

      fontSize: {
        date: 0,
        weekday: 0,
        time: 0,
        second: 0
      },

      margin: {
        dateLeft: 0,
        weekDayLeft: 0,
        secondLeft: 0,
        secondBottom: 0,
      },
    }
  },

  computed: {
    year() {
      return this.currentTime.getFullYear()
    },
    month() {
      return this.zeroPad(this.currentTime.getMonth() + 1)
    },
    date() {
      return this.zeroPad(this.currentTime.getDate())
    },
    weekday() {
      const shortWeekDays: { [key: number]: string } = {
        0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
      }
      return shortWeekDays[this.currentTime.getDay()]
    },
    hour() {
      return this.zeroPad(this.currentTime.getHours())
    },
    minute() {
      return this.zeroPad(this.currentTime.getMinutes())
    },
    second() {
      return this.zeroPad(this.currentTime.getSeconds())
    },
  },

  methods: {
    synchronizeClock() {
      axios.head('/api/v1/env_value')
        .then(res => {
          this.currentTime = new Date(res.headers.date)
        })
    },

    tick() {
      let dt = this.currentTime
      this.currentTime = new Date(dt.getTime() + 1000)
    },

    updateFontSize() {
      const iw:number = window.innerWidth

      this.fontSize.date = iw * 0.06
      this.fontSize.weekday = iw * 0.055
      this.fontSize.time = iw * 0.2
      this.fontSize.second = iw * 0.125

      this.margin.dateLeft = iw * 0.02
      this.margin.weekDayLeft = iw * 0.01
      this.margin.secondLeft = iw * 0.02
      this.margin.secondBottom = iw * 0.01
    },

    zeroPad(num: number) {
      return num < 10 ? "0" + num : String(num)
    }
  },

  beforeMount() {
    this.synchronizeClock()
    this.updateFontSize()
  },

  mounted() {
    setInterval(this.tick, 1000)
    setInterval(this.synchronizeClock, 60 * 1000)
    window.addEventListener('resize', this.updateFontSize)
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/sass/mixin.scss';

.clock {
  span {
    display: inline-block;
    line-height: 1;
  }

  .date {
    line-height: 1;
    font-size: v-bind("fontSize.date + 'px'");
    margin-left: v-bind("margin.dateLeft + 'px'");
  }

  .number {
    @include LatoBold;
  }
  .weekday {
    @include LatoBold;
    font-size: v-bind("fontSize.weekday + 'px'");
    margin-left: v-bind("margin.weekDayLeft + 'px'");
  }

  .time {
    font-size: v-bind("fontSize.time + 'px'");
  }

  .colon {
    line-height: 1;
    animation: flash 1.8s linear infinite;

    @keyframes flash {
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }
    }
  }

  .second {
    line-height: 1;
    font-size: v-bind("fontSize.second + 'px'");
    margin-left: v-bind("margin.secondLeft + 'px'");
    margin-bottom: v-bind("margin.secondBottom + 'px'");
  }
}
</style>
