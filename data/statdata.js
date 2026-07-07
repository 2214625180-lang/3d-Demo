export function createDormitoryMockData() {
  // 后续对接真实接口时，建议在根组件 loadDormitoryStatData 中请求并归一化接口数据。
  // 每个业务卡片仍然只通过 props 接收数据，避免和具体接口强耦合。
  return {
    bedStats: {
      totalBeds: 4860,
      validBeds: 4660,
      occupiedBeds: 3986,
      emptyBeds: 742,
    },
    occupancyStatus: {
      metrics: {
        vacancyRate: '15.7%',
        occupancyRate: '84.3%',
        maleCount: 1256,
        femaleCount: 347,
      },
      defaultDepartmentKey: 'weixin',
      departments: [
        {
          key: 'weixin',
          label: '盐城维信',
          monthlyStats: [
            { month: '1月', value: 125 },
            { month: '2月', value: 178 },
            { month: '3月', value: 146 },
            { month: '4月', value: 138 },
            { month: '5月', value: 201 },
            { month: '6月', value: 164 },
          ],
        },
        {
          key: 'chaowei',
          label: '超维微电子',
          monthlyStats: [
            { month: '1月', value: 112 },
            { month: '2月', value: 154 },
            { month: '3月', value: 133 },
            { month: '4月', value: 122 },
            { month: '5月', value: 176 },
            { month: '6月', value: 151 },
          ],
        },
        {
          key: 'senersi',
          label: '盐城森尔思',
          monthlyStats: [
            { month: '1月', value: 96 },
            { month: '2月', value: 131 },
            { month: '3月', value: 118 },
            { month: '4月', value: 109 },
            { month: '5月', value: 149 },
            { month: '6月', value: 136 },
          ],
        },
        {
          key: 'guangdian',
          label: '盐城光电',
          monthlyStats: [
            { month: '1月', value: 86 },
            { month: '2月', value: 114 },
            { month: '3月', value: 101 },
            { month: '4月', value: 93 },
            { month: '5月', value: 128 },
            { month: '6月', value: 116 },
          ],
        },
        {
          key: 'dongchuang',
          label: '盐城东创',
          monthlyStats: [
            { month: '1月', value: 72 },
            { month: '2月', value: 98 },
            { month: '3月', value: 86 },
            { month: '4月', value: 81 },
            { month: '5月', value: 107 },
            { month: '6月', value: 96 },
          ],
        },
      ],
    },
    departmentDormRanking: {
      defaultView: 'bar',
      tabs: [
        { label: '横条图', value: 'bar' },
        { label: '楼栋表格', value: 'table' },
      ],
      items: [
        { name: '盐城维信', value: 1246 },
        { name: '超维微电子', value: 1083 },
        { name: '盐城森尔思', value: 874 },
        { name: '盐城光电', value: 779 },
        { name: '盐城东创', value: 668 },
      ],
    },
    departmentDormTable: {
      defaultView: 'table',
      tabs: [
        { label: '横条图', value: 'bar' },
        { label: '楼栋表格', value: 'table' },
      ],
      departments: [
        { key: 'weixin', label: '维信' },
        { key: 'chaowei', label: '超维' },
        { key: 'senersi', label: '条尔思' },
        { key: 'guangdian', label: '光电' },
        { key: 'dongchuang', label: '东创' },
        { key: 'manage', label: '管理' },
      ],
      rows: [
        {
          building: 'A栋',
          values: {
            weixin: 318,
            chaowei: 318,
            senersi: 318,
            guangdian: 318,
            dongchuang: 318,
            manage: 318,
          },
        },
        {
          building: 'B栋',
          values: {
            weixin: 276,
            chaowei: 276,
            senersi: 276,
            guangdian: 276,
            dongchuang: 276,
            manage: 276,
          },
        },
        {
          building: 'C栋',
          values: {
            weixin: 224,
            chaowei: 224,
            senersi: 224,
            guangdian: 224,
            dongchuang: 224,
            manage: 224,
          },
        },
      ],
    },
    personnelFlowTrend: {
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
  }
}

export default createDormitoryMockData
