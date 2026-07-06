<template>
  <div class="occupancy-status-card screen-card" data-drag-component="OccupancyStatusCard">
    <div class="dorm-card-title dorm-card-title--occupancy">
      <span class="dorm-card-title__image" aria-hidden="true"></span>
      <span class="dorm-card-title__text">人员入住情况</span>
    </div>

    <div class="occupancy-card">
      <div class="occupancy-card__metrics">
        <div
          v-for="(row, rowIndex) in metricRows"
          :key="row.left.label"
          class="occupancy-card__metric-row"
          :class="{
            'occupancy-card__metric-row--primary': rowIndex === 0,
            'occupancy-card__metric-row--secondary': rowIndex === 1,
          }"
        >
          <span class="occupancy-card__metric-label occupancy-card__metric-label--left occupancy-text">
            {{ row.left.label }}
          </span>
          <strong class="occupancy-card__metric-value occupancy-card__metric-value--left occupancy-text">
            {{ formatMetricValue(row.left.value, row.left.type) }}
          </strong>
          <span class="occupancy-card__metric-label occupancy-card__metric-label--right occupancy-text">
            {{ row.right.label }}
          </span>
          <strong class="occupancy-card__metric-value occupancy-card__metric-value--right occupancy-text">
            {{ formatMetricValue(row.right.value, row.right.type) }}
          </strong>
        </div>
      </div>

      <div class="occupancy-card__tabs occupancy-tab dorm-chart-tabs dorm-chart-tabs--wrap">
        <button
          v-for="tab in departmentTabs"
          :key="tab.value"
          type="button"
          class="dorm-chart-tabs__button"
          :class="{ 'is-active': tab.value === activeDepartmentKey }"
          @click="handleDepartmentSelect(tab)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="occupancy-card__chart dorm-base-echart">
        <div ref="chartRef" class="dorm-base-echart__canvas"></div>
        <div v-if="echartsUnavailable" class="dorm-base-echart__fallback">
          ECharts 未加载
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OccupancyStatusCard',
  props: {
    data: {
      type: [Object, Array],
      default: () => ({}),
    },
  },
  data() {
    return {
      chart: null,
      localData: {},
      fallbackData: {
        emptyRate: 15.7,
        occupancyRate: 84.3,
        maleCount: 1256,
        femaleCount: 347,
        defaultDepartmentKey: 'weixin',
        departmentTabs: [
          { label: '盐城维信', value: 'weixin' },
          { label: '超维微电子', value: 'chaowei' },
          { label: '盐城索尔思', value: 'senersi' },
          { label: '盐城光重', value: 'guangdian' },
          { label: '管理公司', value: 'manage' },
          { label: '盐城东仓', value: 'dongchuang' },
        ],
        monthlyData: [
          { month: '1月', value: 125 },
          { month: '2月', value: 178 },
          { month: '3月', value: 146 },
          { month: '4月', value: 138 },
          { month: '5月', value: 201 },
          { month: '6月', value: 164 },
        ],
      },
      echartsUnavailable: false,
      activeDepartmentKey: '',
    }
  },
  computed: {
    viewData() {
      if (this.isValidData(this.localData)) {
        return this.localData
      }

      if (this.isValidData(this.data)) {
        return this.data
      }

      return this.fallbackData
    },
    metrics() {
      const sourceData = Array.isArray(this.viewData) ? this.fallbackData : this.viewData
      const legacyMetrics = sourceData.metrics || {}

      return {
        emptyRate: sourceData.emptyRate != null ? sourceData.emptyRate : legacyMetrics.vacancyRate,
        occupancyRate: sourceData.occupancyRate != null ? sourceData.occupancyRate : legacyMetrics.occupancyRate,
        maleCount: sourceData.maleCount != null ? sourceData.maleCount : legacyMetrics.maleCount,
        femaleCount: sourceData.femaleCount != null ? sourceData.femaleCount : legacyMetrics.femaleCount,
      }
    },
    metricRows() {
      return [
        {
          left: { label: '置空率', value: this.metrics.emptyRate, type: 'rate' },
          right: { label: '入住率', value: this.metrics.occupancyRate, type: 'rate' },
        },
        {
          left: { label: '男生人数', value: this.metrics.maleCount, type: 'number' },
          right: { label: '女生人数', value: this.metrics.femaleCount, type: 'number' },
        },
      ]
    },
    departmentTabs() {
      const sourceTabs = Array.isArray(this.viewData) ? [] : this.viewData.departmentTabs
      const tabs = this.toArray(sourceTabs).filter((tab) => tab && tab.value)

      return tabs.length ? tabs : this.fallbackData.departmentTabs
    },
    normalizedDepartments() {
      const sourceDepartments = Array.isArray(this.viewData) ? [] : this.viewData.departments

      return this.toArray(sourceDepartments).filter((department) => department && department.key)
    },
    activeDepartment() {
      return this.normalizedDepartments.find((department) => department.key === this.activeDepartmentKey) || null
    },
    monthlyData() {
      const sourceData = this.activeDepartment && this.activeDepartment.monthlyStats
        ? this.activeDepartment.monthlyStats
        : Array.isArray(this.viewData)
          ? this.fallbackData.monthlyData
          : this.viewData.monthlyData

      const normalizedData = this.toArray(sourceData)
        .filter((item) => item && item.month)
        .map((item) => ({
          month: String(item.month),
          value: this.toSafeNumber(item.value, 0),
        }))

      return normalizedData.length ? normalizedData : this.fallbackData.monthlyData
    },
  },
  mounted() {
    this.ensureActiveDepartment()

    this.$nextTick(() => {
      this.initChart()
    })

    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)

    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler() {
        this.ensureActiveDepartment()

        this.$nextTick(() => {
          this.renderChart()
        })
      },
    },

    localData: {
      deep: true,
      handler() {
        this.ensureActiveDepartment()

        this.$nextTick(() => {
          this.renderChart()
        })
      },
    },

    activeDepartmentKey() {
      this.$nextTick(() => {
        this.renderChart()
      })
    },
  },
  methods: {
    setdata(data) {
      this.localData = this.isValidData(data) ? data : {}
    },
    isValidData(value) {
      if (Array.isArray(value)) {
        return value.length > 0
      }

      return (
        value &&
        typeof value === 'object' &&
        Object.keys(value).length > 0
      )
    },
    toArray(value) {
      return Array.isArray(value) ? value : []
    },
    toSafeNumber(value, fallbackValue) {
      const numberValue = Number(value)
      return Number.isFinite(numberValue) ? numberValue : fallbackValue
    },
    createVerticalGradient(colorStops) {
      return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
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
    ensureActiveDepartment() {
      const preferredKey = this.activeDepartmentKey || this.viewData.defaultDepartmentKey
      const hasPreferredTab = this.departmentTabs.some((tab) => tab.value === preferredKey)

      this.activeDepartmentKey = hasPreferredTab ? preferredKey : this.departmentTabs[0].value
    },
    handleDepartmentSelect(tab) {
      if (!tab || tab.value === this.activeDepartmentKey) {
        return
      }

      this.activeDepartmentKey = tab.value
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

      const option = this.getChartOption()

      if (!option) {
        return
      }

      this.chart.setOption(option, true)
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    formatMetricValue(value, type) {
      if (value === null || value === undefined || value === '') {
        return type === 'rate' ? '0%' : '0'
      }

      if (type === 'rate') {
        return typeof value === 'number' ? `${value}%` : String(value)
      }

      return String(value)
    },
    getChartOption() {
      const stats = this.monthlyData
      const blueBarGradient = this.createVerticalGradient([
        { offset: 0, color: '#73dcff' },
        { offset: 0.22, color: '#4ec8ff' },
        { offset: 1, color: 'rgba(42, 128, 178, 0.28)' },
      ])
      const yellowBarGradient = this.createVerticalGradient([
        { offset: 0, color: '#ffe176' },
        { offset: 0.24, color: '#ffd054' },
        { offset: 1, color: 'rgba(176, 139, 52, 0.26)' },
      ])

      return {
        backgroundColor: 'transparent',
        graphic: [
          {
            type: 'text',
            left: 4,
            top: 6,
            silent: true,
            style: {
              text: '床\n位\n数',
              fill: 'rgba(255, 255, 255, 0.6)',
              fontSize: 8,
              fontWeight: 400,
              lineHeight: 10,
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Microsoft YaHei, sans-serif',
            },
          },
        ],
        grid: {
          top: 8,
          right: 4,
          bottom: 16,
          left: 34,
        },
        tooltip: Object.assign({
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        }, this.createTooltipConfig()),
        xAxis: {
          type: 'category',
          data: stats.map((item) => item.month),
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(88, 164, 216, 0.16)',
            },
          },
          axisLabel: {
            color: '#d9ecff',
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 220,
          interval: 50,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        series: [
          {
            name: '床位数',
            type: 'bar',
            barWidth: 8,
            barGap: '-100%',
            z: 2,
            data: stats.map((item, index) => ({
              value: this.toSafeNumber(item.value, 0),
              itemStyle: {
                color: index % 2 === 0 ? blueBarGradient : yellowBarGradient,
              },
            })),
            itemStyle: {
              borderRadius: 0,
              shadowBlur: 7,
              shadowColor: 'rgba(82, 202, 255, 0.32)',
            },
          },
          {
            name: '顶部高光',
            type: 'pictorialBar',
            symbol: 'rect',
            symbolSize: [8, 4],
            symbolOffset: [0, 2],
            symbolPosition: 'end',
            silent: true,
            tooltip: {
              show: false,
            },
            z: 3,
            data: stats.map((item, index) => ({
              value: this.toSafeNumber(item.value, 0),
              itemStyle: {
                color: index % 2 === 0 ? '#8ee8ff' : '#ffe585',
                shadowBlur: 0,
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
.occupancy-status-card,
.occupancy-status-card *,
.occupancy-status-card *::before,
.occupancy-status-card *::after {
  box-sizing: border-box;
}

.occupancy-status-card.screen-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 250px;
  padding: 12px 10px 11px;
  overflow: hidden;
  color: #d9f3ff;
  font-family: "Microsoft YaHei", Arial, sans-serif;
  background:
    linear-gradient(135deg, rgba(58, 136, 194, 0.16), rgba(5, 18, 38, 0.74) 42%, rgba(4, 24, 47, 0.86)),
    rgba(6, 24, 48, 0.72);
  border: 1px solid rgba(92, 183, 245, 0.38);
  border-radius: 4px;
  box-shadow:
    0 0 22px rgba(23, 145, 231, 0.28),
    inset 0 0 18px rgba(71, 178, 252, 0.16);
}

.occupancy-status-card.screen-card::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0;
  width: 347px;
  height: 51px;
  pointer-events: none;
  background-image: url("../../../assets/编组 12@2x.png");
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

.dorm-card-title--occupancy .dorm-card-title__image {
  width: 115px;
  height: 15px;
  background-image: url("../../../assets/人员入住情况@2x.png");
}

.occupancy-card {
  position: relative;
  z-index: 1;
  min-height: 184px;
}

.occupancy-card__metrics {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: -2px 0 8px;
}

.occupancy-card__metric-row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 64px 38px 1fr 64px;
  align-items: center;
  width: 100%;
  min-height: 38px;
  padding: 0 8px;
  background-image: url("../../../assets/编组5.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 294px 38px;
}

.occupancy-card__metric-row--primary,
.occupancy-card__metric-row--secondary {
  display: block;
  height: 38px;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-label,
.occupancy-card__metric-row--primary .occupancy-card__metric-value,
.occupancy-card__metric-row--secondary .occupancy-card__metric-label,
.occupancy-card__metric-row--secondary .occupancy-card__metric-value {
  position: absolute;
  min-width: 0;
  padding: 0;
  white-space: nowrap;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-label {
  width: 38px;
  height: 12px;
  color: #ffffff;
  font-family: "Source Han Sans CN", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  text-shadow: none;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-value {
  height: 20px;
  color: #e4eeff;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-align: right;
  text-shadow: none;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-label--left {
  left: 13px;
  top: 12px;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-value--left {
  left: 76px;
  top: 9px;
  width: 40px;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-label--right {
  left: 178px;
  top: 12px;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-value--right {
  left: 244px;
  top: 9px;
  width: 43px;
}

.occupancy-card__metric-row--secondary .occupancy-card__metric-label {
  width: 50px;
  height: 12px;
  color: #ffffff;
  font-family: "Source Han Sans CN", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  text-shadow: none;
}

.occupancy-card__metric-row--secondary .occupancy-card__metric-value {
  height: 20px;
  color: #e4eeff;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-align: right;
  text-shadow: none;
}

.occupancy-card__metric-row--secondary .occupancy-card__metric-label--left {
  left: 13px;
  top: 12px;
}

.occupancy-card__metric-row--secondary .occupancy-card__metric-value--left {
  left: 85px;
  top: 9px;
  width: 31px;
}

.occupancy-card__metric-row--secondary .occupancy-card__metric-label--right {
  left: 178px;
  top: 12px;
}

.occupancy-card__metric-row--secondary .occupancy-card__metric-value--right {
  left: 262px;
  top: 9px;
  width: 25px;
}

.occupancy-card__metric-label {
  min-width: 0;
  color: #f0f8ff;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  text-shadow: 0 0 6px rgba(111, 191, 255, 0.54);
}

.occupancy-card__metric-value {
  color: #f8fcff;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  text-align: right;
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(100, 183, 255, 0.62);
}

.occupancy-card__metric-label--right {
  padding-left: 2px;
}

.occupancy-card__metric-value--right {
  padding-right: 2px;
}

.dorm-chart-tabs {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 5px;
}

.occupancy-card__tabs.dorm-chart-tabs--wrap {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
  width: 100%;
  margin-bottom: 5px;
}

.occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button {
  position: relative;
  width: 100%;
  height: 20px;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  color: #c0d2f1;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  background: rgba(8, 30, 52, 0.45);
  border: 1px solid rgba(118, 187, 232, 0.36);
  border-radius: 0;
  outline: none;
  box-shadow: inset 0 0 8px rgba(66, 160, 220, 0.1);
  text-shadow: 0 0 6px rgba(78, 176, 238, 0.28);
}

.occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url("../../../assets/组合2396.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.36;
  filter: brightness(0.65) saturate(0.75);
}

.occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button.is-active {
  color: #fff4c2;
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
  text-shadow: 0 0 6px rgba(255, 224, 121, 0.32);
}

.occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button.is-active::before {
  opacity: 1;
  filter: none;
}

.occupancy-text,
.occupancy-tab .dorm-chart-tabs__button {
  font-family: "Microsoft YaHei", sans-serif;
}

.occupancy-card__chart {
  height: 58px;
}

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
