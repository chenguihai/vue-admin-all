import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '/home',
        component: Layout,
        redirect: '/home/home',
        name: 'home',
        meta: {
            title: '首页',
            icon: 'shouye'
        },
        children: [{
            path: 'homepage',
            name: 'homepage',
            component: () =>
                import ('@/views/home/index'),
            meta: {
                title: '首页',
                // icon: 'shouye'
            }
        }]
    },
    //用户管理
    {
        path: '/conduct',
        component: Layout,
        redirect: '/conduct/userlist',
        name: 'conduct',
        meta: {
            title: '用户管理',
            icon: 'yonghuguanli'
        },
        hidden: true,
        children: [{
                path: 'userlist',
                name: 'userlist',
                component: () =>
                    import ('@/views/conduct/userlist/index'),
                meta: {
                    title: '用户列表',
                    // icon: 'yonghuguanli'
                },
                hidden: true,
            },
            {
                path: 'userDetail', //hidden
                name: 'userDetail',
                hidden: true,
                component: () =>
                    import ('@/views/conduct/userlist/userDetail'),
                meta: {
                    title: '用户详情',
                }
            }
        ]
    },
    { //店铺管理
        path: '/Shopconduct',
        component: Layout,
        redirect: '/Shopconduct/shoplist',
        name: 'Shopconduct',
        meta: {
            title: '店铺管理',
            icon: 'dianpu'
        },
        hidden: true,
        children: [{
                path: 'shoplist',
                name: 'shoplist',
                component: () =>
                    import ('@/views/Shopconduct/shoplist/index'),
                meta: {
                    title: '店铺入驻申请',
                },
                hidden: true
            },
            {
                path: 'ShopDetail', //个人
                name: 'ShopDetail',
                component: () =>
                    import ('@/views/Shopconduct/shoplist/ShopDetail'),
                meta: {
                    title: '店铺入驻详情',
                    // type: 'Array'
                },
                hidden: true
            },
            {
                path: 'companyDetail', //企业
                name: 'companyDetail',
                component: () =>
                    import ('@/views/Shopconduct/shoplist/companyDetail'),
                meta: {
                    title: '店铺入驻详情',
                    // type: 'Array'
                },
                hidden: true
            },
            {
                path: 'beenList', //已经入驻店铺
                name: 'beenList',
                component: () =>
                    import ('@/views/Shopconduct/beenlist/index'),
                meta: {
                    title: '店铺列表',
                },
                hidden: true
            },
            {
                path: 'beenShopDetail', //个人
                name: 'beenShopDetail',
                component: () =>
                    import ('@/views/Shopconduct/beenlist/ShopDetail'),
                meta: {
                    title: '已入驻店铺详情',
                    // type: 'Array'
                },
                hidden: true
            },
            {
                path: 'beencompanyDetail', //企业
                name: 'beencompanyDetail',
                component: () =>
                    import ('@/views/Shopconduct/beenlist/companyDetail'),
                meta: {
                    title: '已入驻店铺详情',
                    // type: 'Array'
                },
                hidden: true
            },
            {
                path: 'mediacompany',
                name: 'mediacompany',
                component: () =>
                    import ('@/views/Shopconduct/media-company'),
                meta: {
                    title: '店铺隶属媒体公司',
                },
                hidden: true
            },
            {
                path: 'mediaQua',
                name: 'mediaQua',
                component: () =>
                    import ('@/views/Shopconduct/mediaQua'),
                meta: {
                    title: '店铺媒介资质',
                },
                hidden: true
            }
        ]
    },
    { //内容管理
        path: '/cms',
        component: Layout,
        redirect: '/cms/shoplist',
        name: 'cms',
        hidden: true,
        meta: {
            title: '内容管理',
            icon: 'neirongguanli'
        },
        children: [{
                path: 'advertManage',
                name: 'advertManage',
                component: () =>
                    import ('@/views/cms/advertManage'),
                meta: {
                    title: '广告线索管理',
                },
                hidden: true
            },
            {
                path: 'arrangedClue',
                name: 'arrangedClue',
                hidden: true,
                component: () =>
                    import ('@/views/cms/arrangedClue'),
                meta: {
                    title: '包办线索',
                },
                hidden: true
            },
            {
                path: 'brandManage',
                name: 'brandManage',
                component: () =>
                    import ('@/views/cms/brandManage'),
                meta: {
                    title: '品牌管理',
                },
                hidden: true
            },
            {
                path: 'specsManage',
                name: 'specsManage',
                component: () =>
                    import ('@/views/cms/specsManage'),
                meta: {
                    title: '规格属性管理',
                },
                hidden: true
            },
            {
                path: 'serviceManage',
                name: 'serviceManage',
                component: () =>
                    import ('@/views/cms/serviceManage'),
                meta: { title: '服务管理' },
                hidden: true
            },
            {
                path: 'clueDemand',
                name: 'clueDemand',
                component: () =>
                    import ('@/views/cms/clueDemand'),
                meta: { title: '线索需求补充' },
                hidden: true
            },
            {
                path: 'serviceDemand',
                name: 'serviceDemand',
                component: () =>
                    import ('@/views/cms/serviceDemand'),
                meta: { title: '服务需求补充' },
                hidden: true
            },
            {
                path: 'lastIssueManage',
                name: 'lastIssueManage',
                component: () =>
                    import ('@/views/cms/lastIssueManage'),
                meta: { title: '上刊画面管理' },
                hidden: true
            },
            {
                path: 'caseBiography',
                name: 'caseBiography',
                component: () =>
                    import ('@/views/cms/caseBiography'),
                meta: { title: '案例传记管理' },
                hidden: true
            },
        ]
    },
    { //订单管理
        path: '/oms',
        component: Layout,
        redirect: '/oms/order',
        name: 'oms',
        meta: {
            title: '订单管理',
            icon: 'dingdan'
        },
        hidden: true,
        children: [
            /**
             *
             {
              path: 'taskOrder',
              name: 'taskOrder',
              component: () => import('@/views/oms/taskOrder'),
              meta: {
                title: '任务订单',
              }
            },
             */
            {
                path: 'service',
                name: 'service',
                component: () =>
                    import ('@/views/oms/service'),
                meta: {
                    title: '服务订单',
                },
                hidden: true
            },
            {
                path: 'serviceDetail', //服务订单详情
                name: 'serviceDetail',
                hidden: true,
                component: () =>
                    import ('@/views/oms/serviceDetail'),
                meta: {
                    title: '服务订单详情',
                }
            },
            {
                path: 'thread',
                name: 'thread',
                component: () =>
                    import ('@/views/oms/threadorder'),
                meta: {
                    title: '线索订单',
                },
                hidden: true,
            },
            {
                path: 'incrementOrder',
                name: 'incrementOrder',
                component: () =>
                    import ('@/views/oms/incrementOrder'),
                meta: {
                    title: '增值服务订单',
                },
                hidden: true,
            },
            {
                path: 'toolorder',
                name: 'toolorder',
                component: () =>
                    import ('@/views/oms/toolorder'),
                meta: {
                    title: '工具市场订单',
                },
                hidden: true,
            },
            {
                path: 'bailorder',
                name: 'bailorder',
                component: () =>
                    import ('@/views/oms/bailorder'),
                meta: {
                    title: '保证金订单',
                },
                hidden: true,
            },
            {
                path: 'lastOrder',
                name: 'lastOrder',
                component: () =>
                    import ('@/views/oms/lastOrder'),
                meta: {
                    title: '实时上刊订单',
                },
                hidden: true,
            },
            {
                path: 'caseBiographyOrder',
                name: 'caseBiographyOrder',
                component: () =>
                    import ('@/views/oms/caseBiographyOrder'),
                meta: {
                    title: '案例传记订单',
                },
                hidden: true,
            },
            {
                path: 'orderRefund',
                name: 'orderRefund',
                component: () =>
                    import ('@/views/oms/orderRefund'),
                meta: {
                    title: '订单退款',
                },
                hidden: true,
            },
            {
                path: 'orderassess',
                name: 'orderassess',
                component: () =>
                    import ('@/views/oms/orderassess'),
                meta: {
                    title: '订单评价',
                },
                hidden: true,
            },
            {
                path: 'orderbill',
                name: 'orderbill',
                component: () =>
                    import ('@/views/oms/orderbill'),
                meta: {
                    title: '订单发票',
                },
                hidden: true,
            },
            {
                path: 'orderSettlement',
                name: 'orderSettlement',
                component: () =>
                    import ('@/views/oms/orderSettlement'),
                meta: {
                    title: '订单结算申请',
                },
                hidden: true
            }
        ]
    },
    { //资金管理
        path: '/pms',
        component: Layout,
        redirect: '/pms/product',
        name: 'pms',
        meta: {
            title: '资金管理',
            icon: 'zijinguanli'
        },
        hidden: true,
        children: [{
                path: 'depositDetail',
                name: 'depositDetail',
                component: () =>
                    import ('@/views/pms/depositDetail'),
                meta: {
                    title: '保证金明细',
                },
                hidden: true
            },
            {
                path: 'incomeDetails',
                name: 'incomeDetails',
                component: () =>
                    import ('@/views/pms/incomeDetails'),
                meta: {
                    title: '平台收入明细',
                },
                hidden: true
            },
            {
                path: 'settleDetail',
                name: 'settleDetail',
                component: () =>
                    import ('@/views/pms/settleDetail'),
                meta: {
                    title: '订单结算明细',
                },
                hidden: true
            },
            {
                path: 'cashOut',
                name: 'cashOut',
                component: () =>
                    import ('@/views/pms/cashOut'),
                meta: {
                    title: '资金提现',
                },
                hidden: true
            },
            {
                path: 'accountDetail',
                name: 'accountDetail',
                component: () =>
                    import ('@/views/pms/accountDetail'),
                meta: {
                    title: '账户余额明细',
                },
                hidden: true
            },
            {
                path: 'payBalance',
                name: 'payBalance',
                component: () =>
                    import ('@/views/pms/payBalance'),
                meta: {
                    title: '代付账户余额明细',
                },
                hidden: true,
            }
        ]
    },
    { //工具市场
        path: '/tool',
        component: Layout,
        redirect: '/tool/market',
        name: 'tool',
        meta: {
            title: '工具市场',
            icon: 'gongju'
        },
        hidden: true,
        children: [{
                path: 'Market',
                name: 'Market',
                component: () =>
                    import ('@/views/tool/market'),
                meta: {
                    title: '店铺会员升级',
                },
                hidden: true,
            },
            {
                path: 'Category',
                name: 'Category',
                component: () =>
                    import ('@/views/tool/category'),
                meta: {
                    title: '技能类目',
                },
                hidden: true,
            },
            {
                path: 'shopRenovation',
                name: 'shopRenovation',
                component: () =>
                    import ('@/views/tool/shopRenovation'),
                meta: {
                    title: '店铺装修',
                },
                hidden: true,
            }
        ]
    },
    { //系统设置
        path: '/system',
        component: Layout,
        redirect: '/system/unitManage',
        name: 'system',
        meta: {
            title: '系统设置',
            icon: 'shezhi'
        },
        hidden: true,
        children: [{
                path: 'templateManage',
                name: 'templateManage',
                component: () =>
                    import ('@/views/system/templateManage'),
                meta: {
                    title: '模板管理',
                },
                hidden: true,
            },
            {
                path: 'templateAdd', //新增模板
                name: 'templateAdd',
                hidden: true,
                component: () =>
                    import ('@/views/system/templateEdit'),
                meta: {
                    title: '新增模板',
                }
            },
            {
                path: 'templateEdit', //编辑模板
                name: 'templateEdit',
                hidden: true,
                component: () =>
                    import ('@/views/system/templateEdit'),
                meta: {
                    title: '编辑模板',
                }
            },
            // {
            //   path: 'typeManage',
            //   name: 'typeManage',
            //   component: () => import('@/views/system/typeManage'),
            //   meta: {
            //     title: '分类管理',
            //   }
            // },
            {
                path: 'classManage',
                name: 'classManage',
                component: () =>
                    import ('@/views/system/classManage'),
                meta: {
                    title: '分类管理',
                },
                hidden: true,
            },
            {
                path: 'addService', //增值服务管理
                name: 'addService',
                component: () =>
                    import ('@/views/system/addService'),
                meta: {
                    title: '增值服务管理',
                },
                hidden: true,
            },
            {
                path: 'unitManage',
                name: 'unitManage',
                component: () =>
                    import ('@/views/system/unitManage'),
                meta: {
                    title: '单位管理',
                },
                hidden: true,
            },
            {
                path: 'serviceField',
                name: 'serviceField',
                component: () =>
                    import ('@/views/system/serviceField'),
                meta: {
                    title: '领域管理',
                },
                hidden: true,
            },
            {
                path: 'Cluetype', //线索客户类型
                name: 'Cluetype',
                component: () =>
                    import ('@/views/system/cluetype'),
                meta: {
                    title: '线索客户类型',
                },
                hidden: true,
            },
            {
                path: 'reason', //退款原因
                name: 'reason',
                component: () =>
                    import ('@/views/system/reason'),
                meta: { title: '退款原因' },
                hidden: true,
            },
            {
                path: 'shopGrade', //店铺基础等级管理
                name: 'shopGrade',
                component: () =>
                    import ('@/views/system/shopGrade'),
                meta: {
                    title: '店铺基础等级',
                },
                hidden: true,
            },
            {
                path: 'storeLevel', //店铺会员等级管理
                name: 'storeLevel',
                component: () =>
                    import ('@/views/system/storeLevel'),
                meta: {
                    title: '店铺会员等级',
                },
                hidden: true,
            },
            {
                path: 'advertisement', //广告banner管理
                name: 'advertisement',
                component: () =>
                    import ('@/views/system/advertisement'),
                meta: {
                    title: '广告banner管理',
                },
                hidden: true,
            },
            {
                path: 'Adverloc',
                name: 'Adverloc',
                component: () =>
                    import ('@/views/system/adverloc'),
                meta: {
                    title: '广告位置管理',
                },
                hidden: true,
            },
            {
                path: 'reportType',
                name: 'reportType',
                component: () =>
                    import ('@/views/system/reportType'),
                meta: {
                    title: '举报类型',
                },
                hidden: true,
            },
            {
                path: 'bankManage',
                name: 'bankManage',
                component: () =>
                    import ('@/views/system/bankManage'),
                meta: {
                    title: '银行管理',
                },
                hidden: true,
            },
            {
                path: 'searchWords',
                name: 'searchWords',
                component: () =>
                    import ('@/views/system/searchWords'),
                meta: {
                    title: '搜索热词',
                },
                hidden: true,
            },
            {
                path: 'mediaType',
                name: 'mediaType',
                component: () =>
                    import ('@/views/system/mediaType'),
                meta: {
                    title: '上刊媒体类型',
                },
                hidden: true,
            },
            {
                path: 'pictureLabel',
                name: 'pictureLabel',
                component: () =>
                    import ('@/views/system/pictureLabel'),
                meta: {
                    title: '上刊画面标签',
                },
                hidden: true,
            },
            {
                path: 'serviceLabel',
                name: 'serviceLabel',
                component: () =>
                    import ('@/views/system/serviceLabel'),
                meta: {
                    title: '服务标签',
                },
                hidden: true,
            },
            // {
            //   path: 'searchSet',
            //   name: 'searchSet',
            //   component: () => import('@/views/system/searchSet'),
            //   meta: {
            //     title: '搜索设置',
            //   }
            // },
            {
                path: 'priceRange',
                name: 'priceRange',
                component: () =>
                    import ('@/views/system/priceRange'),
                meta: {
                    title: '服务筛选价格区间',
                },
                hidden: true,
            },
            {
                path: 'addressLibrary',
                name: 'addressLibrary',
                component: () =>
                    import ('@/views/system/addressLibrary'),
                meta: {
                    title: '省市区地址库',
                },
                hidden: true,
            },
            {
                path: 'friendshipLinks',
                name: 'friendshipLinks',
                component: () =>
                    import ('@/views/system/friendshipLinks'),
                meta: {
                    title: '友情链接',
                },
                hidden: true,
            },
        ]
    },
    { //文章管理
        path: '/article',
        component: Layout,
        redirect: '/article/articleList',
        name: 'article',
        meta: {
            title: '文章管理',
            icon: 'wenzhang'
        },
        hidden: true,
        children: [{
                path: 'articletype', //文章分类
                name: 'articletype',
                component: () =>
                    import ('@/views/article/articletype'),
                meta: {
                    title: '文章分类',
                },
                hidden: true,
            },
            {
                path: 'articleList', //文章列表
                name: 'articleList',
                component: () =>
                    import ('@/views/article/articleList'),
                meta: {
                    title: '文章列表',
                },
                hidden: true,
            },
            {
                path: 'articleAdd', //新增文章
                name: 'articleAdd',
                hidden: true,
                component: () =>
                    import ('@/views/article/articleEdit'),
                meta: {
                    title: '新增文章',
                }
            },
            {
                path: 'articleEdit', //编辑文章
                name: 'articleEdit',
                hidden: true,
                component: () =>
                    import ('@/views/article/articleEdit'),
                meta: {
                    title: '编辑文章',
                }
            }
        ]
    },
    { //违规/举报/维权
        path: '/help',
        component: Layout,
        redirect: '/help/reportManage',
        name: 'help',
        meta: {
            title: '违规/举报/维权',
            icon: 'weiguijubao'
        },
        hidden: true,
        children: [{
            path: 'reportManage', //举报管理
            name: 'reportManage',
            component: () =>
                import ('@/views/help/reportManage'),
            meta: {
                title: '举报管理',
                // icon: 'weiguijubao'
            },
            hidden: true,
        }]
    },
    { //权限管理
        path: '/power',
        component: Layout,
        redirect: '/power/log',
        name: 'power',
        meta: {
            title: '权限管理',
            icon: 'yonghuguanli'
        },
        hidden: true,
        children: [{
                path: 'role', //角色管理
                name: 'role',
                component: () =>
                    import ('@/views/power/roleManage'),
                meta: {
                    title: '角色管理',
                },
                hidden: true,
            },
            {
                path: 'roleSet', //权限设置
                name: 'roleSet',
                hidden: true,
                component: () =>
                    import ('@/views/power/roleSet'),
                meta: {
                    title: '权限设置',
                }
            },
            {
                path: 'managers', //管理员列表
                name: 'managers',
                component: () =>
                    import ('@/views/power/managers'),
                meta: {
                    title: '管理员列表',
                },
                hidden: true,
            },
            {
                path: 'log', //管理员操作日志
                name: 'log',
                component: () =>
                    import ('@/views/power/actionLog'),
                meta: {
                    title: '管理员操作日志',
                },
                hidden: true,
            },
            {
                path: 'sensitiveWords', //敏感词管理
                name: 'sensitiveWords',
                component: () =>
                    import ('@/views/power/sensitiveWords'),
                meta: {
                    title: '敏感词过滤日志',
                },
                hidden: true,
            },
        ]
    },
    {
        path: '*',
        redirect: '/login',
        hidden: true
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})