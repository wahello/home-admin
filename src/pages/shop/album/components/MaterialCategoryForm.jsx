import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { Form, Spin } from 'antd';
import MaterialCategoryApi from '@/services/material-category';

const MaterialCategoryForm = ({ id, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();
  const { data, loading, error } = useRequest(() => {
    return id ? MaterialCategoryApi.get({ id }) : Promise.resolve();
  }, {
    refreshDeps: [id],
  });
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);


  const onSubmit = async values => {
    if (id) {
      const updateData = {
        ...values,
        id,
      };
      await MaterialCategoryApi.update(updateData);
    } else {
      await MaterialCategoryApi.add(values);
    }

    return onFinish();
  };
  return (
    <ModalForm form={form} submitter={{
      submitButtonProps: {
        disabled: loading || error,
      },
    }} width={400} title={id ? '修改分类名称' : '新建分类名称'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <Spin spinning={loading}>
        <ProFormText
          width='md'
          name='name'
          placeholder='请输入分类名称'
          rules={[{ required: true, message: '不能为空' }, { max: 10, message: '不能超过10个字符' }]}
        />
      </Spin>
    </ModalForm>
  );
};

MaterialCategoryForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default MaterialCategoryForm;
