import React from 'react';
import PropTypes from 'prop-types';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import CouponPicker from '@/components/CouponPicker';
import Enums from '@/utils/enums';
import moment from 'moment';

const columns = [{
  title: '名称',
  dataIndex: 'name',
},
  {
    title: '类型',
    dataIndex: ['discount', 'type'],
    valueType: 'radio',
    valueEnum: Enums.discountType,
  },
  {
    title: '面值',
    dataIndex: ['discount', 'deduction'],
    render: (_, record) => {
      return record.discount.type === Enums.discountType.DEDUCTION.value ? `￥${record.discount.deduction}` : `${record.discount.rebate}折`;
    },
    hideInSearch: true,
  },
  {
    title: '使用门槛',
    dataIndex: ['discount', 'use_min'],
    valueType: 'money',
    hideInSearch: true,
  },
  {
    title: '有效期限',
    dataIndex: 'expire',
    render: it => {
      return it.type === Enums.expireType.DATE.value ? `${moment(it.expire_date).format('YYYY-MM-DD')}前有效` : `领取后${it.expire_day}天有效`;
    },
    hideInSearch: true,
  },
];


const CouponFormItem = props => {

  const removeSelect = (key) => {
    props.onChange(props.value.filter((it) => it._id !== key));
  };

  return (
    <>
      <ProTable
        style={{ display: props.value?.length ? 'block' : 'none', marginBottom: 10, width: 600 }}
        dataSource={props.value}
        scroll={{ y: 300 }}
        toolBarRender={false}
        rowKey='_id'
        columns={[
          ...columns,
          {
            dataIndex: 'option',
            valueType: 'option',
            render: (_, { _id }) => {
              return <Button type={'link'} danger onClick={() => removeSelect(_id)}>删除</Button>;
            },
          },
        ]}
        pagination={false}
        search={false}
        size={'small'}
      />
      <CouponPicker onChange={props.onChange} value={props.value} />
    </>
  );
};

CouponFormItem.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};
CouponFormItem.defaultProps = {
  value: [],
};

export default CouponFormItem;
