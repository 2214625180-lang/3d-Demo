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
        month: [
          { label: '1月', checkIn: 212, checkOut: 164, netChange: 48 },
          { label: '2月', checkIn: 238, checkOut: 187, netChange: 51 },
          { label: '3月', checkIn: 256, checkOut: 211, netChange: 45 },
          { label: '4月', checkIn: 221, checkOut: 178, netChange: 43 },
          { label: '5月', checkIn: 268, checkOut: 194, netChange: 74 },
          { label: '6月', checkIn: 286, checkOut: 149, netChange: 137 },
        ],
        year: [
          { label: '2022', checkIn: 2860, checkOut: 2318, netChange: 542 },
          { label: '2023', checkIn: 3140, checkOut: 2604, netChange: 536 },
          { label: '2024', checkIn: 3368, checkOut: 2740, netChange: 628 },
          { label: '2025', checkIn: 3582, checkOut: 2836, netChange: 746 },
          { label: '2026', checkIn: 1816, checkOut: 1262, netChange: 554 },
        ],
      },
    },
  }
}

export default createDormitoryMockData
