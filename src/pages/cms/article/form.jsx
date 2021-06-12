import React, { useEffect, useState } from 'react';
import { Button, Form, message, Result, Spin } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import { history } from '@@/core/history';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import MaterialPicker from '@/components/MaterialPicker';
import MyEditor from '@/components/MyEditor';
import ArticleApi from '@/services/cms/article';
import ArticleCategoryApi from '@/services/cms/article-category';
import BraftEditor from 'braft-editor';


const ArticleForm = props => {
  const [baseForm] = Form.useForm();
  const [id] = useState(props.location.query.id);
  const getRequest = useRequest(ArticleApi.get, { manual: true });


  useEffect(() => {
    if (id) {
      getRequest.run({ id });
    }
  }, [id]);
  useEffect(() => {
    if (getRequest.data) {
      baseForm.setFieldsValue({
        ...getRequest.data,
        content:BraftEditor.createEditorState(getRequest.data.content)
      })
    }
  }, [getRequest.data]);


  const submitService = async values => {
    try {
      const submitValues = {
        ...values,
        content: values.content.toHTML(),
      };
      if (id) {
        await ArticleApi.update({ ...submitValues, id });
      } else {
        await ArticleApi.add(submitValues);
      }
      message.success('保存成功');
      history.goBack();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };


  return (
    <PageContainer footer={null}>
      <Spin spinning={getRequest.loading}>
        <ProCard>
          {getRequest.error ?
            <Result status={500} title={'加载错误'} subTitle={'网络异常，请重试'}
                    extra={<Button type={'primary'} onClick={() => getRequest.run({ id })}>重试</Button>} /> :
            <Form form={baseForm} layout={'horizontal'} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
                     onFinish={submitService}
                     validateMessages={{
                       required: '此项为必填项',
                     }}
                     scrollToFirstError
            >
              <ProFormText
                name='title'
                width={'md'}
                label='文章标题'
                placeholder='请输入文章名称'
                rules={[{ required: true }]}
              />
              <ProFormTextArea
                name='desc'
                width={'md'}
                label='文章简介'
                placeholder='请输入文章简介'
                rules={[{ required: true }]}
              />


              <ProFormSelect name='category' label='文章分类' width='md' placeholder='请选择分类' rules={[{ required: true }]}
                             request={async () => {
                               const { data: categoryList } = await ArticleCategoryApi.list();
                               return categoryList?.map(({ _id, name }) => ({
                                 value: _id,
                                 label: name,
                               }));
                             }}
              />

              <ProForm.Item name={'pic'} label={'文章封面'} rules={[{ required: true }]}>
                <MaterialPicker />
              </ProForm.Item>
              <ProForm.Item  name={'content'} label={'文章内容'}>
                <MyEditor />
              </ProForm.Item>
              <div style={{ textAlign: 'center' }}>
                <Button htmlType={'submit'} type={'primary'}>保存</Button>
              </div>
            </Form>}
        </ProCard>
      </Spin>
    </PageContainer>
  );

};


export default ArticleForm;
