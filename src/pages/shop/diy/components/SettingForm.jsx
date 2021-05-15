import React from 'react';
import ProForm from '@ant-design/pro-form';
import PropTypes from 'prop-types';
import FormContext from '@/pages/shop/diy/components/FormContext';


const SettingForm = props => {


  return <FormContext.Provider value={form}>
    <ProForm submitter={false} form={form} style={{ width: '100%' }} layout={'horizontal'}
             onFieldsChange={props.changeSetting}>
      {props.children}
    </ProForm>
  </FormContext.Provider>
};

SettingForm.propTypes = {
  settings: PropTypes.object,
  changeSetting: PropTypes.func,
};

export default SettingForm;
