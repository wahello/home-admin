import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import RoleApi from '@/services/system/role';
import UserApi from '@/services/system/user';
import { useRequest } from 'umi';
import { Button, Form, Spin } from 'antd';

const UserForm = ({ id, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();
  const [resetPassword, setResetPassword] = useState(false);
  const { data, loading, error } = useRequest(() => {
    return id ? UserApi.get({ id }) : Promise.resolve();
  }, {
    refreshDeps: [id],
  });
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  useEffect(() => {
    if (!visible) {
      setResetPassword(false);
    }
  }, [visible]);

  const onSubmit = async values => {
    if (id) {
      const updateData = { ...values, uid: id };
      delete updateData.password;
      await UserApi.update(updateData);
      if (resetPassword) {
        await UserApi.resetPassword({ password: values.password, uid: id });
      }
    } else {
      await UserApi.add(values);
    }

    return onFinish();
  };
  return (
    <ModalForm form={form} submitter={{
      submitButtonProps: {
        disabled: loading || error,
      },
    }} width={400} title={id ? '修改用户' : '新建用户'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <Spin spinning={loading}>
        <ProFormText
          width='md'
          name='username'
          label='用户名'
          placeholder='请输入用户名称'
          rules={[
            {
              required: true,
              message: '用户名称是必填项！',
            },
          ]}
        />
        {(id && !resetPassword) ? <Form.Item label={'初始密码'}>
          <Button type={'primary'} onClick={() => setResetPassword(true)}>点击重置密码</Button>
        </Form.Item> : <ProFormText
          width='md'
          name='password'
          label='初始密码'
          placeholder='请输入初始密码'
          rules={[
            {
              required: true,
              message: '初始密码是必填项！',
            },
          ]}
          fieldProps={{
            suffix: (id && resetPassword) && < span style={{ color: 'rgba(0,0,0,.45)', cursor: 'pointer' }}
                                                    onClick={() => setResetPassword(false)}>取消</span>,
          }}
        />
        }
        <ProFormText
          width='md'
          name='mobile'
          label='手机号'
          placeholder='请输入手机号'
        />
        <ProFormSelect
          mode={'multiple'}
          width={'md'}
          name='role'
          label='角色'
          placeholder='请选择角色'
          request={async () => {
            const { data: roleList } = await RoleApi.list();
            return roleList?.map(it => ({
              value: it.role_id,
              label: it.role_name,
            }));
          }}
        />
      </Spin>
    </ModalForm>
  );
};

UserForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default UserForm;
