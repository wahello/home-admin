import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ProForm, {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { Form, Spin } from 'antd';
import ServiceCategoryApi from '@/services/shop/service-category';
import MaterialPicker from '@/components/MaterialPicker';

const ServiceCategoryForm = ({ id, visible, onVisibleChange, onFinish, parentId }) => {
  const [form] = Form.useForm();
  const { data, loading, error } = useRequest(() => {
    return id ? ServiceCategoryApi.get({ id }) : Promise.resolve({});
  }, {
    refreshDeps: [id],
  });
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        pic: data.pic,
      });
    }else{
      form.resetFields()
    }
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({
      parent_id: parentId,
    });
  }, [parentId]);


  const onSubmit = async values => {
    if (id) {
      const updateData = {
        ...values,
        id,
      };
      await ServiceCategoryApi.update(updateData);
    } else {
      await ServiceCategoryApi.add(values);
    }
    return onFinish();
  };
  return (
    <ModalForm form={form} submitter={{
      submitButtonProps: {
        disabled: loading || error,
      },
    }} width={400} title={id ? '修改分类' : '新建分类'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <Spin spinning={loading}>
        {(!id||(!id&&!data?.parent_id))&&<ProFormSelect
          width='md'
          name='parent_id'
          label='上级分类'
          placeholder='请选择上级分类'
          extra={!parentId && '留空为一级分类'}
          readonly={!!parentId}
          request={async () => {
            const { data: categoryList } = await ServiceCategoryApi.list();
            return categoryList?.map(({ _id, name }) => ({
              value: _id,
              label: name,
            }));
          }}
        />}
        <ProFormText
          width='md'
          name='name'
          label='分类名称'
          placeholder='请输入分类名称'
          rules={[{ required: true, message: '不能为空' }, { max: 10, message: '不能超过10个字符' }]}
        />
        <ProFormDigit
          fieldProps={{ precision: 0 }}
          width='md'
          name='sort'
          label='排序'
          extra={'数字越大越靠前显示'}
          initialValue={0}
        />
        <ProFormDependency name={['parent_id']}>
          {
            ({ parent_id }) => {
              return parent_id && <ProForm.Item name={'pic'} label={'分类图标'} rules={[{ required: true }]}>
                <MaterialPicker />
              </ProForm.Item>;
            }
          }
        </ProFormDependency>
        <ProFormSwitch
          name='show'
          label='是否显示'
          initialValue={true}
        />
      </Spin>
    </ModalForm>
  );
};

ServiceCategoryForm.propTypes =
  {
    id: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    onFinish: PropTypes.func.isRequired,
    onVisibleChange: PropTypes.func.isRequired,
    parentId: PropTypes.string,
  }
;

export default ServiceCategoryForm;
