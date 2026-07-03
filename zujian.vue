<template>
  <div class="dorm-left-region" data-dashboard-area="left-dormitory-panel">
    <div class="dorm-left-column">
      <bed-stats-card :data="statData.bedStats" />
      <occupancy-status-card :data="statData.occupancyStatus" />
      <div class="department-dorm-pair">
        <department-dorm-bar-chart :data="statData.departmentDormRanking" />
        <div class="department-dorm-pair__table">
          <department-dorm-table :data="statData.departmentDormTable" />
        </div>
      </div>
      <personnel-flow-trend-card :data="statData.personnelFlowTrend" />
    </div>
  </div>
</template>
<script>
import BedStatsCard from './components/cards/BedStatsCard/index.vue'
import DepartmentDormBarChart from './components/cards/DepartmentDormBarChart/index.vue'
import DepartmentDormTable from './components/cards/DepartmentDormTable/index.vue'
import OccupancyStatusCard from './components/cards/OccupancyStatusCard/index.vue'
import PersonnelFlowTrendCard from './components/cards/PersonnelFlowTrendCard.vue'
import { createDormitoryMockData } from './data/statdata.js'
export default {
  name: 'chart',
  components: {
    BedStatsCard,
    OccupancyStatusCard,
    DepartmentDormBarChart,
    DepartmentDormTable,
    PersonnelFlowTrendCard,
  },
  data() {
    return {
      statData: createDormitoryMockData(),
      opts: {},
    }
  },
  mounted() {
    this.loadDormitoryStatData()
  },
  methods: {
    loadDormitoryStatData() {
      // TODO: 后续替换为真实接口：
      // getDormitoryLeftPanelStats().then(response => {
      //   this.statData = normalizeDormitoryStatData(response)
      // })
      this.statData = createDormitoryMockData()
    },
  },
}
</script>

<style>
.dorm-left-region {
  position: relative;
  box-sizing: border-box;
  width: 700px;
  min-height: 920px;
  padding: 0;
  color: #d9f3ff;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

.dorm-left-region *,
.dorm-left-region *::before,
.dorm-left-region *::after {
  box-sizing: border-box;
}

.dorm-left-column {
  width: 329px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.department-dorm-pair {
  position: relative;
  width: 698px;
}

.dorm-left-region .department-dorm-pair > .department-dorm-bar-chart.screen-card {
  width: 340px !important;
  height: 216px;
}

.department-dorm-pair__table {
  position: absolute;
  left: 358px;
  top: 0;
  z-index: 6;
  width: 340px;
  height: 216px;
}
</style>
