import { formatNumber, toArray, toSafeNumber } from './number'

function createVerticalGradient(colorStops) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops,
  }
}

function createHorizontalGradient(colorStops) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops,
  }
}

function createTooltipConfig() {
  return {
    backgroundColor: 'rgba(5, 22, 42, 0.92)',
    borderColor: 'rgba(95, 190, 255, 0.55)',
    textStyle: {
      color: '#d9f5ff',
    },
  }
}

export function buildOccupancyBarOptions(monthlyStats) {
  const stats = toArray(monthlyStats)
  const blueBarGradient = createVerticalGradient([
    { offset: 0, color: '#73dcff' },
    { offset: 0.22, color: '#4ec8ff' },
    { offset: 1, color: 'rgba(42, 128, 178, 0.28)' },
  ])
  const yellowBarGradient = createVerticalGradient([
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
    }, createTooltipConfig()),
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
          value: toSafeNumber(item.value, 0),
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
          value: toSafeNumber(item.value, 0),
          itemStyle: {
            color: index % 2 === 0 ? '#8ee8ff' : '#ffe585',
            shadowBlur: 0,
          },
        })),
      },
    ],
  }
}

export function buildDepartmentDormRankingOptions(items) {
  const rankingItems = toArray(items)
  const maxValue = rankingItems.reduce((max, item) => Math.max(max, toSafeNumber(item.value, 0)), 0)
  const backgroundValue = Math.max(10, Math.ceil(maxValue * 1.08))
  const progressGradient = createHorizontalGradient([
    { offset: 0, color: 'rgba(56, 176, 232, 0.46)' },
    { offset: 0.52, color: '#55cfff' },
    { offset: 1, color: '#b6f4ff' },
  ])

  return {
    backgroundColor: 'transparent',
    grid: {
      top: 5,
      right: 58,
      bottom: 8,
      left: 82,
    },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    }, createTooltipConfig()),
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
            return formatNumber(params.value)
          },
        },
        itemStyle: {
          borderRadius: 2,
          color: progressGradient,
          shadowBlur: 10,
          shadowColor: 'rgba(94, 218, 255, 0.3)',
        },
        z: 2,
        data: rankingItems.map((item, index) => ({
          value: toSafeNumber(item.value, 0),
          itemStyle: {
            color: index < 3
              ? progressGradient
              : createHorizontalGradient([
                { offset: 0, color: 'rgba(45, 149, 210, 0.46)' },
                { offset: 0.58, color: '#3fb5ec' },
                { offset: 1, color: '#86e0ff' },
              ]),
          },
        })),
      },
    ],
  }
}

export function buildPersonnelFlowOptions(trendItems) {
  const items = toArray(trendItems)
  const checkInValues = items.map((item) => toSafeNumber(item.checkIn, 0))
  const checkOutValues = items.map((item) => toSafeNumber(item.checkOut, 0))
  const netChangeValues = items.map((item) => toSafeNumber(item.netChange, 0))
  const maxDataValue = Math.max(0, ...checkInValues, ...checkOutValues, ...netChangeValues)
  const minDataValue = Math.min(0, ...netChangeValues)
  const isDailyScale = maxDataValue <= 20 && minDataValue >= -10
  const yAxisMin = isDailyScale ? -10 : Math.floor(minDataValue / 10) * 10
  const yAxisMax = isDailyScale ? 20 : Math.ceil(maxDataValue / 10) * 10
  const yAxisInterval = isDailyScale ? 5 : Math.max(10, Math.ceil((yAxisMax - yAxisMin) / 4 / 10) * 10)
  const checkInGradient = createVerticalGradient([
    { offset: 0, color: '#8EDCFF' },
    { offset: 0.28, color: '#62B9F0' },
    { offset: 1, color: 'rgba(40, 118, 180, 0.25)' },
  ])
  const checkOutGradient = createVerticalGradient([
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
        const rows = toArray(params).filter((row) => visibleSeriesNames.includes(row.seriesName))
        const title = rows[0] && rows[0].axisValue ? rows[0].axisValue : ''
        const body = rows.map((row) => {
          const value = row && row.value && typeof row.value === 'object' ? row.value.value : row.value
          return `<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;line-height:18px;">
            <span>${row.marker}${row.seriesName}</span>
            <strong style="font-weight:700;color:#ffffff;">${formatNumber(toSafeNumber(value, 0))}</strong>
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
        data: netChangeValues.map((value) => {
          return {
            value,
            itemStyle: value < 0 ? negativePointStyle : positivePointStyle,
          }
        }),
      },
    ],
  }
}
