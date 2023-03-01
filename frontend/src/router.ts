import { createRouter, createWebHistory } from 'vue-router';
import TestHome from './pages/TestHome.vue';
import TestAbout from './pages/TestAbout.vue';

const routes = [
    { path: '/', component: TestHome },
    { path: '/about', component: TestAbout },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
