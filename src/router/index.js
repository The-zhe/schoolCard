import Vue from "vue";
import Router from "vue-router";
import store from '@/store'
import { generateRouters } from '@/utils/permissions'
import lessonPreparation from "./modules/lessonPreparation";
import myMaterial from "./modules/myMaterial"
import Resources from "./modules/userResources"
import Temporary from "./modules/temporary"
import examItem from './modules/examItem'
import homework from './modules/homework'
import { getFILE_URL } from "@/api/admin";

const originalPush = Router.prototype.push;
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

const asyncRouterMap = [
  {
    path: "/",
    redirect: {
      name: "home"
    }
  },
  {
    path: '/main',
    name: 'main',
    component: () => import("@/components/navigation/layout"),
    children: [
      //备课
      {
        path: '/home',
        name: 'home',//主页
        component: () => import("@/views/home")
      },
      // {
      //   path: '/lessonPreparation/planManagement',
      //   name: 'planManagement',//方案管理
      //   component: () => import("@/views/lessonPreparation/planManagement")
      // },
      {
        path: '/modifyPwd',
        name: 'modifyPwd',//主页
        component: () => import("@/views/modifyPwd")
      },
      ...lessonPreparation,
      ...myMaterial,
      ...Resources,
      ...examItem,
      ...homework,
      ...Temporary
    ],
  },
]
/**
 * 基础路由
 * 
 *        
 */
export const constantRoutes = [

  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/login/index")
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import("@/views/login/forget")
  },

  /* {
    path: '/404',
    component: () => import('@/views/exception/404')
  } */
  {
    path: "*", redirect: "/404"
  }

]

// 白名单
export const whiteList = constantRoutes.map(item => {
  return item.path
})

const router = new Router({
  // mode: "history",
  routes: [...constantRoutes, ...asyncRouterMap],
  scrollBehavior () {
    return {
      x: 0,
      y: 0
    };
  }
});

router.beforeEach(async (to, from, next) => {
  const { access_token } = store.state.user
  const { isGenerateRouters } = store.state.user

  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }

  if (access_token) {
    if (!store.state.imgPrefix) {
      const { data } = await getFILE_URL();
      store.commit("setImgPrefix", data);
    }


    return next()
    // 没有生成路由则生成路由
    if (isGenerateRouters) {
      let roles = ['super-admin']
      let appRouters = generateRouters(asyncRouterMap, roles);
      router.addRoutes(appRouters)
      store.commit('GENERATEROUTERS', true)
      return next({ ...to, replace: true })
    } else {
      //访问基础路由跳转
      if (constantRoutes.some((item) => {
        if (to.path == '/404') return false
        return to.path === item.path
      })) {
        return next({ path: '/main', replace: true })
      }
      return next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/login', replace: true })
    }
  }
});

export default router;
