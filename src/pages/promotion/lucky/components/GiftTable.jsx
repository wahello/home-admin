import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProTable from '@ant-design/pro-table';
import Enums from '@/utils/enums';
import { Button, Space } from 'antd';
import { useBoolean, useControllableValue } from 'ahooks';
import GiftForm from '@/pages/promotion/lucky/components/GiftForm';
import { PlusOutlined } from '@ant-design/icons';
import uuid from 'uuid';

const GiftTable = props => {

  const [gifts, setGifts] = useControllableValue(props, { defaultValue: [] });
  const [gift, setGift] = useState();
  const [giftVisible, toggleGiftVisible] = useBoolean(false);

  const removeGift = giftId => {
    setGifts(gifts.filter(it => it.id !== giftId));
  };
  const editGift = editData => {
    setGift(editData);
    toggleGiftVisible.setTrue();
  };
  const addGift = value => {
    if (value.id) {
      const newGifts = [...gifts];
      const idx = gifts.findIndex(it => it.id === value.id);
      newGifts[idx] = value;
      setGifts(newGifts);
    } else {
      setGifts([...gifts, {
        id: uuid().replaceAll('-', ''),
        ...value,
      }]);
    }
  };

  const giftColumns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: Enums.giftType,
    },
    {
      title: '图片',
      dataIndex: 'pic',
      valueType: 'image',
      fieldProps: {
        width: 50,
        height: 50,
      },
    },
    {
      title: '权重',
      dataIndex: 'weight',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => {
        return <Space size={'small'}>
          <Button type={'link'} onClick={() => editGift(record)}>修改</Button>
          <Button type={'link'} onClick={() => removeGift(record.id)}>删除</Button>
        </Space>;
      },
    },
  ];

  return (
    <>
      <ProTable
        style={{ display: gifts.length ? 'block' : 'none', marginBottom: 10 }}
        search={false}
        toolBarRender={false}
        pagination={false}
        rowKey='id' columns={giftColumns} dataSource={gifts} />
      {gifts.length < 8 && <Button
        type='primary'
        key='primary'
        onClick={() => {
          setGift(null);
          toggleGiftVisible.setTrue();
        }}
      >
        <PlusOutlined /> 添加奖品
      </Button>}
      <GiftForm gift={gift} onFinish={addGift} onVisibleChange={toggleGiftVisible.toggle} visible={giftVisible} />
    </>
  );
};

GiftTable.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default GiftTable;
