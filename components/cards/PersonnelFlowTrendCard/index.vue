<template>
  <div class="personnel-flow-trend-card screen-card" data-drag-component="PersonnelFlowTrendCard">
    <div class="dorm-card-title dorm-card-title--flow">
      <span class="dorm-card-title__image" aria-hidden="true"></span>
      <span class="dorm-card-title__text">人员流动趋势</span>
    </div>

    <div class="personnel-flow-card">
      <div class="personnel-flow-card__summary">
        <div
          v-for="item in summary"
          :key="item.label"
          class="personnel-flow-card__summary-item"
          :class="{ 'is-positive': item.tone === 'success' }"
        >
          <strong class="personnel-flow-card__summary-value">
            {{ item.prefix || '' }}{{ item.value }}
          </strong>
          <span class="personnel-flow-card__summary-label">{{ item.label }}</span>
        </div>
      </div>

      <div class="personnel-flow-card__controls">
        <div class="personnel-flow-card__segmented personnel-flow-card__segmented--range">
          <button
            v-for="tab in rangeTabs"
            :key="tab.value"
            type="button"
            class="personnel-flow-card__segmented-button"
            :class="{ 'is-active': tab.value === activeRange }"
            @click="handleRangeSelect(tab)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="personnel-flow-card__segmented personnel-flow-card__segmented--scope">
          <button
            v-for="tab in scopeTabs"
            :key="tab.value"
            type="button"
            class="personnel-flow-card__segmented-button"
            :class="{ 'is-active': tab.value === activeScope }"
            @click="handleScopeSelect(tab)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="personnel-flow-card__chart dorm-base-echart">
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
  name: 'PersonnelFlowTrendCard',
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
        defaultRange: 'day',
        defaultScope: 'campus',
        summary: [
          { label: '今日入住', value: 18 },
          { label: '今日退宿', value: 9 },
          { label: '本月入住', value: 286 },
          { label: '本月退宿', value: 149 },
          { label: '净变化', value: 137, tone: 'success', prefix: '+' },
        ],
        rangeTabs: [
          { label: '日', value: 'day' },
          { label: '月', value: 'month' },
          { label: '年', value: 'year' },
        ],
        scopeTabs: [
          { label: '园区', value: 'campus' },
          { label: '宿舍', value: 'dormitory' },
        ],
        trendByRange: {
          day: [
            { label: '06.01', checkIn: 12, checkOut: 7, netChange: 5 },
            { label: '06.02', checkIn: 13, checkOut: 4, netChange: 9 },
            { label: '06.03', checkIn: 4, checkOut: 12, netChange: -8 },
            { label: '06.04', checkIn: 15, checkOut: 5, netChange: 10 },
            { label: '06.05', checkIn: 15, checkOut: 5, netChange: 10 },
            { label: '06.06', checkIn: 4, checkOut: 13, netChange: -9 },
            { label: '06.07', checkIn: 13, checkOut: 6, netChange: 7 },
            { label: '06.08', checkIn: 12, checkOut: 4, netChange: 8 },
          ],
        },
      },
      echartsUnavailable: false,
      activeRange: '',
      activeScope: '',
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
    summary() {
      const sourceData = Array.isArray(this.viewData) ? this.fallbackData : this.viewData
      const legacySummary = this.toArray(sourceData.summary)

      if (legacySummary.length) {
        return legacySummary
      }

      return [
        { label: '今日入住', value: this.toSafeNumber(sourceData.todayIn, 0) },
        { label: '今日退宿', value: this.toSafeNumber(sourceData.todayOut, 0) },
        { label: '本月入住', value: this.toSafeNumber(sourceData.monthIn, 0) },
        { label: '本月退宿', value: this.toSafeNumber(sourceData.monthOut, 0) },
        {
          label: '净变化',
          value: Math.abs(this.toSafeNumber(sourceData.netChange, 0)),
          tone: this.toSafeNumber(sourceData.netChange, 0) >= 0 ? 'success' : 'danger',
          prefix: this.toSafeNumber(sourceData.netChange, 0) >= 0 ? '+' : '-',
        },
      ]
    },
    rangeTabs() {
      const sourceTabs = Array.isArray(this.viewData) ? [] : this.viewData.rangeTabs
      const tabs = this.toArray(sourceTabs).filter((tab) => tab && tab.value)

      return tabs.length ? tabs : this.fallbackData.rangeTabs
    },
    scopeTabs() {
      const sourceTabs = Array.isArray(this.viewData) ? [] : this.viewData.scopeTabs
      const tabs = this.toArray(sourceTabs).filter((tab) => tab && tab.value)

      return tabs.length ? tabs : this.fallbackData.scopeTabs
    },
    activeTrendItems() {
      const sourceData = Array.isArray(this.viewData) ? this.fallbackData : this.viewData
      const trendByRange = sourceData.trendByRange || {}
      const legacyTrendItems = this.toArray(trendByRange[this.activeRange])

      if (legacyTrendItems.length) {
        return legacyTrendItems.map((item) => ({
          label: item.label,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          netChange: item.netChange,
        }))
      }

      return this.toArray(sourceData.trend).map((item) => ({
        label: item.date || item.label,
        checkIn: item.inCount != null ? item.inCount : item.checkIn,
        checkOut: item.outCount != null ? item.outCount : item.checkOut,
        netChange: item.netChange,
      }))
    },
    chartItems() {
      const normalizedItems = this.activeTrendItems
        .filter((item) => item && item.label)
        .map((item) => ({
          label: String(item.label),
          checkIn: this.toSafeNumber(item.checkIn, 0),
          checkOut: this.toSafeNumber(item.checkOut, 0),
          netChange: this.toSafeNumber(item.netChange, 0),
        }))

      if (normalizedItems.length) {
        return normalizedItems
      }

      return this.fallbackData.trendByRange.day.map((item) => ({
        label: item.label,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        netChange: item.netChange,
      }))
    },
  },
  mounted() {
    this.ensureActiveTabs()

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
        this.ensureActiveTabs()

        this.$nextTick(() => {
          this.renderChart()
        })
      },
    },

    localData: {
      deep: true,
      handler() {
        this.ensureActiveTabs()

        this.$nextTick(() => {
          this.renderChart()
        })
      },
    },

    activeRange() {
      this.$nextTick(() => {
        this.renderChart()
      })
    },

    activeScope() {
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
    formatNumber(value) {
      return this.toSafeNumber(value, 0).toLocaleString('en-US')
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
    getTabValue(tabs, preferredValue) {
      const normalizedTabs = this.toArray(tabs)
      const hasPreferredValue = normalizedTabs.some((tab) => tab && tab.value === preferredValue)

      if (hasPreferredValue) {
        return preferredValue
      }

      return normalizedTabs[0] && normalizedTabs[0].value ? normalizedTabs[0].value : ''
    },
    ensureActiveTabs() {
      const sourceData = Array.isArray(this.viewData) ? this.fallbackData : this.viewData

      this.activeRange = this.getTabValue(this.rangeTabs, this.activeRange || sourceData.defaultRange)
      this.activeScope = this.getTabValue(this.scopeTabs, this.activeScope || sourceData.defaultScope)
    },
    handleRangeSelect(tab) {
      if (!tab || tab.value === this.activeRange) {
        return
      }

      this.activeRange = tab.value
    },
    handleScopeSelect(tab) {
      if (!tab || tab.value === this.activeScope) {
        return
      }

      this.activeScope = tab.value
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
    getChartOption() {
      const items = this.chartItems
      const checkInValues = items.map((item) => this.toSafeNumber(item.checkIn, 0))
      const checkOutValues = items.map((item) => this.toSafeNumber(item.checkOut, 0))
      const netChangeValues = items.map((item) => this.toSafeNumber(item.netChange, 0))
      const maxDataValue = Math.max(0, ...checkInValues, ...checkOutValues, ...netChangeValues)
      const minDataValue = Math.min(0, ...netChangeValues)
      const isDailyScale = maxDataValue <= 20 && minDataValue >= -10
      const yAxisMin = isDailyScale ? -10 : Math.floor(minDataValue / 10) * 10
      const yAxisMax = isDailyScale ? 20 : Math.ceil(maxDataValue / 10) * 10
      const yAxisInterval = isDailyScale ? 5 : Math.max(10, Math.ceil((yAxisMax - yAxisMin) / 4 / 10) * 10)
      const checkInGradient = this.createVerticalGradient([
        { offset: 0, color: '#8EDCFF' },
        { offset: 0.28, color: '#62B9F0' },
        { offset: 1, color: 'rgba(40, 118, 180, 0.25)' },
      ])
      const checkOutGradient = this.createVerticalGradient([
        { offset: 0, color: '#FFE37A' },
        { offset: 0.3, color: '#EEC750' },
        { offset: 1, color: 'rgba(190, 145, 35, 0.25)' },
      ])
      const axisLabelColor = 'rgba(213, 236, 255, 0.78)'
      const positivePointStyle = {
        color: '#dff8ff',
        borderColor: '#3fbfff',
        borderWidth: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(56, 191, 255, 0.68)',
      }
      const negativePointStyle = {
        color: '#071a2d',
        borderColor: '#ff4e62',
        borderWidth: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(255, 72, 88, 0.62)',
      }
      const normalizeTooltipRows = (params) => this.toArray(params)
      const formatTooltipValue = (value) => this.formatNumber(this.toSafeNumber(value, 0))

      return {
        backgroundColor: 'transparent',
        animationDuration: 450,
        animationEasing: 'cubicOut',
        grid: {
          top: 30,
          right: 8,
          bottom: 20,
          left: 28,
          containLabel: false,
        },
        legend: {
          top: 1,
          right: 2,
          itemWidth: 10,
          itemHeight: 6,
          itemGap: 8,
          icon: 'roundRect',
          textStyle: {
            color: 'rgba(224, 243, 255, 0.92)',
            fontSize: 10,
            fontWeight: 600,
          },
          data: ['入住人数', '退宿人数', '净变化折线'],
        },
        tooltip: {
          trigger: 'axis',
          appendToBody: true,
          confine: true,
          backgroundColor: 'rgba(9, 31, 57, 0.96)',
          borderColor: 'rgba(111, 198, 255, 0.72)',
          borderWidth: 1,
          padding: [7, 10],
          extraCssText: 'box-shadow: 0 0 14px rgba(46, 164, 255, 0.34); border-radius: 2px;',
          textStyle: {
            color: '#e9f8ff',
            fontSize: 11,
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: 'rgba(120, 203, 255, 0.52)',
              width: 1,
              type: 'dashed',
            },
          },
          formatter(params) {
            const visibleSeriesNames = ['入住人数', '退宿人数', '净变化折线']
            const rows = normalizeTooltipRows(params).filter((row) => visibleSeriesNames.includes(row.seriesName))
            const title = rows[0] && rows[0].axisValue ? rows[0].axisValue : ''
            const body = rows.map((row) => {
              const value = row && row.value && typeof row.value === 'object' ? row.value.value : row.value
              return `<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;line-height:18px;">
                <span>${row.marker}${row.seriesName}</span>
                <strong style="font-weight:700;color:#ffffff;">${formatTooltipValue(value)}</strong>
              </div>`
            }).join('')

            return `<div style="min-width:118px;">
              <div style="margin-bottom:4px;color:#8fe6ff;font-weight:700;">${title}</div>
              ${body}
            </div>`
          },
        },
        xAxis: {
          type: 'category',
          data: items.map((item) => item.label),
          boundaryGap: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(102, 174, 225, 0.42)',
              width: 1,
            },
          },
          axisLabel: {
            color: axisLabelColor,
            fontSize: 10,
            interval: 0,
            margin: 7,
          },
        },
        yAxis: {
          type: 'value',
          min: yAxisMin,
          max: yAxisMax,
          interval: yAxisInterval,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(72, 147, 211, 0.18)',
              width: 1,
            },
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: [
                'rgba(18, 48, 82, 0.2)',
                'rgba(7, 25, 49, 0.08)',
              ],
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: axisLabelColor,
            fontSize: 10,
            margin: 4,
            formatter(value) {
              if (isDailyScale && (value === 5 || value === 15)) {
                return ''
              }

              return value
            },
          },
        },
        series: [
          {
            name: '入住人数',
            type: 'bar',
            barWidth: 8,
            barGap: '20%',
            barCategoryGap: '55%',
            z: 2,
            itemStyle: {
              color: checkInGradient,
              borderRadius: [4, 4, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: checkInGradient,
              },
            },
            data: checkInValues,
          },
          {
            name: '退宿人数',
            type: 'bar',
            barWidth: 8,
            barGap: '20%',
            barCategoryGap: '55%',
            z: 2,
            itemStyle: {
              color: checkOutGradient,
              borderRadius: [4, 4, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: checkOutGradient,
              },
            },
            data: checkOutValues,
          },
          {
            name: '净变化折线',
            type: 'line',
            smooth: true,
            smoothMonotone: 'x',
            symbol: 'circle',
            symbolSize: 8,
            showSymbol: true,
            z: 6,
            lineStyle: {
              color: '#f6fbff',
              width: 2,
              shadowBlur: 8,
              shadowColor: 'rgba(255, 255, 255, 0.72)',
            },
            itemStyle: {
              color: '#dff8ff',
              borderColor: '#3fbfff',
              borderWidth: 3,
            },
            emphasis: {
              scale: 1.18,
              itemStyle: {
                shadowBlur: 14,
              },
            },
            data: netChangeValues.map((value) => ({
              value,
              itemStyle: value < 0 ? negativePointStyle : positivePointStyle,
            })),
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
.personnel-flow-trend-card,
.personnel-flow-trend-card *,
.personnel-flow-trend-card *::before,
.personnel-flow-trend-card *::after {
  box-sizing: border-box;
}

.personnel-flow-trend-card.screen-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 274px;
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

.personnel-flow-trend-card.screen-card::before {
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

.dorm-card-title--flow .dorm-card-title__image {
  width: 118px;
  height: 21px;
  background-image: url("../../../assets/人员流动趋势@2x.png");
}

.personnel-flow-card {
  position: relative;
  z-index: 1;
  min-height: 196px;
}

.personnel-flow-card__summary {
  display: grid;
  grid-template-columns: repeat(5, 61px);
  gap: 0;
  justify-content: space-between;
  margin: -2px 0 8px;
}

.personnel-flow-card__summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 61px;
  height: 52px;
  padding-top: 2px;
  background-image: url("../../../assets/编组.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 61px 52px;
}

.personnel-flow-card__summary-value {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42.14px;
  height: 19.32px;
  color: #f8fcff;
  font-size: 16px;
  font-weight: 700;
  line-height: 19.32px;
  text-align: center;
  text-shadow: 0 0 8px rgba(122, 194, 255, 0.72);
}

.personnel-flow-card__summary-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40.46px;
  height: 13.44px;
  margin-top: 5px;
  color: #e6f5ff;
  font-size: 11px;
  font-weight: 600;
  line-height: 13.44px;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 0 6px rgba(106, 183, 246, 0.58);
}

.personnel-flow-card__summary-item.is-positive .personnel-flow-card__summary-value {
  color: #48f5d4;
  text-shadow: 0 0 9px rgba(72, 245, 212, 0.55);
}

.personnel-flow-card__controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  margin-bottom: 2px;
}

.personnel-flow-card__segmented {
  display: grid;
  height: 20px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
}

.personnel-flow-card__segmented--range {
  width: 90px;
  grid-template-columns: repeat(3, 30px);
  background-image: url("../../../assets/组合 2468.png");
  background-size: 90px 20px;
}

.personnel-flow-card__segmented--scope {
  width: 90px;
  grid-template-columns: repeat(2, 45px);
  background-image: url("../../../assets/组合 2469.png");
  background-size: 90px 20px;
}

.personnel-flow-card__segmented-button {
  position: relative;
  z-index: 1;
  min-width: 0;
  height: 20px;
  padding: 0;
  color: #dcefff;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
  background: transparent;
  border: 0;
  outline: none;
  text-shadow: 0 0 6px rgba(100, 183, 246, 0.5);
}

.personnel-flow-card__segmented-button.is-active {
  color: #fff8d7;
  background-repeat: no-repeat;
  background-position: center;
}

.personnel-flow-card__segmented--range .personnel-flow-card__segmented-button.is-active {
  background-image: url("../../../assets/矩形 1434(1).png");
  background-size: 30px 20px;
}

.personnel-flow-card__segmented--scope .personnel-flow-card__segmented-button.is-active {
  background-image: url("../../../assets/矩形 1434.png");
  background-size: 45px 20px;
}

.personnel-flow-card__chart {
  height: 92px;
  margin-top: 0;
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
