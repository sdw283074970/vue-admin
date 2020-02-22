import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // }
]

export const asyncRoutes = [
  {
    path: '/customer',
    component: Layout,
    meta: { title: 'Customer', icon: 'user', role: ['office', 'accounting', 'TBD'] },
    children: [
      {
        path: 'index',
        name: 'Customer',
        component: () => import('@/views/officeview/customer/index'),
        meta: { title: 'Customer', icon: 'user', role: ['office', 'accounting', 'TBD'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: 'User', icon: 'user', role: ['office', 'accounting'] },
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/officeview/user/index'),
        meta: { title: 'User', icon: 'user', role: ['office', 'accounting'] }
      }
    ]
  },
  {
    path: '/receiving',
    component: Layout,
    name: 'Receiving',
    meta: { title: 'Receiving Orders', icon: 'table', role: ['office', 'accounting', 'TBD'] },
    children: [
      {
        path: 'index',
        name: 'Receiving Overview',
        component: () => import('@/views/officeview/receiving/index'),
        meta: { title: 'Receiving', icon: 'table' }
      },
      {
        path: '/receiving/receiving-wo/:masterOrderId',
        name: 'ReceivingWO',
        component: () => import('@/views/officeview/receiving/receiving-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  {
    path: '/shipping',
    component: Layout,
    name: 'shipping',
    meta: { title: 'Shipping Orders', icon: 'table', role: ['office', 'accounting', 'TBD'] },
    children: [
      {
        path: 'index',
        name: 'Shipping Overview',
        component: () => import('@/views/officeview/shipping/index'),
        meta: { title: 'Shipping', icon: 'table' }
      },
      {
        path: '/shipping/shipping-wo/:shipOrderId',
        name: 'ShippingWO',
        component: () => import('@/views/officeview/shipping/shipping-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  {
    path: '/reports',
    component: Layout,
    name: 'Reports',
    meta: { title: 'Reports', icon: 'table', role: ['office', 'accounting', 'TBD'] },
    children: [
      {
        path: '/reports/inventory/index',
        name: 'InventoryReport',
        component: () => import('@/views/shareview/inventory/location'),
        meta: { title: 'Inventory Report', icon: 'table' }
      },
      {
        path: '/reports/expenses/index',
        name: 'ExpensesReport',
        component: () => import('@/views/officeview/reports/expenses/index'),
        meta: { title: 'Expenses Report', icon: 'table' }
      }
    ]
  },
  // {
  //   path: '/accounting',
  //   component: Layout,
  //   name: 'Accounting',
  //   meta: { title: 'Accounting', icon: 'table', role: ['office', 'accounting', 'TBD'] },
  //   children: [
  //     {
  //       path: '/accounting/storage/index',
  //       name: 'Storage',
  //       component: () => import('@/views/accountingview/accounting/storage/index'),
  //       meta: { title: 'Storage', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/addressbook',
  //   component: Layout,
  //   meta: { title: 'Address Book', icon: 'table', role: ['office', 'accounting', 'TBD'] },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'AddressBook',
  //       component: () => import('@/views/shareview/addressbook/index'),
  //       meta: { title: 'Address Book', icon: 'table', role: ['office', 'accounting', 'TBD'] }
  //     }
  //   ]
  // },
  {
    path: '/inbound',
    component: Layout,
    name: 'Inbound Overview',
    meta: { title: 'Inbound Orders', icon: 'table', role: ['customer'] },
    children: [
      {
        path: 'index',
        name: 'Inbound Orders Overview',
        component: () => import('@/views/customerview/inbound/index'),
        meta: { title: 'My Inbound Orders', icon: 'table' }
      },
      {
        path: '/inbound/inbound-wo/:masterOrderId',
        name: 'InboundWO',
        component: () => import('@/views/customerview/inbound/inbound-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  {
    path: '/outbound',
    component: Layout,
    name: 'Outbound',
    meta: { title: 'Outbound Orders', icon: 'table', role: ['customer'] },
    children: [
      {
        path: 'index',
        name: 'Outbound Overview',
        component: () => import('@/views/customerview/outbound/index'),
        meta: { title: 'My Outbound Orders', icon: 'table' }
      },
      {
        path: '/outbound/outbound-wo/:shipOrderId',
        name: 'OutboundWO',
        component: () => import('@/views/customerview/outbound/outbound-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  {
    path: '/MyInventory',
    component: Layout,
    name: 'My Inventory',
    meta: { title: 'My Inventory', icon: 'table', role: ['office', 'customer'] },
    children: [
      {
        path: 'location',
        name: 'Location View',
        component: () => import('@/views/shareview/inventory/location'),
        meta: { title: 'Location View', icon: 'table' }
      },
      {
        path: 'sku',
        name: 'SKU Statistics',
        component: () => import('@/views/shareview/inventory/sku'),
        meta: { title: 'SKU Statistics', icon: 'table' }
      }
    ]
  },
  {
    path: '/tutorial',
    component: Layout,
    name: 'Customer Tutorial',
    meta: { title: 'Tutorial', icon: 'table', role: ['customer'] },
    children: [
      {
        path: 'inbound',
        name: 'Inbound Tutorial',
        component: () => import('@/views/customerview/tutorial/inbound'),
        meta: { title: 'Inbound', icon: 'table' }
      },
      {
        path: 'outbound',
        name: 'Outbound Tutorial',
        component: () => import('@/views/customerview/tutorial/outbound'),
        meta: { title: 'Outbound', icon: 'table' }
      },
      {
        path: 'inventory',
        name: 'Inventory Tutorial',
        component: () => import('@/views/customerview/tutorial/inventory'),
        meta: { title: 'Inventory', icon: 'table' }
      }
    ]
  },
  {
    path: '/warehouse-receiving',
    component: Layout,
    name: 'Warehouse Receiving',
    meta: { title: 'Receiving Orders', icon: 'table', role: ['office', 'accounting', 'TBD', 'warehouse'] },
    children: [
      {
        path: 'index',
        name: 'Warehouse Receiving Overview',
        component: () => import('@/views/warehouseview/receiving/index'),
        meta: { title: 'WHS Receiving', icon: 'table' }
      },
      {
        path: '/warehouse-receiving/receiving-wo/:masterOrderId',
        name: 'Warehouse Receiving WO',
        component: () => import('@/views/warehouseview/receiving/receiving-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  {
    path: '/warehouse-shipping',
    component: Layout,
    name: 'Warehouse Shipping',
    meta: { title: 'Shipping Orders', icon: 'table', role: ['office', 'accounting', 'TBD', 'warehouse'] },
    children: [
      {
        path: 'index',
        name: 'Warehouse Shipping Overview',
        component: () => import('@/views/warehouseview/shipping/index'),
        meta: { title: 'WHS Shipping', icon: 'table' }
      },
      {
        path: '/warehouse-shipping/shipping-wo/:shipOrderId',
        name: 'Warehouse shipping WO',
        component: () => import('@/views/warehouseview/shipping/shipping-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  {
    path: '/accounting-receiving',
    component: Layout,
    name: 'Accounting Receiving',
    meta: { title: 'Receiving Orders', icon: 'table', role: ['accounting'] },
    children: [
      {
        path: 'index',
        name: 'Accounting Receiving Overview',
        component: () => import('@/views/accountingview/receiving/index'),
        meta: { title: 'ACCT Receiving', icon: 'table' }
      },
      {
        path: '/accounting-receiving/receiving-wo/:masterOrderId',
        name: 'Accounting Receiving WO',
        component: () => import('@/views/accountingview/receiving/receiving-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  {
    path: '/accounting-shipping',
    component: Layout,
    name: 'Accounting Shipping',
    meta: { title: 'Accounting Shipping Orders', icon: 'table', role: ['accounting'] },
    children: [
      {
        path: 'index',
        name: 'Accounting Shipping Overview',
        component: () => import('@/views/accountingview/shipping/index'),
        meta: { title: 'ACCT Shipping', icon: 'table' }
      },
      {
        path: '/accounting-shipping/shipping-wo/:shipOrderId',
        name: 'Accounting shipping WO',
        component: () => import('@/views/accountingview/shipping/shipping-wo'),
        hidden: true,
        meta: { title: 'WO', breadcrumb: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
