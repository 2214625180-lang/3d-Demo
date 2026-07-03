<template>
  <screen-card
    title="人员流动趋势"
    body-class="personnel-flow-card"
    data-drag-component="PersonnelFlowTrendCard"
  >
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
          @click="activeRange = tab.value"
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
          @click="activeScope = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <base-e-chart class="personnel-flow-card__chart" :options="chartOptions" height="92px" />
  </screen-card>
</template>

<script>
import BaseEChart from '../common/BaseEChart.vue'
import ScreenCard from '../common/ScreenCard.vue'
import { buildPersonnelFlowOptions } from '../../utils/dormChartOptions'
import { getTabValue, toArray } from '../../utils/number'

export default {
  name: 'PersonnelFlowTrendCard',
  components: {
    ScreenCard,
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
      activeRange: 'day',
      activeScope: 'campus',
    }
  },
  computed: {
    summary() {
      return toArray(this.data.summary)
    },
    rangeTabs() {
      return toArray(this.data.rangeTabs)
    },
    scopeTabs() {
      return toArray(this.data.scopeTabs)
    },
    activeTrendItems() {
      const trendByRange = this.data.trendByRange || {}
      return trendByRange[this.activeRange] || []
    },
    chartOptions() {
      return buildPersonnelFlowOptions(this.activeTrendItems)
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler() {
        this.activeRange = getTabValue(this.rangeTabs, this.activeRange || this.data.defaultRange)
        this.activeScope = getTabValue(this.scopeTabs, this.activeScope || this.data.defaultScope)
      },
    },
  },
}
</script>

<style>
.personnel-flow-card {
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
  background-image: url("../../assets/编组.png");
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
  justify-content: flex-start;
  align-items: center;
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
  background-image: url("../../assets/组合 2468.png");
  background-size: 90px 20px;
}

.personnel-flow-card__segmented--scope {
  width: 90px;
  grid-template-columns: repeat(2, 45px);
  background-image: url("../../assets/组合 2469.png");
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
  background-image: url("../../assets/矩形 1434(1).png");
  background-size: 30px 20px;
}

.personnel-flow-card__segmented--scope .personnel-flow-card__segmented-button.is-active {
  background-image: url("../../assets/矩形 1434.png");
  background-size: 45px 20px;
}

.personnel-flow-card__chart {
  margin-top: 0;
}
</style>
