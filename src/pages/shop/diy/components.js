import Search from '@/pages/shop/diy/components/Search';
import SearchSetting from '@/pages/shop/diy/components/SearchSetting';
import { LayoutOutlined, PictureOutlined, SearchOutlined, TableOutlined } from '@ant-design/icons';
import Swiper from '@/pages/shop/diy/components/Swiper';
import SwiperSetting from '@/pages/shop/diy/components/SwiperSetting';

export default [{
  name: '搜索',
  key: 'search',
  component: <Search />,
  setting: <SearchSetting />,
  icon: <SearchOutlined />,
  defaultSetting: {
    placeholder: '搜索',
    textColor:'#909399',
    bgColor: 'transparent',
    inputBgColor:'#ffffff',
    shape:'circle',
  },
}, {
  name: '轮播图',
  key: 'swiper',
  component: <Swiper />,
  setting: <SwiperSetting  />,
  icon: <PictureOutlined />,
  defaultSetting: {
    pics:[{
      pic: 'https://v4.niuteam.cn/public/diy_view/style2/img/banner.png',
      path: 'www',
    }],
    shape:'circle',
  },
},{
  name: '图文导航',
  key: 'navs',
  component: <Swiper />,
  setting: <SwiperSetting  />,
  icon: <TableOutlined />,
  defaultSetting: {
    pics:[{
      pic: 'https://st-gdx.dancf.com/gaodingx/0/uxms/design/20201119-140529-e291.png?x-oss-process=image/resize,w_800/interlace,1,image/format,webp',
      path: 'www',
    }],
    shape:'circle',
  },
},{
  name: '魔方',
  key: 'magic-cube',
  component: <Swiper />,
  setting: <SwiperSetting  />,
  icon: <LayoutOutlined />,
  defaultSetting: {
    pics:[{
      pic: 'https://v4.niuteam.cn/public/diy_view/style2/img/banner.png',
      path: 'www',
    }],
    shape:'circle',
  },
}];
