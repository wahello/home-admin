import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';
import PageApi from '@/services/app/page';
import defaultPageSetting from '@/pages/app/diy/defaultPageSetting';

const PageForm = ({ editData, visible, onVisibleChange, onFinish }) => {

  const [form] = Form.useForm();
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    }
  }, [editData]);


  const onSubmit = async values => {
    if (editData) {
      const updateData = { ...values, id: editData._id };
      await PageApi.update(updateData);
    } else {
      await PageApi.add({
        ...values,
        setting: {
          page: {
            ...defaultPageSetting,
            title: values.name,
          },
          components: [],
        },
      });
    }

    return onFinish();
  };
  return (
    <ModalForm modalProps={{ centered: true, destroyOnClose: true }} form={form} width={500}
               title={editData ? '修改微页面' : '新增微页面'}
               visible={visible}
               layout={'horizontal'}
               labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}
               onVisibleChange={onVisibleChange}
               onFinish={onSubmit}>
      <ProFormText name={'name'} label={'页面名称'} />
    </ModalForm>
  );
};

PageForm.propTypes = {
  editData: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

export default PageForm;
