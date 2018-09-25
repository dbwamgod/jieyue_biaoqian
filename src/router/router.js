import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    title:'标签平台',
    redirect: '/typeFirst',
    component: Main,
    children: [
        {path: 'typeFirst', title: '一级分类', name: 'home_index', component: () => import('@/views/home/home.vue')},
        {path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue')}
    ],
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    //二级分类
    {
        path: '/typeSecond', icon: 'key', name: 'typeSecond', title: '分类管理', component: Main,
        children: [
            {path: 'index', title: '二级分类', name: 'typeSecond_index', component: () => import('@/views/type_second/type_second.vue')},
        ]
    },
    //标签管理
    {
        path: '/Tab_management', icon: 'lock-combination', title: '标签管理', name: 'Tab_management', component: Main,
        children: [
            {path: 'index', title: '标签管理', name: 'Tab_management_index', component: () => import('@/views/tabManagement/tab_management.vue')},
        ]
    },
    //international
    {
        path: '/international',
        icon: 'earth',
        title: {i18n: 'international'},
        name: 'international',
        component: Main,
        children: [
            {
                path: 'index',
                title: {i18n: 'international'},
                name: 'international_index',
                component: () => import('@/views/international/international.vue')
            }
        ]
    },
    //产品管理
    {
        path: '/product_management', icon: 'key', name: 'product_management', title: '产品管理', component: Main,
        children: [
            {path: 'index', title: '产品管理', name: 'product_management_index', component: () => import('@/views/productManagement/product_management.vue')},
            {path: 'check_product', title: '产品信息', name: 'check_product', component: () => import('@/views/productManagement/check_product.vue')},
            {path: 'new_product', title: '新建产品', name: 'new_product', component: () => import('@/views/productManagement/new_product.vue')},
            {path: 'edit_product', title: '编辑产品', name: 'edit_product', component: () => import('@/views/productManagement/edit_product.vue')},
        ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
