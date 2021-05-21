import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Image, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import GroupApi from '@/services/promotion/group';


const columns = [{
  dataIndex: 'name',
  title: '服务名称',
}, {
  dataIndex: 'main_pic',
  title: '服务图片',
  hideInSearch: true,
  render: it => <Image src={it} width={40} height={40} preview={{ mask: false }} />,
}, ];

const GroupPicker = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const rowKeys = [];
    const rows = [];
    if (props.value) {
      if (Array.isArray(props.value)) {
        rowKeys.push(...props.value.map(it => it._id));
        rows.push(...props.value);
      } else {
        rowKeys.push(props.value._id);
        rows.push(props.value);
      }
    }
    setSelectedRowKeys(rowKeys);
    setSelectedRows(rows);
  }, [props.single, props.value]);

  const onSelectRow = (keys, rows) => {
    setSelectedRowKeys(keys);

    if (rows.length) {
      const newRows = [...selectedRows];
      rows.filter(it => !!it).forEach(row => {
        if (!newRows.find(it => it._id === row._id)) {
          newRows.push(row);
        }
      });
      setSelectedRows(newRows);
    } else {
      setSelectedRows([]);
    }
  };
  const onOk = () => {
    if (props.single) {
      props.onChange(selectedRows[0]);
    } else {
      props.onChange(selectedRows);
    }
  };
  const getCheckboxProps = useCallback((record) => {
    return {
      disabled: props.disabledKeys?.includes(record._id),
    };
  }, [props.disabledKeys]);

  const modalProps = props.single ? { footer: false } : null;


  return <Modal width={800}
                onOk={onOk}
                visible={props.visible}
                onCancel={props.onCancel}
                okText={`确定(已选择${selectedRowKeys.length}项)`}
                {...modalProps}
  >
    <ProTable
      scroll={{ y: 300 }}
      request={GroupApi.page} toolBarRender={false}
      rowSelection={props.single ? false : {
        preserveSelectedRowKeys: true,
        selectedRowKeys,
        onChange: onSelectRow,
        getCheckboxProps,
      }}
      tableAlertRender={false}
      rowKey='_id'
      columns={[
        ...columns,
        props.single && {
          dataIndex: 'option',
          valueType: 'option',
          render: (_, record) => [<Button type={'link'} onClick={() => props.onChange(record)}> 选择</Button>],
        },
      ]}
      pagination={{ pageSize: 20 }}
      search={{
        collapseRender: false,
        collapsed: false,
      }}
      size={'small'}
    />
  </Modal>;
};

GroupPicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func,
  disabledKeys: PropTypes.array,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  single: PropTypes.bool,
};
GroupPicker.defaultProps = {
  value: [],
  disabledKeys: [],
  onChange: () => {
  },
  single: false,
};


export default GroupPicker;
