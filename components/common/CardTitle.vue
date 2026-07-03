<template>
  <div class="dorm-card-title" :class="titleClass">
    <span class="dorm-card-title__image" aria-hidden="true"></span>
    <span class="dorm-card-title__text">{{ title }}</span>
    <div class="dorm-card-title__actions">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    titleClass() {
      const titleClassMap = {
        床位统计概览: 'dorm-card-title--bed-stats',
        人员入住情况: 'dorm-card-title--occupancy',
        事业部在宿人数: 'dorm-card-title--department',
        人员流动趋势: 'dorm-card-title--flow',
      }
      return titleClassMap[this.title] || ''
    },
  },
}
</script>

<style scoped>
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

.dorm-card-title--bed-stats .dorm-card-title__image {
  width: 115px;
  height: 15px;
  background-image: url("../../assets/床位统计概览@2x.png");
}

.dorm-card-title--occupancy .dorm-card-title__image {
  width: 115px;
  height: 15px;
  background-image: url("../../assets/人员入住情况@2x.png");
}

.dorm-card-title--department .dorm-card-title__image {
  width: 137px;
  height: 21px;
  background-image: url("../../assets/事业部在宿人数@2x(1).png");
}

.dorm-card-title--flow .dorm-card-title__image {
  width: 118px;
  height: 21px;
  background-image: url("../../assets/人员流动趋势@2x.png");
}

.dorm-card-title__actions {
  flex: 0 0 auto;
  margin-left: auto;
}
</style>
