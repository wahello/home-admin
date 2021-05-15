import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Switch } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useBoolean } from 'ahooks';
import PropTypes from 'prop-types';
import Enums from '@/utils/enums';
import moment from 'moment';
import CouponApi from '@/services/promotion/coupon';

const columns = [
  {
    title: '优惠券名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '优惠券类型',
    dataIndex: ['discount', 'type'],
    valueType: 'radio',
    valueEnum: Enums.discountType,
    align: 'center',
  },
  {
    title: '优惠金额/折扣',
    dataIndex: ['discount', 'deduction'],
    align: 'center',
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
    align: 'center',
  },
  {
    title: '有效期限',
    dataIndex: 'expire',
    align: 'center',
    render: it => {
      return it.type === Enums.expireType.DATE.value ? `${moment(it.expire_date).format('YYYY-MM-DD')}前有效` : `领取后${it.expire_day}天有效`;
    },
    hideInSearch: true,
  },
  {
    title: '是否公开',
    dataIndex: 'is_public',
    width: 100,
    align: 'center',
    render: it => it ? '是' : '否',
    renderFormItem: (_, { fieldProps }) => {
      return <Switch style={{ width: 'unset' }} {...fieldProps} />;
    },
  },
];


const CouponPicker = props => {
  const [visible, toggleVisible] = useBoolean(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setSelectedRowKeys(props.value.map(it => it._id));
    setSelectedRows(props.value);
  }, [props.value]);

  const onSelectRow = (keys, rows) => {
    setSelectedRowKeys(keys);
    const newRows = [...selectedRows];
    rows.filter(it => !!it).forEach(row => {
      if (!newRows.find(it => it._id === row._id)) {
        newRows.push(row);
      }
    });
    setSelectedRows(newRows);
  };
  const onOk = () => {
    props.onChange(selectedRows);
    toggleVisible.setFalse();
  };
  const getCheckboxProps = useCallback((record) => {
    return {
      disabled: props.disabledKeys?.includes(record._id),
    };
  }, [props.disabledKeys]);

  return (
    <>
      <Modal width={900}
             onOk={onOk}
             visible={visible}
             onCancel={toggleVisible.setFalse}
             okText={`确定(已选择${selectedRowKeys.length}项)`}
      >
        <ProTable
          scroll={{ y: 300 }}
          request={CouponApi.page} toolBarRender={false}
          rowSelection={{
            preserveSelectedRowKeys: true,
            selectedRowKeys,
            onChange: onSelectRow,
            getCheckboxProps,
          }}
          tableAlertRender={false}
          rowKey='_id'
          columns={columns}
          pagination={{ pageSize: 20 }}
          search={{
            collapseRender: false,
            collapsed: false,
          }}
          size={'small'}
        />
      </Modal>
      <Button type={'primary'} onClick={toggleVisible.setTrue}>选择优惠券</Button>
    </>
  );
};

CouponPicker.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  disabledKeys: PropTypes.array,
};
CouponPicker.defaultProps = {
  value: [],
  disabledKeys: [],
  onChange: () => {
  },
};

export default CouponPicker;
