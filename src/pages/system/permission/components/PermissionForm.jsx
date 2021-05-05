import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { Form, Spin } from 'antd';
import PermissionApi from '@/services/system/permission';

const PermissionForm = ({ id, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();
  const { data, loading, error } = useRequest(() => {
    return id ? PermissionApi.get({ id }) : Promise.resolve();
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
      const updateData = { ...values };
      await PermissionApi.update(updateData);
    } else {
      await PermissionApi.add(values);
    }

    return onFinish();
  };
  return (
    <ModalForm form={form} submitter={{
      submitButtonProps: {
        disabled: loading || error,
      },
    }} width={400} title={id ? '修改权限' : '新建权限'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <Spin spinning={loading}>
        <ProFormText
          width='md'
          name='role_id'
          label='权限标识'
          placeholder='请输入权限标识'
        />
        <ProFormText
          width='md'
          name='role_name'
          label='权限名称'
          placeholder='请输入权限名称'
        />
        <ProFormTextArea
          width='md'
          name='comment'
          label='备注'
          placeholder='请输入备注'
        />
      </Spin>
    </ModalForm>
  );
};

PermissionForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default PermissionForm;
