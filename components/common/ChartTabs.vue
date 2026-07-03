<template>
  <div class="dorm-chart-tabs" :class="'dorm-chart-tabs--' + size">
    <button
      v-for="tab in safeTabs"
      :key="tab.value"
      type="button"
      class="dorm-chart-tabs__button"
      :class="{ 'is-active': tab.value === value }"
      @click="handleSelect(tab)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script>
import { toArray } from '../../utils/number'

export default {
  name: 'ChartTabs',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return []
      },
    },
    value: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    safeTabs() {
      return toArray(this.tabs).filter((tab) => tab && tab.value)
    },
  },
  methods: {
    handleSelect(tab) {
      if (!tab || tab.value === this.value) {
        return
      }

      this.$emit('change', tab.value)
      this.$emit('input', tab.value)
    },
  },
}
</script>

<style scoped>
.dorm-chart-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 4px;
}

.dorm-chart-tabs__button {
  height: 22px;
  min-width: 58px;
  padding: 0 8px;
  color: #d6efff;
  font-size: 12px;
  font-family: inherit;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  background: rgba(28, 63, 104, 0.72);
  border: 1px solid rgba(121, 187, 226, 0.45);
  border-radius: 2px;
  outline: none;
  box-shadow: inset 0 0 10px rgba(84, 166, 225, 0.08);
}

.dorm-chart-tabs__button.is-active {
  color: #fff7ce;
  background: linear-gradient(180deg, rgba(96, 110, 84, 0.72), rgba(42, 77, 103, 0.88));
  border-color: rgba(255, 212, 106, 0.62);
  box-shadow:
    inset 0 0 12px rgba(255, 210, 95, 0.16),
    0 0 10px rgba(74, 178, 255, 0.22);
}

.dorm-chart-tabs--small .dorm-chart-tabs__button {
  height: 20px;
  min-width: 54px;
  padding: 0 7px;
  font-size: 11px;
  line-height: 18px;
}

.dorm-chart-tabs--wrap {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 5px;
}

.dorm-chart-tabs--wrap .dorm-chart-tabs__button {
  flex: 0 0 auto;
  min-width: 70px;
}
</style>
