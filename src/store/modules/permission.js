import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

const state = {
  routers: constantRoutes,
  addRouters: []
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRoutes.concat(routers)
  }
}

const actions = {
  generateRoutes({ commit }, data) {
    // alert('9. 开始生成动态路由表')
    return new Promise(resolve => {
      const { roles } = data
      // alert('原始路由表长度：' + asyncRoutes.length)
      const accessedRouters = asyncRoutes.filter(v => {
        // 如果角色中有admin
        if (roles.indexOf('admin') >= 0) return true

        if (hasPermission(roles, v)) {
          if (v.children && v.children.length > 0) {
            v.children = v.children.filter(child => {
              if (hasPermission(roles, child)) {
                return child
              }
              return false
            })
            return v
          } else {
            return v
          }
        }
        return false
      })
      // const accessedRouters = asyncRoutes
      // alert('过滤后路由表长度：' + accessedRouters.length)
      commit('SET_ROUTERS', accessedRouters)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

