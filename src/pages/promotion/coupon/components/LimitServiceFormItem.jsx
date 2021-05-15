import React from 'react';
import PropTypes from 'prop-types';
import ServicePicker from '@/components/ServicePicker';
import ProTable from '@ant-design/pro-table';
import ServiceCategoryApi from '@/services/shop/service-category';
import { Button, Image } from 'antd';
import { useBoolean } from 'ahooks';

const columns = [{
  dataIndex: 'name',
  title: '服务名称',
}, {
  dataIndex: 'main_pic',
  title: '服务图片',
  hideInSearch: true,
  render: it => <Image src={it} width={40} height={40} preview={{ mask: false }} />
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
}];


const LimitServiceFormItem = props => {
  const [serviceVisible,toggleServiceVisible] = useBoolean(false);
  const removeSelect = (key) => {
    props.onChange(props.value.filter((it) => it._id !== key));
  };
  return (
    <>
      <ProTable
        style={{ display: props.value?.length ? 'block' : 'none',marginBottom:10}}
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
      <Button type={'primary'} onClick={toggleServiceVisible.setTrue}>选择服务</Button>
      <ServicePicker visible={serviceVisible} onCancel={toggleServiceVisible.setFalse} onChange={props.onChange} value={props.value} />
    </>
  );
};

LimitServiceFormItem.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};
LimitServiceFormItem.defaultProps = {
  value: [],
};

export default LimitServiceFormItem;
