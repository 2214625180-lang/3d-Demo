<template>
  <section class="dorm-screen-card" v-bind="$attrs">
    <card-title :title="title">
      <slot name="actions"></slot>
    </card-title>
    <div class="dorm-screen-card__body" :class="bodyClass">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import CardTitle from './CardTitle.vue'

export default {
  name: 'ScreenCard',
  inheritAttrs: false,
  components: {
    CardTitle,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    bodyClass: {
      type: [String, Array, Object],
      default: '',
    },
  },
}
</script>

<style scoped>
.dorm-screen-card {
  position: relative;
  width: 329px;
  padding: 12px 10px 11px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(58, 136, 194, 0.16), rgba(5, 18, 38, 0.74) 42%, rgba(4, 24, 47, 0.86)),
    rgba(6, 24, 48, 0.72);
  border: 1px solid rgba(92, 183, 245, 0.38);
  border-radius: 4px;
  box-shadow:
    0 0 22px rgba(23, 145, 231, 0.28),
    inset 0 0 18px rgba(71, 178, 252, 0.16);
}

.dorm-screen-card::before {
  content: "";
  position: absolute;
  pointer-events: none;
}

.dorm-screen-card::before {
  left: -1px;
  top: 0;
  width: 347px;
  height: 51px;
  background-image: url("../../assets/编组 12@2x.png");
  background-repeat: no-repeat;
  background-size: 347px 51px;
  border: 0;
  opacity: 1;
}

.dorm-screen-card__body {
  position: relative;
  z-index: 1;
}
</style>
