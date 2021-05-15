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
    component: './order/list',
  },
  {
    path: '/order/detail',
    name: '订单详情',
    component: './order/detail',
    hideInMenu: true,
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
    name: '会员管理',
    path: '/member',
    icon: 'user',
    routes: [
      {
        path: '/member',
        redirect: '/member/dashboard',
      },
      {
        path: '/member/dashboard',
        name: '会员概况',
        icon: 'pie-chart',
        component: './member/dashboard',
      },
      {
        path: '/member/manage',
        name: '会员管理',
        icon: 'team',
        component: './member/manage',
      },
      {
        path: '/member/detail',
        name: '会员详情',
        hideInMenu: true,
        component: './member/detail',
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
      {
        path: '/promotion/group',
        name: '拼团活动',
        icon: 'icon-group',
        routes: [
          {
            path: '/promotion/group',
            redirect: '/promotion/group/list',
          },
          {
            path: '/promotion/group/list',
            component: './promotion/group/list',
            hideInMenu: true,
            name: '拼团活动',
          },
          {
            path: '/promotion/group/add',
            name: '新增拼团',
            component: './promotion/group/form',
            hideInMenu: true,
          },
          {
            path: '/promotion/group/edit',
            name: '修改拼团',
            component: './promotion/group/form',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/promotion/recharge',
        name: '充值礼包',
        icon: 'icon-recharge',
        routes: [
          {
            path: '/promotion/recharge',
            redirect: '/promotion/recharge/list',
          },
          {
            path: '/promotion/recharge/list',
            component: './promotion/recharge/list',
            hideInMenu: true,
            name: '充值礼包',
          },
          {
            path: '/promotion/recharge/add',
            name: '新增充值项',
            component: './promotion/recharge/form',
            hideInMenu: true,
          },
          {
            path: '/promotion/recharge/edit',
            name: '修改充值项',
            component: './promotion/recharge/form',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/promotion/reward',
        name: '消费奖励',
        icon: 'icon-consume-gift',
        routes: [
          {
            path: '/promotion/reward',
            redirect: '/promotion/luck-draw/list',
          },
          {
            path: '/promotion/luck-draw/list',
            component: './promotion/recharge/list',
            hideInMenu: true,
            name: '充值送礼',
          },
          {
            path: '/promotion/recharge/add',
            name: '新增充值项',
            component: './promotion/recharge/form',
            hideInMenu: true,
          },
          {
            path: '/promotion/recharge/edit',
            name: '修改充值项',
            component: './promotion/recharge/form',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/promotion/luck-draw',
        name: '积分抽奖',
        icon: 'icon-game',
        routes: [
          {
            path: '/promotion/luck-draw',
            redirect: '/promotion/luck-draw/list',
          },
          {
            path: '/promotion/luck-draw/list',
            component: './promotion/recharge/list',
            hideInMenu: true,
            name: '充值送礼',
          },
          {
            path: '/promotion/recharge/add',
            name: '新增充值项',
            component: './promotion/recharge/form',
            hideInMenu: true,
          },
          {
            path: '/promotion/recharge/edit',
            name: '修改充值项',
            component: './promotion/recharge/form',
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
