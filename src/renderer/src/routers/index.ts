import * as VueRouter from 'vue-router';

const pages = import.meta.glob('../pages/**/*.vue', { eager: true });

// 2. 定义一些路由
const routes: VueRouter.RouteRecordRaw[] = [{ path: '/', redirect: '/Home' }];

for (const key in pages) {
    if (Object.prototype.hasOwnProperty.call(pages, key)) {
        const page = pages[key] as { default: VueRouter.RouteComponent };
        if (key.includes('components')) {
            continue;
        }
        const name = key.substring(key.indexOf('/') + 1 + 6, key.lastIndexOf('.'));
        routes.push({
            path: `/${name}`,
            meta: {
                title: page.default.name
            },
            component: page.default
        });
    }
}
console.log(routes);

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes // `routes: routes` 的缩写
});
console.log(router, 'router');

// router.beforeEach((to, _from, next) => {
//     console.log(`[router] ${to.path}`);
//     next();
// });

export default router;
