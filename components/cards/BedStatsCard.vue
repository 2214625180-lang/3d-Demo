<template>
  <screen-card
    title="床位统计概览"
    body-class="bed-stats-card"
    data-drag-component="BedStatsCard"
  >
    <div class="bed-stats-card__summary">
      <div
        v-for="(metric, metricIndex) in summaryMetrics"
        :key="metric.label"
        class="bed-stats-card__summary-item"
        :class="metricIndex === 0 ? 'bed-stats-card__summary-item--total' : 'bed-stats-card__summary-item--valid'"
        :style="{ '--house-bg': `url(${houseIcon})` }"
      >
        <span class="bed-stats-card__summary-label bed-overview-top-label bed-overview-label">{{ metric.label }}</span>
        <strong class="bed-stats-card__summary-value bed-overview-top-value">{{ formatBedValue(metric.value) }}</strong>
      </div>
    </div>
    <div class="bed-stats-card__content bed-middle">
      <div class="bed-stats-card__middle-bg" aria-hidden="true"></div>
      <div class="bed-stats-card__visual bed-disk-area" aria-hidden="true">
        <span class="bed-stats-card__ring bed-stats-card__ring--outer"></span>
        <span class="bed-stats-card__ring bed-stats-card__ring--middle"></span>
        <span class="bed-stats-card__ring bed-stats-card__ring--inner"></span>
        <span class="bed-stats-card__scanner"></span>
        <span class="bed-stats-card__core-glow">
          <svg class="bed-stats-card__core-glow-svg" viewBox="0 0 36 36" focusable="false">
            <defs>
              <radialGradient id="bed-core-glow-main" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
                <stop offset="48%" stop-color="#dcecff" stop-opacity="0.96" />
                <stop offset="100%" stop-color="#9abfe9" stop-opacity="0.82" />
              </radialGradient>
              <radialGradient id="bed-core-glow-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f0f8ff" stop-opacity="0.92" />
                <stop offset="58%" stop-color="#9abfe9" stop-opacity="0.42" />
                <stop offset="100%" stop-color="#5c86f6" stop-opacity="0" />
              </radialGradient>
            </defs>
            <circle class="bed-stats-card__core-glow-halo" cx="18" cy="18" r="16" />
            <path class="bed-stats-card__core-glow-long-ray" d="M18 0.9 20.1 12.4 31.7 18 20.1 23.6 18 35.1 15.9 23.6 4.3 18 15.9 12.4 18 0.9Z" />
            <path class="bed-stats-card__core-glow-main" d="M18 5.8 23.5 13.4 31.9 18 23.5 22.6 18 30.2 12.5 22.6 4.1 18 12.5 13.4 18 5.8Z" />
            <path class="bed-stats-card__core-glow-core" d="M18 10.9 21.3 15.5 26.1 18 21.3 20.5 18 25.1 14.7 20.5 9.9 18 14.7 15.5 18 10.9Z" />
            <path class="bed-stats-card__core-glow-stroke" d="M18 5.2V0.8M18 35.2V30.8M5.2 18H0.8M35.2 18H30.8M9.1 9.1 5.7 5.7M30.3 30.3 26.9 26.9M26.9 9.1 30.3 5.7M5.7 30.3 9.1 26.9" />
          </svg>
        </span>
      </div>
      <div class="bed-stats-card__side bed-right-bg">
        <div class="bed-info-row bed-info-row--occupied">
          <span class="bed-info-arrow" aria-hidden="true"></span>
          <span class="bed-info-label bed-overview-label">已用床位</span>
          <strong class="bed-info-value bed-info-value--occupied">{{ formatBedValue(occupiedBeds) }}</strong>
        </div>
        <div class="bed-info-row bed-info-row--empty">
          <span class="bed-info-arrow" aria-hidden="true"></span>
          <span class="bed-info-label bed-overview-label">空床位</span>
          <strong class="bed-info-value bed-info-value--empty">{{ formatBedValue(emptyBeds) }}</strong>
        </div>
      </div>
    </div>
  </screen-card>
</template>

<script>
import ScreenCard from '../common/ScreenCard.vue'
import houseIcon from '../../assets/house.png'
import { formatNumber, toSafeNumber } from '../../utils/number'

export default {
  name: 'BedStatsCard',
  components: {
    ScreenCard,
  },
  data() {
    return {
      houseIcon,
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    totalBeds() {
      return toSafeNumber(this.data.totalBeds, 0)
    },
    validBeds() {
      return toSafeNumber(this.data.validBeds, 0)
    },
    summaryMetrics() {
      return [
        { label: '总床位数', value: this.totalBeds },
        { label: '有效床位', value: this.validBeds },
      ]
    },
    occupiedBeds() {
      return toSafeNumber(this.data.occupiedBeds, 0)
    },
    emptyBeds() {
      return toSafeNumber(this.data.emptyBeds, 0)
    },
  },
  methods: {
    formatBedValue(value) {
      return formatNumber(value)
    },
  },
}
</script>

<style scoped>
@font-face {
  font-family: "SourceHanSansSC";
  src: url("/SourceHanSansSC-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.bed-stats-card {
  min-height: 146px;
}

.bed-stats-card__summary {
  position: relative;
  display: block;
  height: 25px;
  margin: 2px 0 12px;
}

.bed-stats-card__summary-item {
  position: absolute;
  top: -10px;
  display: block;
  width: 148px;
  height: 38px;
  min-height: 0;
  padding: 0;
  background-image: var(--house-bg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  border: 0;
  box-shadow: none;
}

.bed-stats-card__summary-item--total {
  left: 0;
}

.bed-stats-card__summary-item--valid {
  left: 164px;
}

.bed-stats-card__summary-label {
  position: absolute;
  top: 12px;
  z-index: 2;
  width: 40.46px;
  height: 13.44px;
  min-width: 0;
  color: #c0d2f1;
  font-family: "Source Han Sans CN", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  white-space: nowrap;
  text-shadow: none;
}

.bed-stats-card__summary-value {
  position: absolute;
  top: 11px;
  z-index: 2;
  width: 42.14px;
  height: 19.32px;
  color: #ffffff;
  font-family: "DIN Alternate", "DIN", "Arial", sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  text-align: right;
  white-space: nowrap;
  text-shadow: none;
}

.bed-overview-top-label {
  color: #c0d2f1;
  font-size: 13px;
  text-shadow: 0 0 4px rgba(103, 179, 255, 0.35);
}

.bed-overview-top-value {
  color: transparent;
  background: linear-gradient(180deg, #ffffff 0%, #e4f3ff 35%, #9fd4ff 70%, #67b3ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow:
    0 0 4px rgba(140, 205, 255, 0.45),
    0 0 8px rgba(72, 148, 240, 0.22);
}

.bed-overview-label {
  font-family: SourceHanSansSC, SourceHanSansSC;
}

.bed-stats-card__summary-item--total .bed-stats-card__summary-label {
  left: 32.22px;
}

.bed-stats-card__summary-item--total .bed-stats-card__summary-value {
  left: 97.59px;
}

.bed-stats-card__summary-item--valid .bed-stats-card__summary-label {
  left: 32.22px;
}

.bed-stats-card__summary-item--valid .bed-stats-card__summary-value {
  left: 97.59px;
}

.bed-stats-card__content {
  position: relative;
  display: flex;
  align-items: center;
  width: 308px;
  height: 92px;
  margin-top: -4px;
}

.bed-stats-card__middle-bg {
  position: absolute;
  left: 0;
  top: -16px;
  z-index: 0;
  width: 308px;
  height: 118px;
  pointer-events: none;
  background-image: url("../../assets/编组(1).png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.9;
}

.bed-stats-card__visual {
  position: relative;
  z-index: 1;
  flex: 0 0 126px;
  width: 126px;
  height: 72px;
  overflow: hidden;
}

.bed-stats-card__ring {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.bed-stats-card__ring,
.bed-stats-card__scanner {
  display: none;
}

.bed-stats-card__ring--outer {
  width: 112px;
  height: 54px;
  border: 2px solid rgba(94, 203, 255, 0.42);
  box-shadow:
    0 0 18px rgba(72, 192, 255, 0.32),
    inset 0 0 20px rgba(79, 173, 234, 0.18);
}

.bed-stats-card__ring--middle {
  width: 76px;
  height: 36px;
  border: 2px solid rgba(115, 220, 255, 0.5);
}

.bed-stats-card__ring--inner {
  width: 30px;
  height: 14px;
  background: rgba(95, 203, 255, 0.42);
  box-shadow: 0 0 18px rgba(95, 203, 255, 0.72);
}

.bed-stats-card__scanner {
  position: absolute;
  left: 50%;
  bottom: 14px;
  width: 88px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(91, 200, 255, 0.42), rgba(91, 200, 255, 0.04) 70%);
  transform: translateX(-50%);
}

.bed-stats-card__core-glow {
  position: absolute;
  left: 49px;
  top: 5px;
  z-index: 2;
  display: block;
  width: 36px;
  height: 36px;
  mix-blend-mode: screen;
}

.bed-stats-card__core-glow::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  background: radial-gradient(34% 34% at 50% 50%, #f0f8ff 0%, #9abfe9 100%);
  border-radius: 50%;
  box-shadow:
    0 0 18px 0 rgba(92, 134, 246, 0.72),
    0 0 34px 0 rgba(92, 134, 246, 0.48);
  transform: translate(-50%, -50%);
}

.bed-stats-card__core-glow-svg {
  position: relative;
  z-index: 1;
  display: block;
  width: 36px;
  height: 36px;
  overflow: visible;
}

.bed-stats-card__core-glow-halo {
  fill: url("#bed-core-glow-halo");
  opacity: 0.48;
}

.bed-stats-card__core-glow-long-ray {
  fill: rgba(191, 218, 255, 0.26);
  filter: drop-shadow(0 0 5px rgba(92, 134, 246, 0.52));
}

.bed-stats-card__core-glow-main {
  fill: url("#bed-core-glow-main");
  filter:
    drop-shadow(0 0 2px rgba(240, 248, 255, 0.78))
    drop-shadow(0 0 6px rgba(92, 134, 246, 0.58));
}

.bed-stats-card__core-glow-core {
  fill: rgba(244, 251, 255, 0.74);
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.72));
}

.bed-stats-card__core-glow-stroke {
  fill: none;
  stroke: rgba(207, 230, 255, 0.82);
  stroke-width: 3;
  stroke-linecap: round;
  filter: drop-shadow(0 0 3px rgba(116, 169, 255, 0.52));
}

.bed-stats-card__side {
  position: absolute;
  left: 164px;
  right: 0;
  top: -7px;
  z-index: 1;
  display: block;
  height: 106px;
  padding: 0;
  background: transparent;
}

.bed-info-row {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 26px;
}

.bed-info-row--occupied {
  top: 16px;
}

.bed-info-row--empty {
  top: 71px;
}

.bed-info-arrow {
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  margin-right: 7px;
  align-self: center;
  flex-shrink: 0;
}

.bed-info-label {
  flex: 0 0 auto;
  color: #c0d2f1;
  font-family: "Source Han Sans CN", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-shadow: none;
}

.bed-info-value {
  flex: 0 0 auto;
  margin-left: auto;
  color: #e4eeff;
  font-size: 18px;
  line-height: 1;
  text-align: right;
  white-space: nowrap;
  text-shadow: none;
}

.bed-info-value--occupied {
  font-family: "DIN Alternate", "DIN", "Arial", sans-serif;
  font-weight: 700;
}

.bed-info-value--empty {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 600;
}
</style>
