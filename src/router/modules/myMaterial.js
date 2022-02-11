export default [
    {
        path:'/myMaterial/activity',
        name:'activity', //教学活动
        component: () => import("@/views/myMaterial/activity")
    },
    {
        path:'/myMaterial/questionBank',
        name:'questionBank', //题库管理
        component: () => import("@/views/myMaterial/questionBank")
    },
    {
        path:'/myMaterial/materialManage',
        name:'materialManage', //素材管理
        component: () => import("@/views/myMaterial/materialManage")
    },
]