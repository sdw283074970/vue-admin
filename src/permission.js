import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 路由守卫
// 在转换路由之前，将之前从服务器授权的token拿出来与服务器校验。如果不存在token或者token过期，则强制重新登陆获得授权
// 同时刷新储存在store中的用户信息
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // alert('2. 被路由守卫捕获，开始身份验证')
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  // alert('3. 检查Cookie中是否在Token')

  if (store.getters.token) {
    // alert('4. 检测到token: ' + hasToken)
    // alert('5. 检查是否获取用户信息')

    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // var hasGetUserInfo = store.getters.name
      var roles = store.getters.roles
      // alert('当前用户名：' + store.getters.name + ' 当前角色：' + store.getters.roles)

      if (store.getters.roles.length === 0) {
        // alert('6. 未检测到完整用户信息 用户名：' + store.getters.name + ' 角色：' + store.getters.roles)
        try {
          // alert('7. 尝试获取用户信息')
          // get user info
          store.dispatch('user/getInfo').then(() => {
            // alert('8. 重新赋值用户信息 用户名：' + store.getters.name + ' 角色：' + store.getters.roles)
            // 生成并挂载动态路由表
            roles = store.getters.roles
            store.dispatch('permission/generateRoutes', { roles }).then(() => {
              // alert('10. 开始动态挂载路由 权限角色：' + store.getters.roles)
              // alert('11. 路由列表如下：' + JSON.stringify(store.getters.addRouters))
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              router.options.routes = store.getters.routers
              // next()
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          }).catch(err => {
            console.log(err)
          })
        } catch (error) {
          // remove token and go to login page to re-login
          // alert('8. 未查询到用户信息，重置cookie中的token')
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    /* has no token*/
    // alert('未检测到token 请重新登陆')
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
