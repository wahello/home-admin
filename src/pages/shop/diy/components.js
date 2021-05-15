import Search from '@/pages/shop/diy/components/Search';
import SearchSetting from '@/pages/shop/diy/components/SearchSetting';
import { PictureOutlined, SearchOutlined, TableOutlined } from '@ant-design/icons';
import Swiper from '@/pages/shop/diy/components/Swiper';
import SwiperSetting from '@/pages/shop/diy/components/SwiperSetting';
import MyIcon from '@/components/MyIcon';
import Cube from '@/pages/shop/diy/components/Cube';
import CubeSetting from '@/pages/shop/diy/components/CubeSetting';

const paddings = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
  paddingBottom: 20,
};

export default [{
  name: '搜索',
  key: 'sn-search',
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
  component: <Cube />,
  setting: <CubeSetting />,
  icon: <PictureOutlined />,
  defaultSetting: {
    pics: [{
      pic: null,
      page: null,
    }],
    type: 'one-one',
  },
},{
  name: '图文导航',
  key: 'sn-navs',
  component: <Swiper />,
  setting: <SwiperSetting />,
  icon: <TableOutlined />,
  defaultSetting: {
    pics: [{
      pic: 'https://st-gdx.dancf.com/gaodingx/0/uxms/design/20201119-140529-e291.png?x-oss-process=image/resize,w_800/interlace,1,image/format,webp',
      path: 'www',
    }],
    shape: 'circle',
  },
}];
