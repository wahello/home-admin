import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormDigit, ProFormField, ProFormTextArea } from '@ant-design/pro-form';
import { Form } from 'antd';
import MemberApi from '@/services/member';
import Enums from '@/utils/enums';

const AdjustAccountForm = ({ type, member, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();

  const adjustType = useMemo(() => {
    return Enums.accountType[type];
  }, [type]);

  useEffect(() => {
    if (member&&visible) {
      form.setFieldsValue({
        nowValue: adjustType === Enums.accountType.BALANCE ? member.balance : member.integral,
      });
    }
  }, [member, adjustType,visible]);


  const rangeLimit = useMemo(() => {
    if (adjustType === Enums.accountType.BALANCE) {
      return { min: -member?.balance };
    }
    return { min: -member?.integral };

  }, [member, adjustType]);

  const onSubmit = async ({ value, remark }) => {
    if (value)
      await MemberApi.adjustAccount(member.id, { type, value, remark });
    return onFinish();
  };


  return (
    <ModalForm form={form} width={500} title={`调整${adjustType.text}`} layout={'horizontal'} labelCol={{ span: 6 }}
               wrapperCol={{ span: 18 }}
               visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit} modalProps={{destroyOnClose:true}}>
      <ProFormField readonly name={'nowValue'} label={`当前${adjustType.text}`} />
      <ProFormDigit
        width={'xs'}
        name='value'

        {...rangeLimit}
        label='调整数额'
        extra={`调整数额与当前${adjustType.text}相加不能小于0`}
        rules={[{ required: true, message: '调整数额不能为空' }, () => ({
          validator(_, value) {
            if (value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('调整数额不能为0'));
          },
        })]}
      />
      <ProFormTextArea name={'remark'} label={'备注'} />
    </ModalForm>
  );
};

AdjustAccountForm.propTypes = {
  member: PropTypes.object,
  type: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default AdjustAccountForm;
