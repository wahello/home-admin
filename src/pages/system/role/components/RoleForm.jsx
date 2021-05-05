import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import RoleApi from '@/services/system/role';
import { useRequest } from 'umi';
import { Button, Form, Spin } from 'antd';
import PermissionApi from '@/services/system/permission';

const RoleForm = ({ id, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();
  const { data, loading, error } = useRequest(() => {
    return id ? RoleApi.get({ id }) : Promise.resolve();
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
      await RoleApi.update(updateData);
    } else {
      await RoleApi.add(values);
    }

    return onFinish();
  };
  return (
    <ModalForm form={form} submitter={{
      submitButtonProps: {
        disabled: loading || error,
      },
    }} width={400} title={id ? '修改角色' : '新建角色'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <Spin spinning={loading}>
        <ProFormText
          width='md'
          name='role_id'
          label='角色标识'
          placeholder='请输入角色标识'
        />
        <ProFormText
          width='md'
          name='role_name'
          label='角色名称'
          placeholder='请输入角色名称'
        />
        <ProFormSelect
          mode={'multiple'}
          width={'md'}
          name='role'
          label='权限'
          placeholder='请选择权限'
          request={async () => {
            const { data: permissionList } = await PermissionApi.list();
            return permissionList?.map(it => ({
              value: it.permission_id,
              label: it.permission_name,
            }));
          }}
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

RoleForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default RoleForm;
