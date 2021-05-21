import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, message, Result, Spin } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import { history } from '@@/core/history';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormColorPicker,
  ProFormDependency,
  ProFormRadio,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import MaterialPicker from '@/components/MaterialPicker';
import PosterDesign from '@/pages/promotion/poster/components/PosterDesign';
import PosterApi from '@/services/promotion/poster';
import ColorPicker from '@/components/ColorPicker';


const PosterForm = props => {
  const [id] = useState(props.location.query.id);
  const [baseForm] = Form.useForm();


  const getRequest = useRequest(PosterApi.get, { manual: true });

  useEffect(() => {
    if (id) {
      getRequest.run({ id });
    }
  }, [id]);
  useEffect(() => {
    if (getRequest.data) {
      baseForm.setFieldsValue(getRequest.data);
    }
  }, [getRequest.data]);

  const onFinish = async poster => {
    try {
      if (id) {
        await PosterApi.update({ id, poster });
      } else {
        await PosterApi.add({ poster });
      }
      message.success('保存成功');
      history.goBack();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const onPicChange = () => {
    baseForm.setFieldsValue({
      code: null,
    });
  };
  return (
    <PageContainer>
      <Spin spinning={getRequest.loading}>
        <ProCard>
          {getRequest.error ?
            <Result status={500} title={'加载错误'} subTitle={'网络异常，请重试'}
                    extra={<Button type={'primary'} onClick={() => getRequest.run({ id })}>重试</Button>} /> :
            <ProForm form={baseForm} layout={'horizontal'} dateFormatter={'number'} labelCol={{ span: 8 }}
                     wrapperCol={{ span: 14 }}
                     onFinish={onFinish}
                     validateMessages={{
                       required: '此项为必填项',
                     }}
                     submitter={{
                       searchConfig: {
                         submitText: '保存',
                       },
                       render: (_, dom) => <div style={{ textAlign: 'center' }}>{dom.pop()}</div>,
                       submitButtonProps: {
                         size: 'large',
                       },
                     }}>
              <ProFormText
                name='name'
                width={'md'}
                label='海报名称'
                placeholder='请输入海报名称'
                rules={[{ required: true }]}
              />
              <ProFormRadio.Group
                name='type'
                width={'md'}
                label='海报类型'
                initialValue={'CLIENT'}
                options={[{ value:'CLIENT',label:'用户分享' },{ value:'OFFLINE',label:'线下广告' }]}
              />
              <ProForm.Item name={'pic'} label={'海报图片'} rules={[{ required: true }]}>
                <MaterialPicker onChange={onPicChange} />
              </ProForm.Item>
              <ProFormDependency name={['pic']}>
                {({ pic }) => {
                  return pic ?
                    <ProForm.Item name={'code'} label={'海报图片'}
                                  rules={[{ required: true, message: '请设计海报' }]}><PosterDesign
                      image={pic} /></ProForm.Item> : null;
                }}
              </ProFormDependency>
              <ProFormSwitch name={'auto_color'} initialValue={true} label={'二维码颜色'}
                             extra={'是否自动配置二维码线条颜色，如果手动指定后颜色依然是黑色，则说明该颜色下二维码不易识别'} fieldProps={{
                checkedChildren: '自动识别',
                unCheckedChildren: '手动指定',
              }} />
              <ProFormDependency name={['auto_color']}>
                {({ auto_color }) => {
                  return auto_color ?
                    null : <ProForm.Item label={'线条颜色'} name={'line_color'} initialValue={'rgba(1,1,1,1)'}>
                      <ColorPicker allowTrans={false} />
                    </ProForm.Item>;
                }}
              </ProFormDependency>
              <ProFormSwitch name={'is_hyaline'}  label={'是否透明底色'}
                             extra={'开启后，生成的小程序二维码背景为透明'} />
            </ProForm>}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

PosterForm.propTypes = {};

export default PosterForm;
