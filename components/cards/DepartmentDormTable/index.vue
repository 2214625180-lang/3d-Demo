<template>
  <div class="department-dorm-table screen-card" data-drag-component="DepartmentDormTable">
    <div class="dorm-card-title dorm-card-title--department">
      <span class="dorm-card-title__image" aria-hidden="true"></span>
      <span class="dorm-card-title__text">事业部在宿人数</span>
    </div>

    <div class="department-table-card">
      <div class="department-table-card__tabs dorm-chart-tabs dorm-chart-tabs--small">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="dorm-chart-tabs__button"
          :class="{ 'is-active': tab.value === activeView }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="dorm-building-grid" role="table" aria-label="事业部在宿人数楼栋表格">
        <div class="dorm-building-grid__header" :style="gridStyle" role="row">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'DepartmentDormTable',
  props: {
    data: {
      type: [Object, Array],
      default: () => ({}),
    },
    activeView: {
      type: String,
      default: 'table',
    },
  },
  data() {
    return {
      chart: null,
      localData: {},
      fallbackData: {
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
          { key: 'guanli', label: '管理' },
        ],
        rows: [
          { building: 'A栋', weixin: 318, chaowei: 318, senersi: 318, guangdian: 318, dongchuang: 318, guanli: 318 },
          { building: 'B栋', weixin: 276, chaowei: 276, senersi: 276, guangdian: 276, dongchuang: 276, guanli: 276 },
          { building: 'C栋', weixin: 224, chaowei: 224, senersi: 224, guangdian: 224, dongchuang: 224, guanli: 224 },
        ],
      },
    }
  },
  computed: {
    viewData() {
      if (this.isValidData(this.localData)) {
        return this.localData
      }

      if (this.isValidData(this.data)) {
        return this.data
      }

      return this.fallbackData
    },
    departments() {
      if (Array.isArray(this.viewData)) {
        return this.fallbackData.departments
      }

      const departments = this.toArray(this.viewData.departments)
        .filter((department) => department && department.key)
        .map((department) => ({
          key: this.getCanonicalDepartmentKey(department.key),
          sourceKey: department.key,
          label: department.label || department.key,
        }))

      return departments.length ? departments : this.fallbackData.departments
    },
    rows() {
      const sourceRows = Array.isArray(this.viewData) ? this.viewData : this.viewData.rows
      const rows = this.toArray(sourceRows)
        .filter((row) => row && row.building)
        .map((row) => this.normalizeRow(row))

      return rows.length ? rows : this.fallbackData.rows.map((row) => this.normalizeRow(row))
    },
    tabs() {
      const sourceTabs = Array.isArray(this.viewData) ? this.fallbackData.tabs : this.viewData.tabs
      const tabs = this.toArray(sourceTabs).filter((tab) => tab && tab.value)

      return tabs.length ? tabs : this.fallbackData.tabs
    },
    gridStyle() {
      return {
        gridTemplateColumns: `44px repeat(${this.departments.length}, minmax(0, 1fr))`,
      }
    },
  },
  methods: {
    setdata(data) {
      this.localData = this.isValidData(data) ? data : {}
    },
    isValidData(value) {
      if (Array.isArray(value)) {
        return value.length > 0
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
    getCanonicalDepartmentKey(key) {
      const legacyDepartmentKeyMap = {
        manage: 'guanli',
        guanli: 'guanli',
      }

      return legacyDepartmentKeyMap[key] || key
    },
    normalizeRow(row) {
      const values = row.values && typeof row.values === 'object' ? row.values : row
      const normalizedRow = {
        building: row.building,
        values: {},
      }

      this.departments.forEach((department) => {
        const sourceKey = department.sourceKey || department.key
        const mappedKey = this.getCanonicalDepartmentKey(sourceKey)
        const value = values[sourceKey] != null ? values[sourceKey] : values[mappedKey]

        normalizedRow.values[department.key] = this.toSafeNumber(value, 0)
      })

      return normalizedRow
    },
    getBuildingValue(row, department) {
      if (!row || !row.values || !department) {
        return '0'
      }

      return this.formatNumber(row.values[department.key])
    },
  },
}
</script>

<style scoped>
.department-dorm-table,
.department-dorm-table *,
.department-dorm-table *::before,
.department-dorm-table *::after {
  box-sizing: border-box;
}

.department-dorm-table.screen-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 216px;
  padding: 12px 10px 11px;
  overflow: hidden;
  color: #d9f3ff;
  font-family: "Microsoft YaHei", Arial, sans-serif;
  background:
    linear-gradient(135deg, rgba(58, 136, 194, 0.16), rgba(5, 18, 38, 0.74) 42%, rgba(4, 24, 47, 0.86)),
    rgba(6, 24, 48, 0.72);
  border: 1px solid rgba(92, 183, 245, 0.38);
  border-radius: 4px;
  box-shadow:
    0 0 22px rgba(23, 145, 231, 0.28),
    inset 0 0 18px rgba(71, 178, 252, 0.16);
}

.department-dorm-table.screen-card::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0;
  width: 347px;
  height: 51px;
  pointer-events: none;
  background-image: url("../../../assets/编组 12@2x.png");
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

.dorm-card-title--department .dorm-card-title__image {
  width: 137px;
  height: 21px;
  background-image: url("../../../assets/事业部在宿人数@2x(1).png");
}

.department-table-card {
  position: relative;
  z-index: 1;
  min-height: 158px;
}

.dorm-chart-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 4px;
}

.department-table-card__tabs {
  gap: 4px;
  margin: 2px 0 8px;
}

.dorm-chart-tabs__button {
  height: 22px;
  min-width: 58px;
  padding: 0 8px;
  color: #d6efff;
  font-family: inherit;
  font-size: 12px;
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

.department-table-card__tabs .dorm-chart-tabs__button {
  position: relative;
  width: 74px;
  min-width: 74px;
  height: 20px;
  padding: 0;
  overflow: hidden;
  color: rgba(223, 241, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
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
  background-image: url("../../../assets/组合2396.png");
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

.dorm-building-grid {
  width: 100%;
  padding: 0;
  overflow: hidden;
  background: transparent;
  border: 0;
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
  background-image: url("../../../assets/frame24.png");
}

.dorm-building-grid__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-top: 2px;
}

.dorm-building-grid__row {
  height: 28px;
  background-image: url("../../../assets/frame.png");
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
