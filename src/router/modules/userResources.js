export default [
  {
    path: '/resources/teachMould',
    name: 'teachMould',//教学模板
    component: () => import("@/views/teachMould/index"),
    redirect: '/resources/teachMould/my',
    children: [
      {
        path: '/resources/teachMould/my',
        meta: {
          title: '我的模板'
        },
        name: 'teachMould-my',
        component: () => import("@/views/teachMould/my")
      },
      {
        path: '/resources/teachMould/system',
        meta: {
          title: '系统模板'
        },
        name: 'teachMould-system',
        component: () => import("@/views/teachMould/system")
      },
    ]
  },
  {
    path: '/resources/teachMould/edit',
    meta: {
      title: '编辑模板'
    },
    name: 'teachMould-edit',
    component: () => import("@/views/teachMould/edit")
  },
]