import Search from '@/pages/app/diy/components/Search';
import SearchSetting from '@/pages/app/diy/components/SearchSetting';
import {
  AppstoreOutlined,
  BorderOuterOutlined,
  DashOutlined,
  PictureOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';
import Swiper from '@/pages/app/diy/components/Swiper';
import SwiperSetting from '@/pages/app/diy/components/SwiperSetting';
import MyIcon from '@/components/MyIcon';
import Cube from '@/pages/app/diy/components/Cube';
import CubeSetting from '@/pages/app/diy/components/CubeSetting';
import Navs from '@/pages/app/diy/components/Navs';
import NavSetting from '@/pages/app/diy/components/NavSetting';
import Service from '@/pages/app/diy/components/Service';
import ServiceSetting from '@/pages/app/diy/components/ServiceSetting';
import White from '@/pages/app/diy/components/White';
import WhiteSetting from '@/pages/app/diy/components/WhiteSetting';
import WhiteLine from '@/pages/app/diy/components/WhiteLine';
import WhiteLineSetting from '@/pages/app/diy/components/WhiteLineSetting';

const paddings = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
  paddingBottom: 20,
};

export default [{
  name: '搜索',
  key: 'sn-search',
  category: 'base',
  component: <Search />,
  setting: <SearchSetting />,
  icon: <SearchOutlined />,
  defaultSetting: {
    placeholder: '搜索',
    textColor: 'rgba(144,147,153,1)',
    bgColor: 'rgba(0,0,0,0)',
    inputBgColor: 'rgba(255,255,255,1)',
    shape: 'round',
    ...paddings,
  },
}, {
  name: '轮播图',
  key: 'sn-swiper',
  category: 'base',
  component: <Swiper />,
  setting: <SwiperSetting />,
  icon: <MyIcon type={'swiper'} />,
  defaultSetting: {
    pics: [],
    shape: 'round',
    ...paddings,
  },
}, {
  name: '魔方',
  key: 'sn-cube',
  category: 'base',
  component: <Cube />,
  setting: <CubeSetting />,
  icon: <PictureOutlined />,
  defaultSetting: {
    ...paddings,
    pics: [{
      pic: null,
      page: null,
    }],
    type: 'one-one',
  },
}, {
  name: '图文导航',
  key: 'sn-navs',
  category: 'base',
  component: <Navs />,
  setting: <NavSetting />,
  icon: <TableOutlined />,
  defaultSetting: {
    pics: [{}, {}, {}, {}],
    columns: 4,
  },
}, {
  name: '商品',
  key: 'sn-service',
  category: 'promotion',
  component: <Service />,
  setting: <ServiceSetting />,
  icon: <AppstoreOutlined />,
  defaultSetting: {
    dataType: 'auto',
    autoNum: 10,
    type: 1,
    serviceIds: [],
    ...paddings,
  },
}, {
  name: '拼团',
  key: 'sn-group',
  category: 'promotion',
  component: <Service />,
  setting: <ServiceSetting />,
  icon: <AppstoreOutlined />,
  defaultSetting: {
    dataType: 'auto',
    autoNum: 10,
    type: 1,
    serviceIds: [],
    ...paddings,
  },
}, {
  name: '辅助空白',
  key: 'sn-blank',
  category: 'help',
  component: <White />,
  setting: <WhiteSetting />,
  icon: <BorderOuterOutlined />,
  defaultSetting: {
    height: 100,
    color:'rgba(0,0,0,0)'
  },
},
  {
    name: '辅助线',
    key: 'sn-blank-line',
    category: 'help',
    component: <WhiteLine />,
    setting: <WhiteLineSetting />,
    icon: <DashOutlined />,
    defaultSetting: {
      type: 'dashed',
      padding: 0,
      color: 'rgba(190,190,190,1)',
    },
  }];
