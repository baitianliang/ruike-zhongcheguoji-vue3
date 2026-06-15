import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: '导航页',
        component: () => import('../views/home.vue'),
        meta: {
            hidden: true
        }
    },
    {
        path: '/directorDashboard',
        name: '登录首页（项目总监）',
        component: () => import('../views/directorDashboard.vue')
    },
    {
        path: '/projectDirector',
        name: '项目总监',
        component: () => import('../views/projectDirector.vue')
    },
    {
        path: '/newProjectDirector',
        name: '新项目总监',
        component: () => import('../views/projectDirector2.vue')
    },
    {
        path: '/managerDashboard',
        name: '部门经理登录首页',
        component: () => import('../views/managerDashboard.vue')
    },
    {
        path: '/personalDashboard',
        name: '个人工作台',
        component: () => import('../views/personalDashboard.vue')
    },
    {
        path: '/projectInit',
        name: '项目初始化中心',
        component: () => import('../views/projectInit.vue')
    },
    {
        path: '/subcontractorDashboard',
        name: '分包商登录首页',
        component: () => import('../views/subcontractorDashboard.vue')
    },
    {
        path: '/interfacesDashboard',
        name: '接口管理看板',
        component: () => import('../views/interfacesDashboard.vue')
    },
    {
        path: '/GanttPage',
        name: '甘特图操作页',
        component: () => import('../views/ganttPage.vue')
    },
    {
        path: '/GanttShow',
        name: '甘特图展示页',
        component: () => import('../views/ganttPage.vue')
    },
    {
        path: '/dliverables',
        name: '交付物看板',
        component: () => import('../views/dliverablesPage.vue')
    },
    {
        path: '/newDliverables',
        name: '新交付物看板',
        component: () => import('../views/dliverablesPage2.vue')
    },
    {
        path: '/qingdan',
        name: '交付物清单',
        component: () => import('../views/qingdanPage.vue')
    },
    {
        path: '/demandMatrix',
        name: '需求矩阵',
        component: () => import('../views/demandMatrix.vue')
    },
    {
        path: '/customTable',
        name: '自定义表格',
        component: () => import('../views/customTable.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
