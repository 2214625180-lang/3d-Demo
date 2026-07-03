<template>
  <screen-card
    title="人员入住情况"
    body-class="occupancy-card"
    data-drag-component="OccupancyStatusCard"
  >
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
          {{ formatMetricValue(row.left.value) }}
        </strong>
        <span class="occupancy-card__metric-label occupancy-card__metric-label--right occupancy-text">
          {{ row.right.label }}
        </span>
        <strong class="occupancy-card__metric-value occupancy-card__metric-value--right occupancy-text">
          {{ formatMetricValue(row.right.value) }}
        </strong>
      </div>
    </div>
    <chart-tabs
      v-model="activeDepartmentKey"
      class="occupancy-card__tabs occupancy-tab"
      :tabs="departmentTabs"
      size="wrap"
    />
    <base-e-chart :options="chartOptions" height="58px" />
  </screen-card>
</template>

<script>
import BaseEChart from '../common/BaseEChart.vue'
import ChartTabs from '../common/ChartTabs.vue'
import ScreenCard from '../common/ScreenCard.vue'
import { buildOccupancyBarOptions } from '../../utils/dormChartOptions'
import { getTabValue, toArray } from '../../utils/number'

const REQUIRED_DEPARTMENT_TABS = [
  { label: '盐城维信', value: 'weixin' },
  { label: '超维微电子', value: 'chaowei' },
  { label: '盐城索尔思', value: 'senersi' },
  { label: '盐城光重', value: 'guangdian' },
  { label: '管理公司', value: 'manage' },
  { label: '盐城东仓', value: 'dongchuang' },
]

export default {
  name: 'OccupancyStatusCard',
  components: {
    ScreenCard,
    ChartTabs,
    BaseEChart,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      activeDepartmentKey: '',
    }
  },
  computed: {
    metrics() {
      return this.data.metrics || {}
    },
    metricRows() {
      return [
        {
          left: { label: '置空率', value: this.metrics.vacancyRate || '0%' },
          right: { label: '入住率', value: this.metrics.occupancyRate || '0%' },
        },
        {
          left: { label: '男生人数', value: this.metrics.maleCount || 0 },
          right: { label: '女生人数', value: this.metrics.femaleCount || 0 },
        },
      ]
    },
    departmentTabs() {
      return REQUIRED_DEPARTMENT_TABS
    },
    activeDepartment() {
      const departments = toArray(this.data.departments)
      return departments.find((department) => department.key === this.activeDepartmentKey) || {
        monthlyStats: [],
      }
    },
    chartOptions() {
      return buildOccupancyBarOptions(this.activeDepartment.monthlyStats)
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler() {
        this.activeDepartmentKey = getTabValue(
          this.departmentTabs,
          this.activeDepartmentKey || this.data.defaultDepartmentKey
        )
      },
    },
  },
  methods: {
    formatMetricValue(value) {
      if (value === null || value === undefined || value === '') {
        return '0'
      }

      return String(value)
    },
  },
}
</script>

<style>
@font-face {
  font-family: "SourceHanSansRegular";
  src: url("/SourceHanSansSC-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.occupancy-card {
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
  background-image: url("../../assets/编组5.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 294px 38px;
}

.occupancy-card__metric-row--primary {
  display: block;
  height: 38px;
}

.occupancy-card__metric-row--primary .occupancy-card__metric-label,
.occupancy-card__metric-row--primary .occupancy-card__metric-value {
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

.occupancy-card__metric-row--secondary {
  display: block;
  height: 38px;
}

.occupancy-card__metric-row--secondary .occupancy-card__metric-label,
.occupancy-card__metric-row--secondary .occupancy-card__metric-value {
  position: absolute;
  min-width: 0;
  padding: 0;
  white-space: nowrap;
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

[data-drag-component="OccupancyStatusCard"] .occupancy-card__tabs.dorm-chart-tabs--wrap {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
  width: 100%;
  margin-bottom: 5px;
}

[data-drag-component="OccupancyStatusCard"] .occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button {
  position: relative;
  width: 100%;
  height: 20px;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  color: #c0d2f1;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  background: rgba(8, 30, 52, 0.45);
  border: 1px solid rgba(118, 187, 232, 0.36);
  border-radius: 0;
  box-shadow: inset 0 0 8px rgba(66, 160, 220, 0.1);
  text-shadow: 0 0 6px rgba(78, 176, 238, 0.28);
}

[data-drag-component="OccupancyStatusCard"] .occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url("../../assets/组合2396.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.36;
  filter: brightness(0.65) saturate(0.75);
}

[data-drag-component="OccupancyStatusCard"] .occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button.is-active {
  color: #fff4c2;
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
  text-shadow: 0 0 6px rgba(255, 224, 121, 0.32);
}

[data-drag-component="OccupancyStatusCard"] .occupancy-card__tabs.dorm-chart-tabs--wrap .dorm-chart-tabs__button.is-active::before {
  opacity: 1;
  filter: none;
}

.occupancy-text,
[data-drag-component="OccupancyStatusCard"] .occupancy-tab .dorm-chart-tabs__button {
  font-family: "SourceHanSansRegular", "Microsoft YaHei", sans-serif;
}
</style>
