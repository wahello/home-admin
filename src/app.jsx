import { PageLoading } from '@ant-design/pro-layout';
import { Button, ConfigProvider, message, notification } from 'antd';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import AccountApi from '@/services/account';
import moment from 'moment';
import 'moment/locale/zh-cn';
import logo from '@/assets/logo-white.svg';
import Enums from '@/utils/enums';

moment.locale('zh-cn');


const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';


/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */



export async function getInitialState() {
  const initInfo = async () => {
    try {
      const { data: userInfo } = await AccountApi.currentUser();
      if (userInfo&&Enums.authState[userInfo.authState] === Enums.authState.FAILED) {
        const authKey = `auth${moment().valueOf()}`;
        const goAuth = () => {
          message.destroy(authKey);
          history.push('/shop/setting', {
            tab: 'auth',
          });
        };
        message.error({
          key: authKey,
          duration: 0,
          content: <span>店铺认证未通过,请检查认证材料重新提交认证 <Button type={'link'} onClick={goAuth}>查看</Button></span>,
          style: {
            marginTop: 70,
          },
        });
      }
      return { userInfo };
    } catch (error) {
      console.error(error);
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath&&history.location.pathname !== "/user/register") {
    const { navMenu, userInfo } = await initInfo();
    return {
      initInfo,
      navMenu,
      userInfo,
      settings: {
        navTheme: 'light',
      },
    };
  }
  return {
    initInfo,
    settings: {},
  };
}

// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout = ({ initialState }) => {
  return {
    locale: false,
    rightContentRender: () => <ConfigProvider componentSize={'small'}><RightContent /></ConfigProvider>,
    disableContentMargin: false,
    footerRender: false,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.userInfo && location.pathname !== loginPath &&location.pathname!=='/user/register') {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    logo: <img src={logo} />,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const errorCodeMessage = {
  10001: '账户已禁用',
  10101: '用户不存在',
  10102: '密码错误',
  10103: '密码错误次数过多',
  30204: '登录已过期',
  40201: '用户不存在',
  40202: '旧密码错误',
  60101: '此手机号已被绑定',
  60201: '此邮箱已被绑定',
  60301: '获取微信信息失败',
  60302: '此账号已被绑定',
  60401: '获取支付宝信息失败',
  60402: '此账号已被绑定',
  90001: '获取数据异常',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error) => {
  const { name, response } = error;
  if (name === 'BizError') {
    message.error(errorCodeMessage[error.info.errorCode] || error.info.errorMessage);
  } else {
    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, url } = response;
      notification.error({
        message: `请求错误 ${status}`,
        description: errorText,
      });
    }

    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
  }
  throw error;
};
// https://umijs.org/zh-CN/plugins/plugin-request
export const request = {
  errorHandler,
  prefix: isDev ? '' : 'https://api.anjujing.cn',
  requestInterceptors: [(url, options) => {
    const authHeader = {};
    const token = localStorage.getItem('token');
    if (token) {
      authHeader['t-auth'] = token;
    }
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          ...authHeader,
        },
      },
    };
  }],
  errorConfig: {
    adaptor: (resData) => {
      return {
        success: resData.code === 0,
        errorCode: resData.code,
        errorMessage: resData.message,
      };
    },
  },
};
