import Vue from 'vue'
import VueResource from "vue-resource";
import App from './App.vue'
import './plugins/ant-design-vue.js'

Vue.config.productionTip = false
Vue.prototype.$getProfielUrl = 'http://localhost:8000/user?id='
Vue.use(VueResource);
// Vue.http.options.crossOrigin = true

// Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
// Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
// Vue.http.headers.common['Accept'] = 'application/json, text/plain, */*'
// Vue.http.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin'

new Vue({
  render: h => h(App),
}).$mount('#app')
