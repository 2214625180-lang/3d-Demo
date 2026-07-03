<template>
  <div class="dorm-base-echart" :style="chartStyle">
    <div ref="chart" class="dorm-base-echart__canvas"></div>
    <div v-if="echartsUnavailable" class="dorm-base-echart__fallback">
      ECharts 未加载
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseEChart',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      },
    },
    height: {
      type: [String, Number],
      default: 120,
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chartInstance: null,
      echartsUnavailable: false,
      resizeObserver: null,
      resizeFrameId: 0,
    }
  },
  computed: {
    chartStyle() {
      return {
        height: typeof this.height === 'number' ? `${this.height}px` : this.height,
      }
    },
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.renderChart()
      },
    },
  },
  mounted() {
    this.initializeChart()
    this.bindResize()
  },
  beforeDestroy() {
    this.unbindResize()

    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
  },
  methods: {
    getECharts() {
      if (this.$echarts && this.$echarts.init) {
        return this.$echarts
      }

      if (this.$root && this.$root.$echarts && this.$root.$echarts.init) {
        return this.$root.$echarts
      }

      if (typeof window !== 'undefined' && window.echarts && window.echarts.init) {
        return window.echarts
      }

      return null
    },
    initializeChart() {
      const echarts = this.getECharts()

      if (!echarts || !this.$refs.chart) {
        this.echartsUnavailable = true
        return
      }

      this.echartsUnavailable = false
      this.chartInstance = echarts.init(this.$refs.chart)
      this.renderChart()
    },
    renderChart() {
      if (!this.chartInstance) {
        this.$nextTick(this.initializeChart)
        return
      }

      this.chartInstance.setOption(this.options || {}, true)
      this.resizeChart()
    },
    bindResize() {
      if (!this.autoResize || typeof window === 'undefined') {
        return
      }

      if (typeof ResizeObserver !== 'undefined' && this.$el) {
        this.resizeObserver = new ResizeObserver(this.resizeChart)
        this.resizeObserver.observe(this.$el)
        return
      }

      window.addEventListener('resize', this.resizeChart)
    },
    unbindResize() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }

      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.resizeChart)
      }

      if (this.resizeFrameId && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.resizeFrameId)
      }
    },
    resizeChart() {
      if (!this.chartInstance) {
        return
      }

      if (this.resizeFrameId && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.resizeFrameId)
      }

      if (typeof requestAnimationFrame === 'undefined') {
        this.chartInstance.resize()
        return
      }

      this.resizeFrameId = requestAnimationFrame(() => {
        if (this.chartInstance) {
          this.chartInstance.resize()
        }
      })
    },
  },
}
</script>

<style scoped>
.dorm-base-echart {
  position: relative;
  width: 100%;
  min-height: 56px;
}

.dorm-base-echart__canvas {
  width: 100%;
  height: 100%;
}

.dorm-base-echart__fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(211, 235, 255, 0.72);
  font-size: 12px;
  background: rgba(4, 18, 35, 0.58);
  border: 1px dashed rgba(100, 180, 232, 0.3);
}
</style>
