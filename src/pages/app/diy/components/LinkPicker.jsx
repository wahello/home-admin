import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tag } from 'antd';
import { useBoolean } from 'ahooks';
import ServicePicker from '@/components/ServicePicker';
import GroupPicker from '@/components/GroupPicker';


const types = {
  navigateTo: 'navigateTo',
  switchTab: 'switchTab',
  redirect: 'redirect',
};
const pageData = [{
  name: '基础页面',
  pages: [
    {
      name: '主页',
      path: '/pages/home',
      type: types.switchTab,
    },
    {
      name: '服务分类',
      path: '/pages/categories',
      type: types.navigateTo,
    },
    {
      name: '服务列表',
      path: '/servicePages/search',
      type: types.navigateTo,
    }, {
      name: '个人主页',
      path: '/pages/my',
      type: types.switchTab,
    },
  ],
}, {
  name: '个人页面',
  pages: [{
    name: '我的余额',
    path: '/userPages/balance',
    type: types.navigateTo,
  },
    {
      name: '充值页面',
      path: '/userPages/recharge',
      type: types.navigateTo,
    }, {
      name: '我的优惠券',
      path: '/userPages/coupons',
      type: types.navigateTo,
    }, {
      name: '我的积分',
      path: '/userPages/integral',
      type: types.navigateTo,
    }, {
      name: '我的订单',
      path: '/userPages/orders',
      type: types.navigateTo,
    }, {
      name: '我的地址',
      path: '/userPages/address',
      type: types.navigateTo,
    }, {
      name: '我的评论',
      path: '/userPages/evaluates',
      type: types.navigateTo,
    }, {
      name: '我的邀请',
      path: '/userPages/invite',
      type: types.navigateTo,
    }, {
      name: '我的收藏',
      path: '/userPages/favorite',
      type: types.navigateTo,
    }],
}, {
  name: '动态页面',
  pages: [{
    name: '商品详情',
    path: '/servicePages/service',
    type: types.navigateTo,
    paramType: 'service',
    needParam: true,
    params: null,
  }, {
    name: '拼团商品',
    path: '/servicePages/service',
    type: types.navigateTo,
    paramType: 'group',
    needParam: true,
    params: null,
  }],
}];

const LinkPicker = props => {
  const [visible, toggleVisible] = useBoolean(false);
  const [checkedPage, setCheckedPage] = useState();
  const [serviceVisible, toggleServiceVisible] = useBoolean(false);
  const [groupVisible, toggleGroupVisible] = useBoolean(false);

  useEffect(() => {
    setCheckedPage(props.value);
  }, [props.value]);

  const changeTag = (page) => {
    if (checkedPage?.name !== page.name) {
      setCheckedPage(page);
    } else if (!page.needParam) {
      setCheckedPage(null);
    }
    if (page.needParam) {
      switch (page.paramType) {
        case 'service':
          toggleServiceVisible.setTrue();
          break;
        case 'group':
          toggleGroupVisible.setTrue();
          break;
        default:
          break;
      }
    }
  };
  const cleanPage = () => {
    props.onChange(null);
    setCheckedPage(null);
    toggleVisible.setFalse();
  };
  const selectPage = () => {
    props.onChange(checkedPage);
    toggleVisible.setFalse();
  };
  const selectService = service => {
    toggleServiceVisible.setFalse();
    if (service) {
      setCheckedPage({
        ...checkedPage,
        paramName: service.name,
        params: {
          id: service.id,
        },
      });
    } else {
      setCheckedPage(null);
    }
  };

  const cancelSelectService = () => {
    if (!checkedPage.params) {
      setCheckedPage(null);
    }
    toggleServiceVisible.setFalse();
  };


  const cancelSelectGroup = () => {
    if (!checkedPage.params) {
      setCheckedPage(null);
    }
    toggleGroupVisible.setFalse();
  };

  const selectGroup = group => {
    toggleGroupVisible.setFalse();
    if (group) {
      setCheckedPage({
        ...checkedPage,
        paramName: group.name,
        params: {
          id: group.serviceId,
          groupId: group.id,
        },
      });
    } else {
      setCheckedPage(null);
    }
  };


  const displayName = useMemo(() => {
    if (props.value) {
      return props.value.paramName || props.value.name;
    }
    return '请选择跳转链接';
  }, [props.value]);

  return <>
    <Modal title={'选择跳转链接'} visible={visible} okText={'确定'} onOk={selectPage} cancelText={'清空'} onCancel={cleanPage}
           closable width={600}
           bodyStyle={{ height: 500 }}>
      {pageData.map(it =>
        <>
          <b>{it.name}</b>
          <div>
            {it.pages.map(page => <Tag style={{ fontSize: 14, margin: 15, cursor: 'pointer' }}
                                       onClick={() => changeTag(page)}
                                       color={checkedPage?.name === page.name ? '#2D8CF0' : 'default'}
                                       key={page.name}
            >
              {checkedPage?.name === page.name ? `${checkedPage.name}${checkedPage.paramName ? `(${checkedPage.paramName})` : ''}` : page.name}
            </Tag>)}
          </div>
        </>)}
    </Modal>
    <ServicePicker value={checkedPage?.params} visible={serviceVisible} onCancel={cancelSelectService}
                   onChange={selectService} single />
    <GroupPicker value={checkedPage?.params} visible={groupVisible} onCancel={cancelSelectGroup}
                 onChange={selectGroup} single />
    <Tag color={'#2D8CF0'} style={{ maxWidth: 150, textOverflow: 'ellipsis', overflow: 'hidden' }}
         onClick={toggleVisible.setTrue}>{displayName}</Tag>
  </>;
};

LinkPicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
};

export default LinkPicker;
