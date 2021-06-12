import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { Button, Form, message, Result, Spin } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import CouponApi from '@/services/promotion/coupon';
import Enums from '@/utils/enums';
import ServiceCategoryApi from '@/services/shop/service-category';
import { history } from 'umi';
import moment from 'moment';
import LimitServiceFormItem from '@/pages/promotion/coupon/components/LimitServiceFormItem';


const CouponForm = props => {
  const [id] = useState(props.location.query.id);
  const [baseForm] = Form.useForm();

  const getRequest = useRequest(CouponApi.get, { manual: true });

  useEffect(() => {
    if (id) {
      getRequest.run(id);
    }
  }, [id]);
  useEffect(() => {
    if (getRequest.data) {
      baseForm.setFieldsValue({
        ...getRequest.data,
        limitCategoryIds:getRequest.data.limitCategoryIds?.split(",")
      });
    }
  }, [getRequest.data]);

  const onFinish = async values => {
    try {
      const submitValues = {
        ...values,
        limitCategoryIds: values.limitCategoryIds?.length?values.limitCategoryIds.join(','):null,
        limitServiceIds: values.limitServices?.map(it => it.id).join(","),
      };
      if (submitValues.expireType === Enums.expireType.DATE.value) {
        submitValues.expireDate = moment(submitValues.expireDate).endOf('days').valueOf();
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
              name={'discountType'}
              initialValue={Enums.discountType.DEDUCTION.value}
              label='优惠券类型'
              rules={[{ required: true }]}
              options={Object.values(Enums.discountType).map(({ text, value }) => ({ label: text, value }))}
            />
            <ProFormDependency name={['discountType']}>
              {({ discountType }) => discountType === Enums.discountType.DEDUCTION.value ?
                <ProForm.Item label={'优惠券面额'} extra={'价格不能小于0，可保留两位小数'}>
                  <ProFormDigit
                    width={100}
                    name='deduction'
                    rules={[{ required: true }]}
                    placeholder={''}
                    noStyle
                  />
                  <span> 元</span>
                </ProForm.Item> : <ProForm.Item label={'优惠券折扣'} extra={'优惠券折扣不能小于1折，且不可大于10折，可保留两位小数'}>
                  <ProFormDigit
                    width={100}
                    name='rebate'
                    max={9.99}
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
                name={'useMin'}
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
            <ProFormSwitch name='isPublic' label='是否公开' extra={'公开可以在领券中心和可用服务详情页看见'} />
            <ProFormRadio.Group
              name={'expireType'}
              initialValue={Enums.expireType.DATE.value}
              label='有效期类型'
              rules={[{ required: true }]}
              options={Object.values(Enums.expireType).map(({ text, value }) => ({ label: text, value }))}
            />
            <ProFormDependency name={['expireType']}>
              {({ expireType }) => expireType === Enums.expireType.DATE.value ?
                <ProFormDatePicker name={'expireDate'} label='过期日期' />
                : <ProForm.Item label={'领取之日起'} extra={'不能小于0，且必须为整数'}>
                  <ProFormDigit
                    fieldProps={{ precision: 0 }}
                    width={100}
                    name={'expireDay'}
                    min={1}
                    rules={[{ required: true }]}
                    noStyle
                  />
                  <span> 天有效</span>
                </ProForm.Item>}
            </ProFormDependency>
            <ProFormSelect mode={'multiple'} name='limitCategoryIds' label='限定可用分类' width='md' placeholder='请选择'
                           request={async () => {
                             const { data: categoryList } = await ServiceCategoryApi.list();
                             return categoryList?.map((cat) => ({
                               value: cat.id,
                               label: cat.name,
                               children: cat.children.map(it => ({ value: it.id, label: it.name })),
                               optionType: 'optGroup',
                             }));
                           }}
                           extra={'为空则所有分类都可用'}
            />
            <ProForm.Item label={'限定可用商品'} name={'limitServices'} extra={'为空则所有服务都可用'} wrapperCol={{span:10}}>
              <LimitServiceFormItem />
            </ProForm.Item>
          </ProForm>}
      </ProCard>
    </Spin>
  </PageContainer>;
};


export default CouponForm;
