import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormDependency, ProFormRadio, ProFormTextArea } from '@ant-design/pro-form';
import { Form } from 'antd';
import WithdrawApi from '@/services/finance/withdraw';

const CheckForm = ({ record, visible, onVisibleChange, onFinish }) => {

  const [form] = Form.useForm();
  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
  }, [record]);


  const onSubmit = async values => {
    await WithdrawApi.check(record.id, values);
    return onFinish();
  };
  return <ModalForm modalProps={{ centered: true, destroyOnClose: true }} form={form} width={500} title={'审核提现申请'}
                    visible={visible}
                    layout={'horizontal'}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
                    onVisibleChange={onVisibleChange}
                    onFinish={onSubmit}>
    <ProFormRadio.Group
      name='isPass'
      initialValue={true}
      label='是否通过'
      options={[{ label: '通过', value: true }, { label: '拒绝', value: false }]}
    />
    <ProFormDependency name={['isPass']}>
      {({ isPass }) => {
        return isPass ? null : <ProFormTextArea name={'rejectReason'} label={'拒绝原因'} />;
      }}
    </ProFormDependency>
  </ModalForm>;
};

CheckForm.propTypes = {
  gift: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default CheckForm;
