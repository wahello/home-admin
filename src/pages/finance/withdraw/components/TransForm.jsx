import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ProForm,{ ModalForm, ProFormRadio } from '@ant-design/pro-form';
import { Alert, Form } from 'antd';
import WithdrawApi from '@/services/finance/withdraw';

const CheckForm = ({ record, visible, onVisibleChange, onFinish }) => {

  const [form] = Form.useForm();



  const onSubmit = async values => {
    await WithdrawApi.trans(record.id,values);
    return onFinish();
  };

  return (
    <ModalForm modalProps={{ centered: true,destroyOnClose:true }} form={form} width={500} title={'提现转账'} visible={visible}
               layout={'horizontal'}
               labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
               onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <ProForm.Item ignoreFormItem>
        <Alert message={'自动转账请注意对应平台账户内余额足够'}/>
        <br/>
      </ProForm.Item>
      <ProFormRadio.Group
        name='transAuto'
        label='转账方式'
        initialValue={true}
        options={[{ label: '自动转账', value: true }, { label: '手动转账', value: false }]}
      />
    </ModalForm>
  );
};

CheckForm.propTypes = {
  gift: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default CheckForm;
