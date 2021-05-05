import React, { useEffect, useState } from 'react';
import { Button, Image, Modal, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import ServiceApi from '@/services/shop/service';
import ServiceCategoryApi from '@/services/shop/service-category';
import { useBoolean } from 'ahooks';
import PropTypes from 'prop-types';

const ServicePicker = props => {
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
    rows.filter(it =>!!it).forEach(row => {
      if (!newRows.find(it => it._id !== row._id)) {
        newRows.push(row);
      }
    });
    setSelectedRows(newRows);
  };
  const onOk = () => {
    props.onChange(selectedRows);
    toggleVisible.setFalse();
  };

  const removeSelect = key => {
    props.onChange(selectedRows.filter(it => it._id !== key));
  };

  const columns = [{
    dataIndex: 'name',
    title: '服务',
    formItemProps: { label: '服务名称' },
    render: (text, record) => {
      return <Space><Image src={record.main_pic} width={50} height={50} /><span>{text}</span></Space>;
    },
  }, {
    dataIndex: 'category',
    title: '服务分类',
    render: text => {
      return text.name;
    },
    request: async () => {
      const { data } = await ServiceCategoryApi.list();
      return data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }));
    },
  }, {
    title: '价格',
    dataIndex: 'price',
    valueType: 'money',
  }];
  return (
    <>
      <Modal width={'60vw'}
             onOk={onOk}
             visible={visible}
             onCancel={toggleVisible.setFalse}
             okText={`确定(已选择${selectedRowKeys.length}项)`}
      >
        <ProTable
          scroll={{ y: 300 }}
          request={ServiceApi.page} toolBarRender={false}
          rowSelection={{
            preserveSelectedRowKeys: true,
            selectedRowKeys,
            onChange: onSelectRow,
          }}
          tableAlertRender={false}
          rowKey='_id'
          columns={columns}
          pagination={{ pageSize: 10 }}
          search={{
            collapseRender: false,
            collapsed: false,
          }}
          size={'small'}
        />
      </Modal>
      <Space direction={'vertical'}>
        {
          props.value.length ? <ProTable
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
          /> : null
        }
        <Button type={'primary'} onClick={toggleVisible.setTrue}>选择服务</Button>
      </Space>
    </>
  );
};

ServicePicker.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};
ServicePicker.defaultProps = {
  value: [],
  onChange: () => {
  },
};

export default ServicePicker;
