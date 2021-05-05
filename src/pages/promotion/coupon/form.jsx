import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect, ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { Button, Form, message, Result, Spin } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import CouponApi from '@/services/promotion/coupon';
import Enums from '@/utils/enums';
import ServiceCategoryApi from '@/services/shop/service-category';
import { history } from '@@/core/history';
import moment from 'moment';
import ServicePicker from '@/components/ServicePicker';


const CouponForm = props => {
  const [id] = useState(props.location.query.id);
  const [baseForm] = Form.useForm();

  const getRequest = useRequest(CouponApi.get, { manual: true });

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

  const onFinish = async values => {
    try {
      const submitValues = {
        ...values,
        limit_services: values.limit_services?.map(it => it._id),
      };
      if (submitValues.expire.type === Enums.expireType.DATE.value) {
        submitValues.expire.expire_date = moment(submitValues.expire.expire_date).endOf('days').valueOf();
      }
      if (id) {
        await CouponApi.update({ ...submitValues, id });
      } else {
        await CouponApi.add(submitValues);
      }
      message.success('保存成功');
      history.goBack();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return <PageContainer footer={null}>
    <Spin spinning={getRequest.loading}>
      <ProCard>
        {getRequest.error ?
          <Result status={500} title={'加载错误'} subTitle={'网络异常，请重试'}
                  extra={<Button type={'primary'} onClick={() => getRequest.run({ id })}>重试</Button>} /> :
          <ProForm form={baseForm} layout={'horizontal'} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
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
                   }}
                   scrollToFirstError>
            <ProFormText
              name='name'
              width={'md'}
              label='优惠券名称'
              placeholder='请输入优惠券名称'
              rules={[{ required: true }]}
            />
            <ProFormRadio.Group
              name={['discount', 'type']}
              initialValue={Enums.discountType.DEDUCTION.value}
              label='优惠券类型'
              rules={[{ required: true }]}
              options={Object.values(Enums.discountType).map(({ text, value }) => ({ label: text, value }))}
            />
            <ProFormDependency name={['discount', 'type']}>
              {({ discount }) => discount?.type === Enums.discountType.DEDUCTION.value ?
                <ProForm.Item label={'优惠券面额'} extra={'价格不能小于0，可保留两位小数'}>
                  <ProFormDigit
                    width={100}
                    name={['discount', 'deduction']}
                    rules={[{ required: true }]}
                    placeholder={''}
                    noStyle
                  />
                  <span> 元</span>
                </ProForm.Item> : <ProForm.Item label={'优惠券折扣'} extra={'优惠券折扣不能小于1折，且不可大于9.9折，可保留两位小数'}>
                  <ProFormDigit
                    width={100}
                    name={['discount', 'rebate']}
                    max={9.9}
                    min={1}
                    rules={[{ required: true }]}
                    placeholder={''}
                    noStyle
                  />
                  <span> 折</span>
                </ProForm.Item>}
            </ProFormDependency>
            <ProForm.Item label={'满多少元可以使用'} extra={'价格不能小于0，无门槛请设为0'}>
              <ProFormDigit
                width={100}
                initialValue={0}
                name={['discount', 'use_min']}
                min={0}
                rules={[{ required: true }]}
                placeholder={''}
                noStyle
              />
              <span> 元</span>
            </ProForm.Item>
            <ProForm.Item label={'发放量'}>
              <ProFormDigit
                width={100}
                initialValue={9999}
                fieldProps={{ precision: 0 }}
                name={'num'}
                min={0}
                rules={[{ required: true }]}
                placeholder={''}
                noStyle
              />
              <span> 张</span>
            </ProForm.Item>
            <ProForm.Item label={'每人限领'}>
              <ProFormDigit
                width={100}
                initialValue={1}
                fieldProps={{ precision: 0 }}
                name={'receive_limit'}
                min={0}
                rules={[{ required: true }]}
                placeholder={''}
                noStyle
              />
              <span> 张</span>
            </ProForm.Item>
            <ProFormSwitch name="is_public" label="是否公开" extra={'公开可以在领券中心和可用商品页看见'} />
            <ProFormRadio.Group
              name={['expire', 'type']}
              initialValue={Enums.expireType.DATE.value}
              label='有效期类型'
              rules={[{ required: true }]}
              options={Object.values(Enums.expireType).map(({ text, value }) => ({ label: text, value }))}
            />
            <ProFormDependency name={['expire', 'type']}>
              {({ expire }) => expire?.type === Enums.expireType.DATE.value ?
                <ProFormDatePicker name={['expire', 'expire_date']} label='过期日期' />
                : <ProForm.Item label={'领取之日起'} extra={'不能小于0，且必须为整数'}>
                  <ProFormDigit
                    fieldProps={{ precision: 0 }}
                    width={100}
                    name={['expire', 'expire_day']}
                    min={1}
                    rules={[{ required: true }]}
                    noStyle
                  />
                  <span> 天有效</span>
                </ProForm.Item>}
            </ProFormDependency>
            <ProFormSelect mode={'multiple'} name='limit_categories' label='限定可用分类' width='md' placeholder='请选择'
                           request={async () => {
                             const { data: categoryList } = await ServiceCategoryApi.list();
                             return categoryList?.map(({ _id, name,children }) => ({
                               value: _id,
                               label: name,
                               children:children.map(it=>({value:it._id, label: it.name})),
                               optionType:'optGroup'
                             }));
                           }}
                           extra={'为空则所有分类都可用'}
            />
            <ProForm.Item label={'限定可用商品'} name={'limit_services'} extra={'为空则所有服务都可用'}>
              <ServicePicker />
            </ProForm.Item>
          </ProForm>}
      </ProCard>
    </Spin>
  </PageContainer>;
};


export default CouponForm;
