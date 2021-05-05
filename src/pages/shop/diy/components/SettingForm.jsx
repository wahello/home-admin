import React, { useEffect } from 'react';
import { Form } from 'antd';
import ProForm from '@ant-design/pro-form';
import PropTypes from 'prop-types';



const SettingForm = props => {
    const [form] = Form.useForm();

    useEffect(() => {
      form.setFieldsValue(props.settings);
    }, [props.settings]);

    return <ProForm submitter={false} form={form} style={{ width: '100%' }} layout={'horizontal'}
                    onFieldsChange={props.changeSetting}>
      {props.children}
    </ProForm>;

  }
;

SettingForm.propTypes = {
  settings: PropTypes.object,
  changeSetting: PropTypes.func,
};

export default SettingForm;
