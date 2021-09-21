import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// TEMPORÁRIO!

require('axios').defaults.headers.common['Authorization'] = `bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6Ikpvc8OpIENhcmxvcyIsImVtYWlsIjoiam9zZWMuZG9zYW5qb3NAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTYzMjE5MDExMSwiZXhwIjoxNjMyNDQ5MzExfQ.wltuxpJzQHymnqDR1XMJad90IYiQkC1Im26GqmR31B4`

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')