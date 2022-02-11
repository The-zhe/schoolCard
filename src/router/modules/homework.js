export default [
    {
        path: '/classWork',
        name: 'classWork',//课上作业
        component: ()=>import("@/views/homework/classWork")
    },
    {
        path: '/workDetail',
        name: 'workDetail',//课上作业
        component: ()=>import("@/views/homework/classWork/workDetail")
    },
    {
        path: '/homeworkTo',
        name: 'homeworkTo',//布置作业
        component: ()=>import("@/views/homework/homeworkTo")
    },
    {
        path: '/newHomework',
        name: 'newHomework',//新建作业
        component: ()=>import("@/views/homework/homeworkTo/newHomework")
    },
    {
        path: '/newAnswerCard',
        name: 'newAnswerCard',//新建答题卡
        component: ()=>import("@/views/homework/homeworkTo/newAnswerCard")
    },
    {
        path: '/cardself',
        name: 'cardself',//自主添加答题卡
        component: ()=>import("@/views/homework/homeworkTo/cardself")
    },
    {
        path: '/afterClassWork',
        name: 'afterClassWork',//课下作业
        component: ()=>import("@/views/homework/afterClassWork")
    },
    {
        path: '/afterWorkDetail',
        name: 'afterWorkDetail',//课下作业详情
        component: ()=>import("@/views/homework/afterClassWork/afterWorkDetail")
    },
    {
        path: '/checkWork',
        name: 'checkWork',//查看、批改课下作业
        component: ()=>import("@/views/homework/afterClassWork/checkWork")
    },
    {
        path: '/afterWorkCard',
        name: 'afterWorkCard',//课下---作业答题卡
        component: ()=>import("@/views/homework/afterClassWork/afterWorkCard")
    },
    {
        path: '/lessonPlan',
        name: 'lessonPlan',//教案管理
        component: ()=>import("@/views/homework/lessonPlan")
    },
    {
        path: '/teachPlan',
        name: 'teachPlan',//教案和反思
        component: ()=>import("@/views/homework/lessonPlan/teachPlan")
    },
]