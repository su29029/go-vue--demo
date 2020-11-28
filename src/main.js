import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import request from './request'
import { store } from './store/store'

import { imgsPreloader } from './config/imgPreloader.js';
import imgPreloaderList from './config/imgPreloaderList.js';

Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.use(axios)
Vue.use(router)


axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
    console.log(config);
    return config;
});

axios.interceptors.response.use(response => {
    console.log(response);
    return response;
});

(async() => {
    await imgsPreloader(imgPreloaderList);
    new Vue({
        el: "#app",
        router,
        axios,
        store,
        request,
        render: h => h(App),
    }).$mount('#app')
})();