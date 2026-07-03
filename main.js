import Vue from 'vue'
import * as echarts from 'echarts'
import DormLeftRegion from './zujian.vue'
import './preview.css'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

new Vue({
  render: (h) => h('div', { class: 'preview-shell' }, [h(DormLeftRegion)]),
}).$mount('#app')
