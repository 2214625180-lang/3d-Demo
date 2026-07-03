<template>
  <screen-card
    title="事业部在宿人数"
    body-class="department-table-card"
    data-drag-component="DepartmentDormTable"
  >
    <chart-tabs class="department-table-card__tabs" :value="activeView" :tabs="tabs" size="small" />
    <dorm-building-grid :data="data" />
  </screen-card>
</template>
<script>
import ChartTabs from '../common/ChartTabs.vue'
import DormBuildingGrid from '../common/DormBuildingGrid.vue'
import ScreenCard from '../common/ScreenCard.vue'
import { toArray } from '../../utils/number'

export default {
  name: 'DepartmentDormTable',
  components: {
    ScreenCard,
    ChartTabs,
    DormBuildingGrid,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    activeView: {
      type: String,
      default: 'table',
    },
  },
  computed: {
    tabs() {
      return toArray(this.data.tabs)
    },
  },
}
</script>

<style>
[data-drag-component="DepartmentDormTable"] {
  width: 340px !important;
}

.department-table-card {
  min-height: 158px;
}

.department-table-card__tabs {
  gap: 4px;
  margin: 2px 0 8px;
}

.department-table-card__tabs .dorm-chart-tabs__button {
  position: relative;
  width: 74px;
  min-width: 74px;
  height: 20px;
  padding: 0;
  overflow: hidden;
  color: rgba(223, 241, 255, 0.9);
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  background: rgba(8, 30, 52, 0.45);
  border: 1px solid rgba(118, 187, 232, 0.36);
  border-radius: 0;
  box-shadow: inset 0 0 8px rgba(66, 160, 220, 0.1);
  text-shadow: 0 0 6px rgba(78, 176, 238, 0.28);
}

.department-table-card__tabs .dorm-chart-tabs__button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url("../../assets/组合2396.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.32;
  filter: saturate(0.45) brightness(0.58);
}

.department-table-card__tabs .dorm-chart-tabs__button.is-active {
  color: #fff7cd;
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
  text-shadow: 0 0 6px rgba(255, 224, 121, 0.32);
}

.department-table-card__tabs .dorm-chart-tabs__button.is-active::before {
  opacity: 1;
  filter: none;
}
</style>
