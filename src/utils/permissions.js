function hasPermission (permissionRoles, roles) {
  return roles.some(role => {
    return permissionRoles.includes(role)
  })
}

// 生成首页路由
export function generateRouters (asyncRouterMap, permissionRoles) {
  let routerMap = filterAsyncRouter(asyncRouterMap, permissionRoles)
  return routerMap
}

function filterAsyncRouter (asyncRouterMap, permissionRoles) {
  const accessedRouters = []
  asyncRouterMap.forEach(route => {
    if (hasPermission(route.roles, permissionRoles)) {
      if (route.children && route.children.length > 0) {
        route.children = filterAsyncRouter(route.children, permissionRoles)
      }
      accessedRouters.push(route)
    }
  })
  return accessedRouters
}

