<template>
  <div class="dorm-building-grid" role="table" aria-label="事业部在宿人数楼栋表格">
    <div
      class="dorm-building-grid__header"
      :style="gridStyle"
      role="row"
    >
      <span class="dorm-building-grid__cell" role="columnheader">楼栋</span>
      <span
        v-for="department in departments"
        :key="department.key"
        class="dorm-building-grid__cell"
        role="columnheader"
      >
        {{ department.label }}
      </span>
    </div>

    <div class="dorm-building-grid__body" role="rowgroup">
      <div
        v-for="row in rows"
        :key="row.building"
        class="dorm-building-grid__row"
        :style="gridStyle"
        role="row"
      >
        <span class="dorm-building-grid__cell dorm-building-grid__building" role="cell">
          {{ row.building }}
        </span>
        <span
          v-for="department in departments"
          :key="department.key"
          class="dorm-building-grid__cell"
          role="cell"
        >
          {{ getBuildingValue(row, department) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatNumber, toArray } from '../../utils/number'
export default {
  name: 'DormBuildingGrid',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    departments() {
      return toArray(this.data.departments)
    },
    rows() {
      return toArray(this.data.rows)
    },
    gridStyle() {
      return {
        gridTemplateColumns: `44px repeat(${this.departments.length}, minmax(0, 1fr))`,
      }
    },
  },
  methods: {
    getBuildingValue(row, department) {
      if (!row || !row.values || !department) {
        return 0
      }

      return formatNumber(row.values[department.key])
    },
  },
}
</script>

<style scoped>
.dorm-building-grid {
  width: 100%;
  overflow: hidden;
  padding: 0;
  border: 0;
  background: transparent;
}

.dorm-building-grid__header,
.dorm-building-grid__row {
  display: grid;
  align-items: center;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.dorm-building-grid__header {
  height: 19px;
  background-image: url("../../assets/frame24.png");
}

.dorm-building-grid__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-top: 2px;
}

.dorm-building-grid__row {
  height: 28px;
  background-image: url("../../assets/frame.png");
}

.dorm-building-grid__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  padding: 0 2px;
  overflow: hidden;
  color: rgba(226, 242, 255, 0.92);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  text-shadow: none;
}

.dorm-building-grid__header .dorm-building-grid__cell {
  color: rgba(226, 242, 255, 0.92);
  font-size: 12px;
  font-weight: 500;
  text-shadow: none;
}

.dorm-building-grid__building {
  color: rgba(226, 242, 255, 0.92);
  font-weight: 500;
  text-shadow: none;
}
</style>
