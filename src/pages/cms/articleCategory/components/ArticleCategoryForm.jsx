import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { Form, Spin } from 'antd';
import ArticleCategoryApi from '@/services/cms/article-category';

const ArticleCategoryForm = ({ id, visible, onVisibleChange, onFinish }) => {
  const [form] = Form.useForm();
  const { data, loading, error } = useRequest(() => {
    return id ? ArticleCategoryApi.get({ id }) : Promise.resolve();
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
      const updateData = { ...values, id };
      await ArticleCategoryApi.update(updateData);
    } else {
      await ArticleCategoryApi.add(values);
    }

    return onFinish();
  };
  return (
    <ModalForm form={form} submitter={{
      submitButtonProps: {
        disabled: loading || error,
      },
    }} width={400} title={id ? '修改分类' : '新建分类'} visible={visible} onVisibleChange={onVisibleChange}
               onFinish={onSubmit}
               labelCol={{ span: 6 }}
               wrapperCol={{ span: 18 }}
               layout={'horizontal'}
               modalProps={{
                 maskClosable: false,
                 centered: true,
               }}
    >
      <Spin spinning={loading}>
        <ProFormText
          width='md'
          name='name'
          label='分类名称'
          placeholder='请输入分类名称'
          rules={[{ required: true, message: '不能为空' }, { max: 20, message: '不能超过20个字符' }]}
        />

      </Spin>
    </ModalForm>
  );
};

ArticleCategoryForm.propTypes =
  {
    id: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    onFinish: PropTypes.func.isRequired,
    onVisibleChange: PropTypes.func.isRequired,
  }
;

export default ArticleCategoryForm;
