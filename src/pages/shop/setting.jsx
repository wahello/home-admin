import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormDateTimePicker, ProFormField, ProFormText, ProFormUploadButton } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Badge, Button, Form, Menu, message, Space, Spin } from 'antd';
import ShopAddress from '@/pages/shop/components/ShopAddress';
import { useRequest } from 'umi';
import TenantApi from '@/services/tenant';
import OssUpload from '@/components/ImageUpload';
import Enums from '@/utils/enums';
import { UploadOutlined } from '@ant-design/icons';

const ShopSetting = ({ location: { state } }) => {

  const [baseForm] = Form.useForm();
  const getRequest = useRequest(TenantApi.info);
  const discernLicenceRequest = useRequest(TenantApi.discernLicence, { manual: true });
  const discernIdCardRequest = useRequest(TenantApi.discernIdCard, { manual: true });
  const validMpRequest = useRequest(TenantApi.validMp, { manual: true });
  const [currentKey, setCurrentKey] = useState('base');

  const [authState, setAuthState] = useState(Enums.authState.NOT_AUTH);

  useEffect(() => {
    if (state?.tab) {
      setCurrentKey(state?.tab);
    }
  }, [state]);

  useEffect(() => {
    if (discernLicenceRequest.data) {
      baseForm.setFieldsValue({
        authInfo: {
          ...discernLicenceRequest.data,
        },
      });
    }
  }, [discernLicenceRequest.data]);
  useEffect(() => {
    if (discernIdCardRequest.data) {
      baseForm.setFieldsValue({
        authInfo: {
          ...discernIdCardRequest.data,
        },
      });
    }
  }, [discernIdCardRequest.data]);

  useEffect(() => {
    if (getRequest.data) {
      baseForm.setFieldsValue(getRequest.data);
      setAuthState(Enums.authState[getRequest.data.authState]);
    }
  }, [getRequest.data, currentKey]);

  const onFinish = async values => {
    if (currentKey === 'base') {
      await TenantApi.saveBase(values);
      message.success('保存成功');
    } else if (currentKey === 'auth') {
      await TenantApi.auth(values);
      message.success('提交认证信息成功，平台会尽快完成审核');
    } else if (currentKey === 'mp') {
      await TenantApi.saveMp(values);
      message.success('保存成功');
    }

  };


  const discernLicence = () => {
    try {
      const img = baseForm.getFieldValue(['authInfo', 'licencePic']);
      if (!img) {
        message.error('请上传营业执照照片');
        return;
      }
      discernLicenceRequest.run(img);
    } catch (e) {
      console.log(e);
    }
  };
  const discernIdCard = () => {
    try {
      const { idCardFront, idCardBack } = baseForm.getFieldValue('authInfo')||{};
      if (!idCardFront || !idCardBack) {
        message.error('请上传法人身份证正反面照片');
        return;
      }
      discernIdCardRequest.run({ front: idCardFront, back: idCardBack });
    } catch (e) {
      console.log(e);
    }
  };
  const validMp = async () => {
    const { appId, secret } = baseForm.getFieldValue('wechatConfig');
    if (!appId) {
      message.error('请输入小程序ID');
      return;
    }
    if (!secret) {
      message.error('请输入小程序密钥');
      return;
    }
    try {
      await validMpRequest.run({ appId, secret });
      message.success('验证成功');
    } catch (e) {
      console.log(e);
    }
  };

  const saveText = useMemo(() => {
    if (currentKey === 'mp') {
      return '保存配置';
    }
    if (currentKey === 'auth') {
      return '提交认证';
    }
    return '保存信息';
  }, [currentKey, authState]);

  return (
    <PageContainer>
      <ProCard>
        <ProCard ghost colSpan='200px'>
          <Menu
            style={{ width: 200, height: 600, overflowX: 'hidden', overflowY: 'auto', borderRight: 'none' }}
            selectedKeys={[currentKey]}
            onSelect={({ key }) => setCurrentKey(key)}
            mode='inline'
          >
            <Menu.Item key='base'>基础信息</Menu.Item>
            <Menu.Item key='auth'>认证信息</Menu.Item>
            <Menu.Item key='mp'>小程序配置</Menu.Item>
          </Menu>
        </ProCard>
        <ProCard ghost style={{ paddingLeft: 50 }}>
          <Spin spinning={getRequest.loading}>
            <ProForm form={baseForm} layout={'horizontal'} dateFormatter={'number'} labelCol={{ span: 3 }}
                     wrapperCol={{ span: 21 }}
                     hideRequiredMark
                     onFinish={onFinish}
                     validateMessages={{
                       required: '此项为必填项',
                     }}
                     submitter={false}>
              {
                currentKey === 'base' && <>
                  <ProFormText readonly label={'店铺ID'} name={'id'} width={'sm'} />
                  <ProFormDateTimePicker readonly label={'店铺创建时间'} name={'createTime'} width={'sm'} />
                  <ProFormText label={'店铺名称'} fieldProps={{ maxLength: 10 }} name={'brand'} width={'sm'}
                               rules={[{ required: true }]} />
                  <ProForm.Item label={'店铺Logo'} name={['logo']}
                                extra={<span>支持 jpg/jpeg/png 格式,图片不大于2MB</span>}
                  >
                    <OssUpload accept={'image/jpeg,image/png'} maxSize={2} />
                  </ProForm.Item>

                </>
              }
              {
                currentKey === 'auth' && <>
                  <ProForm.Item label={'当前认证状态'}><Badge status={authState.status}
                                                        text={authState.text} /></ProForm.Item>
                  <ProForm.Item label={'营业执照照片'} name={['authInfo', 'licencePic']}
                                extra={<Space size={'small'} direction={'vertical'}>
                                  <span>请上传多证合一营业执照原件图片或加盖公章复印件</span>
                                  <span>支持 jpg/jpeg/png 格式,图片不大于2MB</span>
                                  <span>如您需要添加水印，建议使用浅色字样“供优选到家认证使用”。</span>
                                </Space>}
                  >
                    <OssUpload accept={'image/jpeg,image/png'} maxSize={2} />
                  </ProForm.Item>
                  <ProForm.Item label={'公司名称'} extra={'若公司名称与营业执照图片上不一致，请手动修改'}>
                    <ProFormText fieldProps={{
                      maxLength: 30,
                    }} name={['authInfo', 'companyName']} width={'md'}
                                 rules={[{ required: true }]} noStyle />
                    <Button style={{ marginLeft: 8 }} type={'primary'}
                            loading={discernLicenceRequest.loading} onClick={discernLicence}>自动识别</Button>
                  </ProForm.Item>

                  <ProFormText label={'统一社会信用代码'} fieldProps={{ maxLength: 30 }} name={['authInfo', 'companyCode']}
                               width={'md'}
                               rules={[{ required: true }]} extra={'若统一社会信用代码与营业执照图片上不一致，请手动修改'} />
                  <ProForm.Item label={'法人身份证图片'} style={{ marginBottom: 0 }}>
                    <ProForm.Item name={['authInfo', 'idCardFront']} style={{ display: 'inline-block' }}
                                  rules={[{ required: true }]}>
                      <OssUpload accept={'image/jpeg,image/png'} maxSize={2} text={'上传人像面'} />
                    </ProForm.Item>
                    <ProForm.Item name={['authInfo', 'idCardBack']} style={{ display: 'inline-block', margin: '0 8px' }}
                                  rules={[{ required: true }]}>
                      <OssUpload accept={'image/jpeg,image/png'} maxSize={2} text={'上传国徽面'} />
                    </ProForm.Item>
                  </ProForm.Item>
                  <ProForm.Item label={'法人姓名'}>
                    <ProFormText fieldProps={{
                      maxLength: 30,
                    }} name={['authInfo', 'legalPerson']} width={'md'}
                                 rules={[{ required: true }]} noStyle />
                    <Button style={{ marginLeft: 8 }} type={'primary'}
                            loading={discernIdCardRequest.loading} onClick={discernIdCard}>自动识别</Button>
                  </ProForm.Item>
                  <ProFormText label={'身份证号'} extra={'若身份证号码与身份证照片上不一致，请手动修改'} fieldProps={{ maxLength: 10 }}
                               name={['authInfo', 'idCard']} width={'md'}
                               rules={[{ required: true }]} />
                </>
              }
              {
                currentKey === 'mp' && <>
                  <ProCard title={'微信小程序'} ghost>
                    <ProFormText labelCol={{ span: 3 }} label={'小程序ID'} fieldProps={{ maxLength: 50 }}
                                 name={['wechatConfig', 'appId']}
                                 width={'md'}
                                 rules={[{ required: true }]} extra={
                      <Space size={'small'}>
                        <span>小程序唯一凭证，即 AppID，可在</span>
                        <a target={'_blank'} href={'https://mp.weixin.qq.com/'}>微信公众平台</a>
                        <span>- 设置 - 开发设置页中获得</span>
                      </Space>
                    } />

                    <ProForm.Item label={'小程序密钥'} extra={
                      <Space size={'small'}>
                        <span>小程序唯一凭证密钥，即 AppSecret，可在</span>
                        <a target={'_blank'} href={'https://mp.weixin.qq.com/'}>微信公众平台</a>
                        <span>- 设置 - 开发设置页中获得</span>
                      </Space>
                    }>
                      <ProFormText labelCol={{ span: 3 }} noStyle fieldProps={{ maxLength: 50 }}
                                   name={['wechatConfig', 'secret']}
                                   width={'md'}
                                   rules={[{ required: true }]}
                      />
                      <Button style={{ marginLeft: 8 }} type={'primary'} onClick={validMp}
                              loading={validMpRequest.loading}>校验配置</Button>
                    </ProForm.Item>
                    <ProFormText label={'商户ID'} extra={
                      <Space size={'small'}>
                        <span>微信支付商户ID 可在</span>
                        <a target={'_blank'} href={'https://pay.weixin.qq.com'}>微信支付商户平台</a>
                        <span>- 账户中心 - 个人信息页中获得</span>
                      </Space>
                    } fieldProps={{ maxLength: 50 }}
                                 name={['wechatConfig', 'mchId']}
                                 width={'md'}
                                 rules={[{ required: true }]}
                    />
                    <ProFormText label={'商户APIv3密钥'} extra={
                      <Space size={'small'}>
                        <span>商户APIv3密钥 可在</span>
                        <a target={'_blank'} href={'https://pay.weixin.qq.com'}>微信支付商户平台</a>
                        <span>- 账户中心 - API安全页获得</span>
                      </Space>
                    } fieldProps={{ maxLength: 100 }}
                                 name={['wechatConfig', 'mchKey']}
                                 width={'md'}
                                 rules={[{ required: true }]}
                    />
                    <ProForm.Item name={['wechatConfig', 'keyPath']} label={'商户API证书(cert.p12)'} extra={
                      <Space size={'small'}>
                        <span>商户API证书(apiclient_cert.p12) 用于退款和向客户付款 可在</span>
                        <a target={'_blank'} href={'https://pay.weixin.qq.com'}>微信支付商户平台</a>
                        <span>- 账户中心 - API安全页获得</span>
                      </Space>
                    }>
                      <OssUpload type={'certs'} accept={'.p12'} isImg={false} maxSize={1}
                                 customRender={(fileUrl, loading) => {
                                   return <Button icon={<UploadOutlined />} type={'primary'} loading={loading}>
                                     {getRequest.data?.wechatConfig?.keyPathUpload ? '已上传 点击重新上传' : '上传证书'}
                                   </Button>;
                                 }} />
                    </ProForm.Item>
                    <ProForm.Item name={['wechatConfig', 'privateCertPath']} label={'商户API证书(cert.pem)'} extra={
                      <Space size={'small'}>
                        <span>商户API证书(apiclient_cert.pem) 用于退款和向客户付款 可在</span>
                        <a target={'_blank'} href={'https://pay.weixin.qq.com'}>微信支付商户平台</a>
                        <span>- 账户中心 - API安全页获得</span>
                      </Space>
                    }>
                      <OssUpload type={'certs'} accept={'.pem'} isImg={false} maxSize={1}
                                 customRender={(fileUrl, loading) => {
                                   return <Button icon={<UploadOutlined />} type={'primary'} loading={loading}>
                                     {getRequest.data?.wechatConfig?.privateCertPathUpload ? '已上传 点击重新上传' : '上传证书'}
                                   </Button>;
                                 }} />
                    </ProForm.Item>
                    <ProForm.Item name={['wechatConfig', 'privateKeyPath']} label={'商户API证书(key.pem)'} extra={
                      <Space size={'small'}>
                        <span>商户API证书(apiclient_key.pem) 用于退款和向客户付款 可在</span>
                        <a target={'_blank'} href={'https://pay.weixin.qq.com'}>微信支付商户平台</a>
                        <span>- 账户中心 - API安全页获得</span>
                      </Space>
                    }>
                      <OssUpload type={'certs'} accept={'.pem'} isImg={false} maxSize={1}
                                 customRender={(fileUrl, loading) => {
                                   return <Button icon={<UploadOutlined />} type={'primary'} loading={loading}>
                                     {getRequest.data?.wechatConfig?.privateKeyPathUpload ? '已上传 点击重新上传' : '上传证书'}
                                   </Button>;
                                 }} />
                    </ProForm.Item>
                  </ProCard>
                </>}
              <ProForm.Item wrapperCol={{ offset: 3 }}>
                <Button type={'primary'}>{saveText}</Button>
              </ProForm.Item>
            </ProForm>
          </Spin>
        </ProCard>
      </ProCard>

    </PageContainer>
  );
};

ShopSetting.propTypes = {};

export default ShopSetting;
