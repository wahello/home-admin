export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    name: '首页',
    icon: 'dashboard',
    component: './dashboard',
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'setting',
    routes: [
      {
        path: '/system/user/list',
        name: '用户管理',
        component: './system/user/list',
        icon: 'user',
      },
      {
        path: '/system/role/list',
        name: '角色管理',
        component: './system/role/list',
        icon: 'team',
      },
      {
        path: '/system/permission/list',
        name: '权限管理',
        component: './system/permission/list',
        icon: 'safety',
      },
      {
        path: '/system/menu/list',
        name: '菜单管理',
        component: './system/menu/list',
        icon: 'menu',
      },
    ],
  },
  {
    path: '/order',
    name: '订单管理',
    icon: 'project',
    routes: [
      {
        path: '/order/list',
        name: '订单列表',
        component: './order/list',
        icon: 'project',
      },
      {
        path: '/order/detail',
        name: '订单详情',
        component: './order/detail',
        hideInMenu: true,
      },
      {
        redirect: '/order/list',
      },
    ],
  },
  {
    path: '/shop',
    name: '店铺管理',
    icon: 'shop',
    routes: [
      {
        path: '/shop/diy',
        name: '首页装修',
        icon: 'bg-colors',
        component: './shop/diy',
      },
      {
        path: '/shop/service-category',
        name: '服务分类',
        icon: 'tags',
        routes: [
          {
            path: '/shop/service-category',
            redirect: '/shop/service-category/list',
          },
          {
            path: '/shop/service-category/list',
            name: '服务分类列表',
            component: './shop/service/category/list',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/shop/service-tag',
        name: '服务标签',
        icon: 'tags',
        routes: [
          {
            path: '/shop/service-tag',
            redirect: '/shop/service-tag/list',
          },
          {
            path: '/shop/service-tag/list',
            name: '服务标签列表',
            component: './shop/service/tag/list',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/shop/service',
        name: '服务管理',
        icon: 'appstore',
        routes: [
          {
            path: '/shop/service',
            redirect: '/shop/service/list',
          },
          {
            path: '/shop/service/list',
            name: '服务列表',
            component: './shop/service/list',
            hideInMenu: true,
          },
          {
            path: '/shop/service/add',
            name: '新增服务',
            component: './shop/service/form',
            hideInMenu: true,
          },
          {
            path: '/shop/service/edit',
            name: '修改服务',
            component: './shop/service/form',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/shop/album',
        name: '相册管理',
        icon: 'picture',
        component: './shop/album/index',
      },
    ],
  },
  {
    path: '/promotion',
    name: '营销管理',
    icon: 'gift',
    routes: [
      {
        path: '/promotion/coupon',
        name: '优惠券管理',
        icon: 'red-envelope',
        routes: [
          {
            path: '/promotion/coupon',
            redirect: '/promotion/coupon/list',
          },
          {
            path: '/promotion/coupon/list',
            component: './promotion/coupon/list',
            hideInMenu: true,
            name: '优惠券列表',
          },
          {
            path: '/promotion/coupon/add',
            name: '新增优惠券',
            component: './promotion/coupon/form',
            hideInMenu: true,
          },
          {
            path: '/promotion/coupon/edit',
            name: '修改优惠券',
            component: './promotion/coupon/form',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
