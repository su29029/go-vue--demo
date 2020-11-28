import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Index from '../components/Index'
import Err from '../components/Err'
Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [{
            path: '/',
            component: Index
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/index',
            name: 'Index',
            component: Index
        },
        {
            path: '/*',
            name: 'Err',
            component: Err
        }
    ]
})