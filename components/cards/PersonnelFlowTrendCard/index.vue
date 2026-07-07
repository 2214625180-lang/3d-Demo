<template>
  <div
    class="personnel-flow-trend-card screen-card"
    :style="cardStyle"
    data-drag-component="PersonnelFlowTrendCard"
  >
    <div class="dorm-card-title dorm-card-title--flow">
      <span class="dorm-card-title__image" aria-hidden="true"></span>
      <span class="dorm-card-title__text">人员流动趋势</span>
    </div>

    <div class="personnel-flow-card">
      <div class="personnel-flow-card__summary">
        <div
          v-for="item in kpiItems"
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
            @click="handleRangeChange(tab.value)"
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
            @click="handleScopeChange(tab.value)"
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
import I9ae5937b3192469793e18e2f394b7a36 from 'img/d22281f561c2499d9d4e706e714c454e.png';
import Ifa0dc035f44c4e618854d8afb4b6bba6 from 'img/1503977cc7184730b220a5b3a0117dd3.png';
import Iabda47a7f6544212906aa69363c38bd5 from 'img/2a39df1cf5614030a87fdf1356778e35.png';
import Icc905d7747c44129b7e0e7a7c4fd4a08 from 'img/bb61934b1f374770b8f6a0864f186e96.png';
import Id151eae331644e37b300ea7d4734a698 from 'img/f4efacb12cb34445b8c8f8e30e1a167b.png';
import I752fb2af7fcb402e802fd8f166aa3783 from 'img/9b1e1e6cbe90473eac06fb1bfbbfef6e.png';
import Ic6da7e1dca0a4087ab7fcadceb97c257 from 'img/9f51c4f1d24b44f29943af3d8fd7121f.png';
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
        activeRange: 'day',
        activeScope: 'park',
        rangeTabs: [
          { label: '日', value: 'day' },
          { label: '月', value: 'month' },
          { label: '年', value: 'year' },
        ],
        scopeTabs: [
          { label: '园区', value: 'park' },
          { label: '宿舍', value: 'dorm' },
        ],
        trendDataMap: {
          day_park: {
            todayIn: 18,
            todayOut: 9,
            monthIn: 286,
            monthOut: 149,
            netChange: 137,
            chartData: [
              { date: '06.01', inCount: 12, outCount: 4, netChange: 8 },
              { date: '06.02', inCount: 16, outCount: 6, netChange: 10 },
              { date: '06.03', inCount: 0, outCount: 10, netChange: -10 },
              { date: '06.04', inCount: 18, outCount: 7, netChange: 11 },
              { date: '06.05', inCount: 17, outCount: 8, netChange: 9 },
              { date: '06.06', inCount: 0, outCount: 12, netChange: -12 },
              { date: '06.07', inCount: 16, outCount: 5, netChange: 11 },
              { date: '06.08', inCount: 13, outCount: 6, netChange: 7 },
            ],
          },
          day_dorm: {
            todayIn: 12,
            todayOut: 6,
            monthIn: 198,
            monthOut: 104,
            netChange: 94,
            chartData: [
              { date: '06.01', inCount: 9, outCount: 3, netChange: 6 },
              { date: '06.02', inCount: 12, outCount: 4, netChange: 8 },
              { date: '06.03', inCount: 1, outCount: 8, netChange: -7 },
              { date: '06.04', inCount: 14, outCount: 5, netChange: 9 },
              { date: '06.05', inCount: 13, outCount: 6, netChange: 7 },
              { date: '06.06', inCount: 2, outCount: 9, netChange: -7 },
              { date: '06.07', inCount: 11, outCount: 4, netChange: 7 },
              { date: '06.08', inCount: 10, outCount: 5, netChange: 5 },
            ],
          },
          month_park: {
            todayIn: 286,
            todayOut: 149,
            monthIn: 286,
            monthOut: 149,
            netChange: 137,
            chartData: [
              { date: '1月', inCount: 210, outCount: 86, netChange: 124 },
              { date: '2月', inCount: 246, outCount: 108, netChange: 138 },
              { date: '3月', inCount: 198, outCount: 132, netChange: 66 },
              { date: '4月', inCount: 264, outCount: 142, netChange: 122 },
              { date: '5月', inCount: 312, outCount: 158, netChange: 154 },
              { date: '6月', inCount: 286, outCount: 149, netChange: 137 },
            ],
          },
          month_dorm: {
            todayIn: 198,
            todayOut: 104,
            monthIn: 198,
            monthOut: 104,
            netChange: 94,
            chartData: [
              { date: '1月', inCount: 160, outCount: 72, netChange: 88 },
              { date: '2月', inCount: 188, outCount: 94, netChange: 94 },
              { date: '3月', inCount: 156, outCount: 88, netChange: 68 },
              { date: '4月', inCount: 202, outCount: 106, netChange: 96 },
              { date: '5月', inCount: 224, outCount: 118, netChange: 106 },
              { date: '6月', inCount: 198, outCount: 104, netChange: 94 },
            ],
          },
          year_park: {
            todayIn: 3680,
            todayOut: 1920,
            monthIn: 286,
            monthOut: 149,
            netChange: 1760,
            chartData: [
              { date: '2021', inCount: 2860, outCount: 1540, netChange: 1320 },
              { date: '2022', inCount: 3120, outCount: 1680, netChange: 1440 },
              { date: '2023', inCount: 3440, outCount: 1820, netChange: 1620 },
              { date: '2024', inCount: 3560, outCount: 1860, netChange: 1700 },
              { date: '2025', inCount: 3680, outCount: 1920, netChange: 1760 },
            ],
          },
          year_dorm: {
            todayIn: 2640,
            todayOut: 1380,
            monthIn: 198,
            monthOut: 104,
            netChange: 1260,
            chartData: [
              { date: '2021', inCount: 2100, outCount: 1120, netChange: 980 },
              { date: '2022', inCount: 2260, outCount: 1190, netChange: 1070 },
              { date: '2023', inCount: 2420, outCount: 1260, netChange: 1160 },
              { date: '2024', inCount: 2560, outCount: 1320, netChange: 1240 },
              { date: '2025', inCount: 2640, outCount: 1380, netChange: 1260 },
            ],
          },
        },
      },
      assets: {
        headerFrameBg: I9ae5937b3192469793e18e2f394b7a36,
        titleBg: Ifa0dc035f44c4e618854d8afb4b6bba6,
        rangeSegmentBg: Iabda47a7f6544212906aa69363c38bd5,
        scopeSegmentBg: Icc905d7747c44129b7e0e7a7c4fd4a08,
        rangeActiveBg: I752fb2af7fcb402e802fd8f166aa3783,
        scopeActiveBg: Id151eae331644e37b300ea7d4734a698,
        kpiCardBg: Ic6da7e1dca0a4087ab7fcadceb97c257,
      },
      resizeObserver: null,
      echartsUnavailable: false,
      activeRange: 'day',
      activeScope: 'park',
    }
  },
  computed: {
    cardStyle() {
      return {
        '--personnel-flow-frame-bg': `url(${this.assets.headerFrameBg})`,
        '--personnel-flow-title-bg': `url(${this.assets.titleBg})`,
        '--personnel-flow-range-bg': `url(${this.assets.rangeSegmentBg})`,
        '--personnel-flow-scope-bg': `url(${this.assets.scopeSegmentBg})`,
        '--personnel-flow-range-active-bg': `url(${this.assets.rangeActiveBg})`,
        '--personnel-flow-scope-active-bg': `url(${this.assets.scopeActiveBg})`,
        '--personnel-flow-kpi-card-bg': `url(${this.assets.kpiCardBg})`,
      }
    },
    viewData() {
      if (this.isValidData(this.localData)) {
        return this.localData
      }

      if (this.isValidData(this.data)) {
        return this.data
      }

      return this.fallbackData
    },
    rangeTabs() {
      const tabs = this.toArray(this.viewData.rangeTabs).filter((tab) => {
        return tab && tab.value
      })

      return tabs.length ? tabs : this.fallbackData.rangeTabs
    },
    scopeTabs() {
      const tabs = this.toArray(this.viewData.scopeTabs).filter((tab) => {
        return tab && tab.value
      })

      return tabs.length ? tabs : this.fallbackData.scopeTabs
    },
    trendDataMap() {
      if (
        this.viewData.trendDataMap &&
        typeof this.viewData.trendDataMap === 'object'
      ) {
        return this.viewData.trendDataMap
      }

      return this.fallbackData.trendDataMap
    },
    currentTrendKey() {
      return `${this.activeRange}_${this.activeScope}`
    },
    currentTrendData() {
      const fallbackTrendData = this.fallbackData.trendDataMap.day_park
      const selectedTrendData = this.trendDataMap[this.currentTrendKey]

      return selectedTrendData || fallbackTrendData
    },
    kpiItems() {
      const trendData = this.currentTrendData
      const netChange = this.toSafeNumber(trendData.netChange, 0)

      return [
        { label: '今日入住', value: this.toSafeNumber(trendData.todayIn, 0) },
        { label: '今日退宿', value: this.toSafeNumber(trendData.todayOut, 0) },
        { label: '本月入住', value: this.toSafeNumber(trendData.monthIn, 0) },
        { label: '本月退宿', value: this.toSafeNumber(trendData.monthOut, 0) },
        {
          label: '净变化',
          value: Math.abs(netChange),
          highlight: true,
          tone: netChange >= 0 ? 'success' : 'danger',
          prefix: netChange >= 0 ? '+' : '-',
        },
      ]
    },
    summary() {
      return this.kpiItems
    },
    chartData() {
      return this.toArray(this.currentTrendData.chartData)
    },
    chartItems() {
      const normalizedItems = this.chartData
        .filter((item) => item && (item.date || item.label))
        .map((item) => ({
          label: String(item.date || item.label),
          checkIn: this.toSafeNumber(
            item.inCount != null ? item.inCount : item.checkIn,
            0,
          ),
          checkOut: this.toSafeNumber(
            item.outCount != null ? item.outCount : item.checkOut,
            0,
          ),
          netChange: this.toSafeNumber(item.netChange, 0),
        }))

      if (normalizedItems.length) {
        return normalizedItems
      }

      return this.fallbackData.trendDataMap.day_park.chartData.map((item) => ({
        label: item.date,
        checkIn: item.inCount,
        checkOut: item.outCount,
        netChange: item.netChange,
      }))
    },
  },
  mounted() {
    this.ensureActiveTabs()

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

    chartItems: {
      deep: true,
      handler() {
        this.renderChart()
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
      this.localData = data && typeof data === 'object' ? data : {}
    },
    isValidData(value) {
      if (Array.isArray(value)) {
        return false
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
      const sourceData = this.viewData

      this.activeRange = this.getTabValue(
        this.rangeTabs,
        this.activeRange || sourceData.activeRange || this.fallbackData.activeRange,
      )
      this.activeScope = this.getTabValue(
        this.scopeTabs,
        this.activeScope || sourceData.activeScope || this.fallbackData.activeScope,
      )
    },
    handleRangeChange(rangeValue) {
      if (!rangeValue || rangeValue === this.activeRange) {
        return
      }

      this.activeRange = rangeValue
      this.renderChart()
    },
    handleScopeChange(scopeValue) {
      if (!scopeValue || scopeValue === this.activeScope) {
        return
      }

      this.activeScope = scopeValue
      this.renderChart()
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
    normalizeTooltipRows(params) {
      return this.toArray(params)
    },
    formatTooltipValue(value) {
      return this.formatNumber(this.toSafeNumber(value, 0))
    },
    getChartOption() {
      const items = this.chartItems
      const checkInValues = items.map((item) => this.toSafeNumber(item.checkIn, 0))
      const checkOutValues = items.map((item) => this.toSafeNumber(item.checkOut, 0))
      const netChangeValues = items.map((item) => this.toSafeNumber(item.netChange, 0))
      const allValues = checkInValues.concat(checkOutValues, netChangeValues)
      const maxDataValue = allValues.reduce((max, value) => {
        return Math.max(max, value)
      }, 0)
      const minDataValue = netChangeValues.reduce((min, value) => {
        return Math.min(min, value)
      }, 0)
      const isDailyScale = maxDataValue <= 20 && minDataValue >= -10
      const yAxisMin = isDailyScale ? -10 : Math.floor(minDataValue / 10) * 10
      const yAxisMax = isDailyScale ? 20 : Math.ceil(maxDataValue / 10) * 10
      const yAxisInterval = isDailyScale
        ? 5
        : Math.max(10, Math.ceil((yAxisMax - yAxisMin) / 4 / 10) * 10)
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
      const vm = this

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
            const rows = vm.normalizeTooltipRows(params).filter((row) => {
              return visibleSeriesNames.indexOf(row.seriesName) !== -1
            })
            const title = rows[0] && rows[0].axisValue ? rows[0].axisValue : ''
            const body = rows.map((row) => {
              const value = row && row.value && typeof row.value === 'object'
                ? row.value.value
                : row.value

              return [
                '<div style="display:flex;align-items:center;',
                'justify-content:space-between;gap:14px;line-height:18px;">',
                `<span>${row.marker}${row.seriesName}</span>`,
                '<strong style="font-weight:700;color:#ffffff;">',
                vm.formatTooltipValue(value),
                '</strong></div>',
              ].join('')
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

.personnel-flow-trend-card.screen-card::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0;
  width: 347px;
  height: 51px;
  pointer-events: none;
  background-image: var(--personnel-flow-frame-bg);
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
  background-image: var(--personnel-flow-title-bg);
}

.personnel-flow-card {
  position: relative;
  z-index: 1;
  min-height: 196px;
}

.personnel-flow-card__summary {
  display: flex;
  align-items: center;
  width: 100%;
  height: 52px;
  gap: 4px;
  margin: -2px 0 8px;
}

.personnel-flow-card__summary-item {
  position: relative;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  padding-top: 2px;
  background-color: transparent;
  background-image: var(--personnel-flow-kpi-card-bg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  border: none;
  box-shadow: 0 0 8px rgba(64, 181, 255, 0.18);
}

.personnel-flow-card__summary-value {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42.14px;
  height: 19.32px;
  color: #f8fcff;
  font-family: "SourceHanSansCN-Regular", "Microsoft YaHei", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 19.32px;
  text-align: center;
  text-shadow: 0 0 8px rgba(122, 194, 255, 0.72);
}

.personnel-flow-card__summary-label {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40.46px;
  height: 13.44px;
  margin-top: 5px;
  color: #e6f5ff;
  font-family: "SourceHanSansCN-Regular", "Microsoft YaHei", sans-serif;
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
  background-image: var(--personnel-flow-range-bg);
  background-size: 90px 20px;
}

.personnel-flow-card__segmented--scope {
  width: 90px;
  grid-template-columns: repeat(2, 45px);
  background-image: var(--personnel-flow-scope-bg);
  background-size: 90px 20px;
}

.personnel-flow-card__segmented-button {
  position: relative;
  z-index: 1;
  min-width: 0;
  height: 20px;
  padding: 0;
  color: #dcefff;
  font-family: "SourceHanSansCN-Regular", "Microsoft YaHei", sans-serif;
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
  background-image: var(--personnel-flow-range-active-bg);
  background-size: 30px 20px;
}

.personnel-flow-card__segmented--scope .personnel-flow-card__segmented-button.is-active {
  background-image: var(--personnel-flow-scope-active-bg);
  background-size: 45px 20px;
}

.personnel-flow-card__chart {
  height: 92px;
  margin-top: 0;
}

.dorm-base-echart {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 56px;
}

.personnel-flow-card__chart.dorm-base-echart {
  height: 92px;
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
