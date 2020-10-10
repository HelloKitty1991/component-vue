import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import elementUI from 'element-ui';
import VueRouter from 'vue-router';
import { BaseMixin, MessageBox } from '..';
import './request';
import App from './App.vue';
import '../index.scss';
// 处理图标
import './icons';

Vue.use(VueRouter);
Vue.use(elementUI);
Vue.use(MessageBox);
Vue.mixin(BaseMixin);

const routes = [{
    path: '/',
    component: App,
}];

const router = new VueRouter({ routes });
// eslint-disable-next-line
new Vue({
    el: '.container',
    router,
});
