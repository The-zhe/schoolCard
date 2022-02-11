export default [
    {
        path: '/exam/examItem',
        name: 'examItem',//试卷管理
        component: () => import("@/views/exam/examItem")
    },
    {
        path: '/exam/examItem/answerCard',
        name: 'answerCard',//答题卡
        component: () => import("@/views/exam/examItem/answerCard")
    },
    {
        path: '/exam/testDetail',
        name: 'testDetail',//试题详情
        component: () => import("@/views/exam/testDetail")
    },
    {
        path: '/cardEdit',
        name: 'cardEdit',//试题详情
        component: () => import("@/views/exam/examItem/cardEdit")
    },
    {
        path: '/simpleTest',
        name: 'simpleTest',//试题详情
        component: () => import("@/views/exam/examItem/simpleTest")
    },
]