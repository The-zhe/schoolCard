export default [
    {
        path: '/lessonPreparation/createPlan',
        name: 'createPlan',//创建方案
        component: ()=>import("@/views/lessonPreparation/createPlan")
    },
    {
        path: '/lessonPreparation/planManagement',
        name: 'planManagement',//方案管理
        component: ()=>import("@/views/lessonPreparation/planManagement")
    },
    { 
        path: '/lessonPreparation/grouping',
        name: 'grouping',//分组
        component: ()=>import("@/views/lessonPreparation/grouping")
    }
]