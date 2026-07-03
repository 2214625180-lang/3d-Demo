<template>
  <div
    class="dorm-metric-item"
    :class="[
      'dorm-metric-item--' + tone,
      {
        'dorm-metric-item--compact': compact,
        'dorm-metric-item--stacked': stacked,
      },
    ]"
  >
    <span class="dorm-metric-item__label">{{ label }}</span>
    <strong class="dorm-metric-item__value">
      {{ prefix }}{{ displayValue }}<small v-if="suffix">{{ suffix }}</small>
    </strong>
  </div>
</template>

<script>
import { formatNumber } from '../../utils/number'

export default {
  name: 'MetricItem',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    suffix: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      default: '',
    },
    tone: {
      type: String,
      default: 'default',
    },
    compact: {
      type: Boolean,
      default: false,
    },
    stacked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    displayValue() {
      if (typeof this.value === 'number') {
        return formatNumber(this.value)
      }

      return this.value
    },
  },
}
</script>

<style scoped>
.dorm-metric-item {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 30px;
  padding: 5px 8px;
  color: #cfeaff;
  background: linear-gradient(90deg, rgba(42, 111, 174, 0.18), rgba(20, 52, 93, 0.12));
  border-bottom: 1px solid rgba(114, 188, 238, 0.2);
}

.dorm-metric-item__label {
  flex: 0 0 auto;
  font-size: 12px;
  line-height: 1.2;
  color: #d8f1ff;
}

.dorm-metric-item__value {
  min-width: 0;
  color: #f4fbff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  text-align: right;
  text-shadow: 0 0 9px rgba(76, 176, 255, 0.58);
}

.dorm-metric-item__value small {
  margin-left: 2px;
  font-size: 11px;
  font-weight: 500;
  color: #a9d7f5;
}

.dorm-metric-item--compact {
  min-height: 26px;
  padding: 4px 8px;
}

.dorm-metric-item--compact .dorm-metric-item__value {
  font-size: 14px;
}

.dorm-metric-item--warning .dorm-metric-item__value {
  color: #ffe08a;
  text-shadow: 0 0 9px rgba(255, 190, 70, 0.55);
}

.dorm-metric-item--success .dorm-metric-item__value {
  color: #48f5d4;
  text-shadow: 0 0 9px rgba(72, 245, 212, 0.45);
}

.dorm-metric-item--stacked {
  display: block;
  min-height: 48px;
  padding: 6px 4px;
  text-align: center;
  border: 1px solid rgba(108, 181, 232, 0.28);
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(55, 110, 162, 0.38), rgba(10, 31, 59, 0.72));
}

.dorm-metric-item--stacked .dorm-metric-item__label,
.dorm-metric-item--stacked .dorm-metric-item__value {
  display: block;
  text-align: center;
}

.dorm-metric-item--stacked .dorm-metric-item__label {
  margin-top: 3px;
  font-size: 10px;
}

.dorm-metric-item--stacked .dorm-metric-item__value {
  margin-bottom: 3px;
  font-size: 18px;
}
</style>
