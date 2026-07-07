<template>
  <div
    class="department-dorm-bar-chart screen-card"
    :style="cardStyle"
    data-drag-component="DepartmentDormBarChart"
  >
    <div class="dorm-card-title dorm-card-title--department">
      <span class="dorm-card-title__image" aria-hidden="true"></span>
      <span class="dorm-card-title__text">事业部在宿人数</span>
    </div>

    <div class="department-bar-card">
      <div class="department-bar-card__tabs dorm-chart-tabs dorm-chart-tabs--small">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="dorm-chart-tabs__button"
          :class="{ 'is-active': tab.value === activeView }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="department-bar-card__chart dorm-base-echart">
        <div ref="chartRef" class="dorm-base-echart__canvas"></div>
        <div v-if="echartsUnavailable" class="dorm-base-echart__fallback">
          ECharts 未加载
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SOURCEHANSANSCNREGULAR from 'fonts/SOURCEHANSANSCN-REGULAR.otf&&SourceHanSansCN-Regular';
import Ica62726aa6224a06ae374e60add716dc from 'img/fa480ed204844c9b92771be2feff6e43.png'
import I9ae5937b3192469793e18e2f394b7a36 from 'img/d22281f561c2499d9d4e706e714c454e.png'
import Idb1b215b19e645179250f52eed9bff50 from 'img/49a49a4c4c184393ab02f949a5b09fee.png'
export default {
  name: 'DepartmentDormBarChart',
  props: {
    data: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
      localData: [],
      fallbackData: [
        { name: '盐城维信', value: 1246 },
        { name: '超维微电子', value: 1083 },
        { name: '盐城森尔思', value: 874 },
        { name: '盐城光电', value: 779 },
        { name: '盐城东创', value: 668 },
      ],
      fallbackTabs: [
        { label: '横条图', value: 'bar' },
        { label: '楼栋表格', value: 'table' },
      ],
      assets: {
        headerFrameBg: I9ae5937b3192469793e18e2f394b7a36,
        titleBg: Idb1b215b19e645179250f52eed9bff50,
        tabButtonBg: Ica62726aa6224a06ae374e60add716dc,
      },
      resizeObserver: null,
      echartsUnavailable: false,
      activeView: 'bar',
    }
  },
  computed: {
    cardStyle() {
      return {
        '--department-card-frame-bg': `url(${this.assets.headerFrameBg})`,
        '--department-card-title-bg': `url(${this.assets.titleBg})`,
        '--department-card-tab-bg': `url(${this.assets.tabButtonBg})`,
      }
    },
    viewData() {
      if (Array.isArray(this.localData) && this.localData.length) {
        return this.localData
      }

      if (
        this.localData &&
        !Array.isArray(this.localData) &&
        Object.keys(this.localData).length
      ) {
        return this.localData
      }

      if (Array.isArray(this.data) && this.data.length) {
        return this.data
      }

      if (this.data && !Array.isArray(this.data) && Object.keys(this.data).length) {
        return this.data
      }

      return this.fallbackData
    },
    chartItems() {
      const sourceItems = Array.isArray(this.viewData) ? this.viewData : this.viewData.items

      return this.toArray(sourceItems)
        .filter((item) => item && item.name)
        .map((item) => ({
          name: String(item.name),
          value: this.toSafeNumber(item.value, 0),
        }))
    },
    tabs() {
      const sourceTabs = Array.isArray(this.viewData) ? this.fallbackTabs : this.viewData.tabs
      const normalizedTabs = this.toArray(sourceTabs).filter((tab) => tab && tab.value)

      return normalizedTabs.length ? normalizedTabs : this.fallbackTabs
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.initResizeObserver()
    })

    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    this.destroyResizeObserver()

    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.renderChart()
      },
    },
    localData: {
      deep: true,
      handler() {
        this.renderChart()
      },
    },
    chartItems: {
      deep: true,
      handler() {
        this.renderChart()
      },
    },
  },
  methods: {
    setdata(data) {
      this.localData = data && (Array.isArray(data) || typeof data === 'object')
        ? data
        : []
    },
    toArray(value) {
      return Array.isArray(value) ? value : []
    },
    toSafeNumber(value, fallbackValue) {
      const numberValue = Number(value)
      return Number.isFinite(numberValue) ? numberValue : fallbackValue
    },
    formatNumber(value) {
      return this.toSafeNumber(value, 0).toLocaleString('en-US')
    },
    createHorizontalGradient(colorStops) {
      return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops,
      }
    },
    createTooltipConfig() {
      return {
        backgroundColor: 'rgba(5, 22, 42, 0.92)',
        borderColor: 'rgba(95, 190, 255, 0.55)',
        textStyle: {
          color: '#d9f5ff',
        },
      }
    },
    getECharts() {
      if (typeof window !== 'undefined' && window.echarts && window.echarts.init) {
        return window.echarts
      }

      console.error('ECharts 未加载，请确认平台是否已注入 echarts')
      return null
    },
    initChart() {
      if (!this.$refs.chartRef) {
        return
      }

      const echarts = this.getECharts()

      if (!echarts) {
        this.echartsUnavailable = true
        return
      }

      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }

      this.echartsUnavailable = false
      this.chart = echarts.init(this.$refs.chartRef)
      this.renderChart()
    },
    renderChart() {
      if (!this.chart) {
        return
      }

      this.chart.setOption(this.getChartOption(), true)
      this.resizeChart()
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    initResizeObserver() {
      if (typeof ResizeObserver === 'undefined' || !this.$el) {
        return
      }

      this.resizeObserver = new ResizeObserver(() => {
        this.resizeChart()
      })

      this.resizeObserver.observe(this.$el)
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }
    },
    getChartOption() {
      const rankingItems = this.chartItems.length ? this.chartItems : this.fallbackData
      const maxValue = rankingItems.reduce((max, item) => {
        return Math.max(max, this.toSafeNumber(item.value, 0))
      }, 0)
      const backgroundValue = Math.max(10, Math.ceil(maxValue * 1.08))
      const topProgressGradient = this.createHorizontalGradient([
        { offset: 0, color: 'rgba(56, 176, 232, 0.46)' },
        { offset: 0.52, color: '#55cfff' },
        { offset: 1, color: '#b6f4ff' },
      ])
      const normalProgressGradient = this.createHorizontalGradient([
        { offset: 0, color: 'rgba(45, 149, 210, 0.46)' },
        { offset: 0.58, color: '#3fb5ec' },
        { offset: 1, color: '#86e0ff' },
      ])
      const vm = this

      return {
        backgroundColor: 'transparent',
        grid: {
          top: 5,
          right: 58,
          bottom: 8,
          left: 82,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          ...this.createTooltipConfig(),
        },
        xAxis: {
          type: 'value',
          max: Math.ceil(backgroundValue * 1.08),
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(92, 170, 224, 0.16)',
            },
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: rankingItems.map((item) => item.name),
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#dff2ff',
            fontSize: 12,
            fontWeight: 600,
            margin: 12,
          },
        },
        series: [
          {
            name: '背景条',
            type: 'bar',
            barWidth: 9,
            barGap: '-100%',
            silent: true,
            tooltip: {
              show: false,
            },
            itemStyle: {
              color: 'rgba(12, 43, 70, 0.72)',
              borderColor: 'rgba(102, 184, 237, 0.28)',
              borderWidth: 1,
              borderRadius: 2,
            },
            emphasis: {
              disabled: true,
            },
            z: 1,
            data: rankingItems.map(() => backgroundValue),
          },
          {
            name: '在宿人数',
            type: 'bar',
            barWidth: 9,
            barGap: '-100%',
            label: {
              show: true,
              position: 'right',
              color: '#f2fbff',
              fontSize: 12,
              fontWeight: 600,
              distance: 8,
              formatter(params) {
                return vm.formatNumber(params.value)
              },
            },
            itemStyle: {
              borderRadius: 2,
              color: topProgressGradient,
              shadowBlur: 10,
              shadowColor: 'rgba(94, 218, 255, 0.3)',
            },
            z: 2,
            data: rankingItems.map((item, index) => ({
              value: this.toSafeNumber(item.value, 0),
              itemStyle: {
                color: index < 3 ? topProgressGradient : normalProgressGradient,
              },
            })),
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
.department-dorm-bar-chart,
.department-dorm-bar-chart *,
.department-dorm-bar-chart *::before,
.department-dorm-bar-chart *::after {
  box-sizing: border-box;
}

.department-dorm-bar-chart.screen-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 216px;
  padding: 12px 10px 11px;
  overflow: hidden;
  color: #d9f3ff;
  font-family:
    "SourceHanSansCN-Regular",
    "Microsoft YaHei",
    Arial,
    sans-serif;
  background:
    linear-gradient(
      135deg,
      rgba(58, 136, 194, 0.16),
      rgba(5, 18, 38, 0.74) 42%,
      rgba(4, 24, 47, 0.86)
    ),
    rgba(6, 24, 48, 0.72);
  border: 1px solid rgba(92, 183, 245, 0.38);
  border-radius: 4px;
  box-shadow:
    0 0 22px rgba(23, 145, 231, 0.28),
    inset 0 0 18px rgba(71, 178, 252, 0.16);
}

.department-dorm-bar-chart.screen-card::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0;
  width: 347px;
  height: 51px;
  pointer-events: none;
  background-image: var(--department-card-frame-bg);
  background-repeat: no-repeat;
  background-size: 347px 51px;
  border: 0;
  opacity: 1;
}

.dorm-card-title {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: 24px;
  margin-bottom: 9px;
}

.dorm-card-title__image {
  flex: 0 0 auto;
  display: block;
  margin-left: 24px;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: contain;
  filter: drop-shadow(0 0 7px rgba(102, 195, 255, 0.6));
}

.dorm-card-title__text {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.dorm-card-title--department .dorm-card-title__image {
  width: 137px;
  height: 21px;
  background-image: var(--department-card-title-bg);
}

.department-bar-card {
  position: relative;
  z-index: 1;
  min-height: 158px;
}

.dorm-chart-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 4px;
}

.department-bar-card__tabs {
  gap: 4px;
  margin: 2px 0 8px;
}

.dorm-chart-tabs__button {
  height: 22px;
  min-width: 58px;
  padding: 0 8px;
  color: #d6efff;
  font-family: inherit;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  background: rgba(28, 63, 104, 0.72);
  border: 1px solid rgba(121, 187, 226, 0.45);
  border-radius: 2px;
  outline: none;
  box-shadow: inset 0 0 10px rgba(84, 166, 225, 0.08);
}

.dorm-chart-tabs__button.is-active {
  color: #fff7ce;
  background: linear-gradient(180deg, rgba(96, 110, 84, 0.72), rgba(42, 77, 103, 0.88));
  border-color: rgba(255, 212, 106, 0.62);
  box-shadow:
    inset 0 0 12px rgba(255, 210, 95, 0.16),
    0 0 10px rgba(74, 178, 255, 0.22);
}

.dorm-chart-tabs--small .dorm-chart-tabs__button {
  height: 20px;
  min-width: 54px;
  padding: 0 7px;
  font-size: 11px;
  line-height: 18px;
}

.department-bar-card__tabs .dorm-chart-tabs__button {
  position: relative;
  width: 74px;
  min-width: 74px;
  height: 20px;
  padding: 0;
  overflow: hidden;
  color: rgba(223, 241, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  background: rgba(8, 30, 52, 0.45);
  border: 1px solid rgba(118, 187, 232, 0.36);
  border-radius: 0;
  box-shadow: inset 0 0 8px rgba(66, 160, 220, 0.1);
  text-shadow: 0 0 6px rgba(78, 176, 238, 0.28);
}

.department-bar-card__tabs .dorm-chart-tabs__button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--department-card-tab-bg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.32;
  filter: saturate(0.45) brightness(0.58);
}

.department-bar-card__tabs .dorm-chart-tabs__button.is-active {
  color: #fff7cd;
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
  text-shadow: 0 0 6px rgba(255, 224, 121, 0.32);
}

.department-bar-card__tabs .dorm-chart-tabs__button.is-active::before {
  opacity: 1;
  filter: none;
}

.department-bar-card__chart {
  height: 122px;
}

.dorm-base-echart {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 56px;
}

.department-bar-card__chart.dorm-base-echart {
  height: 122px;
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
