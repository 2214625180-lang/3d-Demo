<template>
  <div
    class="department-dorm-table screen-card"
    :style="cardStyle"
    data-drag-component="DepartmentDormTable"
  >
    <div class="dorm-card-title dorm-card-title--department">
      <span class="dorm-card-title__image" aria-hidden="true"></span>
      <span class="dorm-card-title__text">事业部在宿人数</span>
    </div>

    <div class="department-table-card">
      <div
        class="department-table-card__tabs dorm-chart-tabs dorm-chart-tabs--small"
      >
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

      <div
        class="department-dorm-table__table-panel"
        role="table"
        aria-label="事业部在宿人数楼栋表格"
      >
        <div
          class="department-dorm-table__table-header table-bg-header"
          role="row"
        >
          <div class="department-dorm-table__cell" role="columnheader">楼栋</div>
          <div class="department-dorm-table__cell" role="columnheader">维信</div>
          <div class="department-dorm-table__cell" role="columnheader">超维</div>
          <div class="department-dorm-table__cell" role="columnheader">条尔思</div>
          <div class="department-dorm-table__cell" role="columnheader">光电</div>
          <div class="department-dorm-table__cell" role="columnheader">东创</div>
          <div class="department-dorm-table__cell" role="columnheader">管理</div>
        </div>

        <div
          v-for="row in tableRows"
          :key="row.building"
          class="department-dorm-table__table-row table-bg-body"
          role="row"
        >
          <div
            class="department-dorm-table__cell department-dorm-table__building"
            role="cell"
          >
            {{ row.building }}
          </div>
          <div class="department-dorm-table__cell" role="cell">{{ row.weixin }}</div>
          <div class="department-dorm-table__cell" role="cell">{{ row.chaowei }}</div>
          <div class="department-dorm-table__cell" role="cell">{{ row.senersi }}</div>
          <div class="department-dorm-table__cell" role="cell">{{ row.guangdian }}</div>
          <div class="department-dorm-table__cell" role="cell">{{ row.dongchuang }}</div>
          <div class="department-dorm-table__cell" role="cell">{{ row.guanli }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import I9ae5937b3192469793e18e2f394b7a36 from 'img/d22281f561c2499d9d4e706e714c454e.png';
import Idb1b215b19e645179250f52eed9bff50 from 'img/49a49a4c4c184393ab02f949a5b09fee.png';
import Ica62726aa6224a06ae374e60add716dc from 'img/fa480ed204844c9b92771be2feff6e43.png';
import I5ab1a2264e84423d9b72cdff5ebfd660 from 'img/2f1c8a2a4c884f1ba0f2ef7e95467428.png';
import I508e8126325b4925be4a8059436b8cef from 'img/2a835d5990b24e9088081cd189bc4b1a.png';
import SOURCEHANSANSCNREGULAR from 'fonts/SOURCEHANSANSCN-REGULAR.otf&&SourceHanSansCN-Regular';

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
      fallbackTabs: [
        { label: '横条图', value: 'bar' },
        { label: '楼栋表格', value: 'table' },
      ],
      fallbackData: {
        departments: [
          { key: 'weixin', label: '维信' },
          { key: 'chaowei', label: '超维' },
          { key: 'senersi', label: '索尔思' },
          { key: 'guangdian', label: '光电' },
          { key: 'dongchuang', label: '东创' },
          { key: 'guanli', label: '管理' },
        ],
        rows: [
          {
            building: 'A栋',
            weixin: 318,
            chaowei: 318,
            senersi: 318,
            guangdian: 318,
            dongchuang: 318,
            guanli: 318,
          },
          {
            building: 'B栋',
            weixin: 276,
            chaowei: 276,
            senersi: 276,
            guangdian: 276,
            dongchuang: 276,
            guanli: 276,
          },
          {
            building: 'C栋',
            weixin: 224,
            chaowei: 224,
            senersi: 224,
            guangdian: 224,
            dongchuang: 224,
            guanli: 224,
          },
        ],
      },
      assets: {
        headerFrameBg: I9ae5937b3192469793e18e2f394b7a36,
        titleBg: Idb1b215b19e645179250f52eed9bff50,
        tabButtonBg: Ica62726aa6224a06ae374e60add716dc,
        tableBodyRowBg: I5ab1a2264e84423d9b72cdff5ebfd660,
        tableHeaderRowBg: I508e8126325b4925be4a8059436b8cef,
      },
      resizeObserver: null,
    };
  },
  computed: {
    cardStyle() {
      return {
        '--department-table-frame-bg': `url(${this.assets.headerFrameBg})`,
        '--department-table-title-bg': `url(${this.assets.titleBg})`,
        '--department-table-tab-bg': `url(${this.assets.tabButtonBg})`,
        '--department-table-header-row-bg': `url(${this.assets.tableHeaderRowBg})`,
        '--department-table-body-row-bg': `url(${this.assets.tableBodyRowBg})`,
      };
    },
    viewData() {
      if (this.isValidData(this.localData)) {
        return this.localData;
      }

      if (this.isValidData(this.data)) {
        return this.data;
      }

      return this.fallbackData;
    },
    departments() {
      if (Array.isArray(this.viewData)) {
        return this.fallbackData.departments;
      }

      const departments = this.toArray(this.viewData.departments)
        .filter((department) => department && department.key)
        .map((department) => ({
          key: this.getCanonicalDepartmentKey(department.key),
          sourceKey: department.key,
          label: department.label || department.key,
        }));

      return departments.length ? departments : this.fallbackData.departments;
    },
    rows() {
      const sourceRows = Array.isArray(this.viewData)
        ? this.viewData
        : this.viewData.rows;
      const rows = this.toArray(sourceRows)
        .filter((row) => row && row.building)
        .map((row) => this.normalizeRow(row));

      return rows.length
        ? rows
        : this.fallbackData.rows.map((row) => this.normalizeRow(row));
    },
    tableRows() {
      return this.rows.map((row) => {
        const values = row && row.values ? row.values : {};

        return {
          building: row && row.building ? row.building : '',
          weixin: this.formatNumber(values.weixin),
          chaowei: this.formatNumber(values.chaowei),
          senersi: this.formatNumber(values.senersi),
          guangdian: this.formatNumber(values.guangdian),
          dongchuang: this.formatNumber(values.dongchuang),
          guanli: this.formatNumber(values.guanli),
        };
      });
    },
    tabs() {
      const sourceTabs = Array.isArray(this.viewData)
        ? this.fallbackTabs
        : this.viewData.tabs;
      const tabs = this.toArray(sourceTabs).filter((tab) => tab && tab.value);

      return tabs.length ? tabs : this.fallbackTabs;
    },
  },
  methods: {
    setdata(data) {
      this.localData = this.isValidData(data) ? data : {};
    },
    isValidData(value) {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return (
        value && typeof value === 'object' && Object.keys(value).length > 0
      );
    },
    toArray(value) {
      return Array.isArray(value) ? value : [];
    },
    toSafeNumber(value, fallbackValue) {
      const numberValue = Number(value);
      return Number.isFinite(numberValue) ? numberValue : fallbackValue;
    },
    formatNumber(value) {
      return this.toSafeNumber(value, 0).toLocaleString('en-US');
    },
    getCanonicalDepartmentKey(key) {
      const legacyDepartmentKeyMap = {
        manage: 'guanli',
        guanli: 'guanli',
      };
      return legacyDepartmentKeyMap[key] || key;
    },
    normalizeRow(row) {
      const values =
        row.values && typeof row.values === 'object' ? row.values : row;
      const normalizedRow = {
        building: row.building,
        values: {},
      };
      this.departments.forEach((department) => {
        const sourceKey = department.sourceKey || department.key;
        const mappedKey = this.getCanonicalDepartmentKey(sourceKey);
        const value =
          values[sourceKey] != null ? values[sourceKey] : values[mappedKey];

        normalizedRow.values[department.key] = this.toSafeNumber(value, 0);
      });
      return normalizedRow;
    },
  },
};
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
  font-family: 'SourceHanSansCN-Regular', 'Microsoft YaHei', Arial, sans-serif;
  background: linear-gradient(
    180deg,
    rgba(8, 32, 58, 0.72),
    rgba(4, 22, 42, 0.52)
  );
  backdrop-filter: blur(3px);
  border: 1px solid rgba(92, 183, 245, 0.24);
  border-radius: 4px;
  box-shadow: 0 0 14px rgba(23, 145, 231, 0.16),
    inset 0 0 12px rgba(71, 178, 252, 0.08);
}

.department-dorm-table.screen-card::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 0;
  width: 347px;
  height: 51px;
  pointer-events: none;
  background-image: var(--department-table-frame-bg);
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
  background-image: var(--department-table-title-bg);
}

.department-table-card {
  position: relative;
  z-index: 1;
  height: calc(100% - 33px);
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
  margin: 2px 0 0;
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
  background: linear-gradient(
    180deg,
    rgba(96, 110, 84, 0.72),
    rgba(42, 77, 103, 0.88)
  );
  border-color: rgba(255, 212, 106, 0.62);
  box-shadow: inset 0 0 12px rgba(255, 210, 95, 0.16),
    0 0 10px rgba(74, 178, 255, 0.22);
}

.dorm-chart-tabs--small .dorm-chart-tabs__button {
  height: 20px;
  min-width: 54px;
  padding: 0 7px;
  font-size: 12px;
  line-height: 18px;
}

.department-table-card__tabs .dorm-chart-tabs__button {
  position: relative;
  width: auto;
  min-width: 78px;
  height: 30px;
  padding: 0 14px;
  overflow: hidden;
  color: rgba(223, 241, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  line-height: 28px;
  background: rgba(18, 48, 76, 0.36);
  border: 1px solid rgba(160, 215, 255, 0.38);
  border-radius: 0;
  box-shadow: inset 0 0 8px rgba(80, 180, 255, 0.1);
  text-shadow: 0 0 6px rgba(78, 176, 238, 0.28);
}

.department-table-card__tabs .dorm-chart-tabs__button::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--department-table-tab-bg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.18;
  filter: saturate(0.45) brightness(0.72);
}

.department-table-card__tabs .dorm-chart-tabs__button.is-active {
  color: #fff2b8;
  background: rgba(140, 122, 62, 0.34);
  border-color: rgba(244, 217, 110, 0.58);
  box-shadow: inset 0 0 10px rgba(255, 224, 116, 0.2),
    0 0 6px rgba(255, 224, 116, 0.12);
  text-shadow: 0 0 6px rgba(255, 224, 121, 0.32);
}

.department-table-card__tabs .dorm-chart-tabs__button.is-active::before {
  opacity: 0.42;
  filter: brightness(0.95) saturate(0.9);
}

.department-dorm-table__table-panel {
  position: absolute;
    left: 2%;
    right: 5%;
    top: 21%;
    display: flex;
    flex-direction: column;
}

.department-dorm-table__table-header,
.department-dorm-table__table-row {
  display: grid;
  grid-template-columns: 1.05fr repeat(6, 1fr);
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(8, 35, 64, 0.22);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-blend-mode: normal;
  border: none;
  box-shadow: none;
}

.department-dorm-table__table-header {
  height: 34px;
  background-image: var(--department-table-header-row-bg);
  opacity: 0;
}

.department-dorm-table__table-row {
  height: 40px;
  background-image: var(--department-table-body-row-bg);
  opacity: 0;
}

.department-dorm-table__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  padding: 0 2px;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  text-shadow: none;
}

.department-dorm-table__table-header .department-dorm-table__cell {
  color: rgba(104, 220, 255, 0.92);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
}

.department-dorm-table__table-row .department-dorm-table__cell {
  color: rgba(236, 248, 255, 0.92);
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
}

.department-dorm-table__building {
  color: rgba(245, 251, 255, 0.96);
  font-weight: 500;
}
</style>
