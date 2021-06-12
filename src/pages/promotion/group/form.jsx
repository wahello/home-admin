import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Button, Form, message, Result, Spin } from 'antd';
import ProForm, {
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-form';
import { useRequest } from '@@/plugin-request/request';
import { EditableProTable } from '@ant-design/pro-table';
import ServicePicker from '@/components/ServicePicker';
import moment from 'moment';
import { history } from '@@/core/history';
import GroupApi from '@/services/promotion/group';
import _ from 'lodash';
import { useBoolean } from 'ahooks';


const serviceColumns = [
  {
    title: '商品名称',
    dataIndex: 'name',
    width: '25%',
    editable: false,
  },
  {
    title: '规格',
    dataIndex: 'skuName',
    width: '15%',
    editable: false,
  },
  {
    title: '图片',
    dataIndex: 'pic',
    width: '10%',
    valueType: 'image',
    fieldProps: {
      width: 40,
      height: 40,
      preview: {
        mask: false,
      },
    },
    editable: false,
  },
  {
    title: '价格',
    dataIndex: 'price',
    valueType: 'money',
    width: '15%',
    editable: false,
  },
  {
    title: '拼团价格',
    dataIndex: 'groupPrice',
    valueType: 'money',
    width: '15%',
    formItemProps: {
      rules: [{ required: true, message: '拼团价格不能为空' }],
    },
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

const GroupForm = props => {
  const [id] = useState(props.location.query.id);
  const [baseForm] = Form.useForm();
  const serviceRef = useRef();
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [serviceVisible, toggleServiceVisible] = useBoolean(false);

  const disabledKeys = useMemo(() => {
    return [...new Set(editableKeys.map(it => it.split('_')[0]))];
  }, [editableKeys]);

  const getRequest = useRequest(GroupApi.get, { manual: true });

  useEffect(() => {
    if (id) {
      getRequest.run(id);
    }
  }, [id]);

  useEffect(() => {
    if (getRequest.data) {
      const initData = getRequest.data;
      if (initData.service.id) {
        const keys = [];
        initData.services = initData.skus.map(sku => {
          const originalSku = initData.service.skus.find(it => it.id === sku.id);
          keys.push(`${initData.serviceId}_${sku.id}`);
          return {
            serviceId: initData.serviceId,
            skuId: sku.id,
            price: originalSku?.price,
            name: initData.service.name,
            skuName: originalSku?.name,
            groupPrice: sku.groupPrice,
            pic: originalSku?.pic,
          };
        });
        setEditableRowKeys(keys);
      }
      baseForm.setFieldsValue({
        ...getRequest.data,
        dateRange:[getRequest.data.startTime,getRequest.data.endTime]
      });
    }
  }, [getRequest.data]);
  const onSelectService = (rows) => {
    const keys = [];
    const addService = [];
    const services = baseForm.getFieldValue('services') || [];
    rows.filter(it => !disabledKeys.includes(it.id)).forEach(it => {
      it.skus.forEach(sku => {
        keys.push(`${it.id}_${sku.id}`);
        addService.push({
          serviceId: it.id,
          skuId: sku.id,
          price: sku.price,
          name: it.name,
          skuName: it.name,
          groupPrice: 0,
          pic: sku.pic,
        });
      });
    });
    baseForm.setFieldsValue({
      'services': services.concat(addService),
    });
    setEditableRowKeys([...editableKeys, ...keys]);
    toggleServiceVisible.setFalse();
  };
  const onFinish = async values => {
    try {
      const groups = Object.entries(_.groupBy(values.services, 'serviceId')).map(([serviceId, skus]) => {
        const group = {
          name: values.name,
          joinMin: values.joinMin,
          joinHours: values.joinHours,
          virtualHours: values.virtualHours,
          allowSingle: values.allowSingle,
          allowVirtual: values.allowVirtual,
          serviceId,
          skus: skus.map(sku => {
            return {
              id: sku.skuId,
              groupPrice: sku.groupPrice,
            };
          }),
        };
        group.startTime = moment(values.dateRange[0]).startOf('days').valueOf();
        group.endTime = moment(values.dateRange[1]).endOf('days').valueOf();
        return group;
      });

      if (id) {
        await GroupApi.update({ ...groups[0], id });
      } else {
        await GroupApi.add(groups);
      }
      message.success('保存成功');
      history.goBack();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return (
    <PageContainer>
      <Spin spinning={getRequest.loading}>
        <ProCard>
          {getRequest.error ?
            <Result status={500} title={'加载错误'} subTitle={'网络异常，请重试'}
                    extra={<Button type={'primary'} onClick={() => getRequest.run({ id })}>重试</Button>} /> :
            <ProForm form={baseForm} layout={'horizontal'} dateFormatter={'number'} labelCol={{ span: 6 }}
                     wrapperCol={{ span: 18 }}
                     onFinish={onFinish}
                     validateMessages={{
                       required: '此项为必填项',
                     }}
                     submitter={{
                       searchConfig: {
                         submitText: '保存',
                       },
                       render: (_, dom) => <div style={{ textAlign: 'center' }}>{dom.pop()}</div>,
                     }}
                     scrollToFirstError>
              <ProFormText
                name='name'
                width={'md'}
                label='活动名称'
                placeholder='请输入活动名称'
                rules={[{ required: true }]}
                extra={'活动名称将显示在活动列表中，方便商家管理'}
              />
              <ProFormDateRangePicker name={'dateRange'} label={'活动时间'} rules={[{ required: true }]} />

              <ProForm.Item label={'参团人数'} extra={'最低两人成团'} required>
                <ProFormDigit
                  width={100}
                  initialValue={2}
                  fieldProps={{ precision: 0 }}
                  name={'joinMin'}
                  min={2}
                  rules={[{ required: true }]}
                  placeholder={''}
                  noStyle
                />
                <span> 人</span>
              </ProForm.Item>
              <ProForm.Item label={'拼团有效期'} extra={'用户发起拼团后开始计时，需在设置时间内邀请到规定好友人数参团，超过时效时间，则系统判定拼团失败'} required>
                <ProFormDigit
                  width={100}
                  initialValue={24}
                  fieldProps={{ precision: 0 }}
                  name={'joinHours'}
                  min={1}
                  rules={[{ required: true }]}
                  placeholder={''}
                  noStyle
                />
                <span> 小时</span>
              </ProForm.Item>
              <ProFormRadio.Group
                name='allowVirtual'
                label='是否虚拟成团'
                initialValue={false}
                options={[
                  {
                    label: '否',
                    value: false,
                  },
                  {
                    label: '是',
                    value: true,
                  },
                ]}
              />
              <ProFormDependency name={['joinHours', 'allowVirtual']}>
                {({ joinHours, allowVirtual }) => {
                  return allowVirtual ?
                    <ProForm.Item label={'虚拟成团时间'} extra={'用户开团后若超过该时间，系统会自动成团'} required>
                      <ProFormDigit
                        width={100}
                        fieldProps={{ precision: 0 }}
                        name={'virtualHours'}
                        min={1}
                        max={joinHours - 1}
                        rules={[{ required: true }]}
                        placeholder={''}
                        noStyle
                      />
                      <span> 小时</span>
                    </ProForm.Item> : null;
                }}
              </ProFormDependency>
              <ProForm.Item
                label='活动服务'
                required
              >
                <ProForm.Item name={'services'} trigger='onValuesChange' noStyle rules={[{ required: true }]}>
                  <EditableProTable
                    style={{ display: (editableKeys.length || id) ? 'block' : 'none', marginBottom: 10 }}
                    rowKey={record => `${record.serviceId}_${record.skuId}`}
                    actionRef={serviceRef}
                    toolBarRender={false}
                    recordCreatorProps={false}
                    columns={serviceColumns}
                    editable={{
                      type: 'multiple',
                      editableKeys,
                      onChange: setEditableRowKeys,
                      actionRender: (row, _, dom) => {
                        return !id && [dom.delete];
                      },
                    }}
                  />
                </ProForm.Item>
                <ServicePicker visible={serviceVisible} onCancel={toggleServiceVisible.setFalse}
                               disabledKeys={disabledKeys} onChange={onSelectService} />
                {!id && <Button type={'primary'} onClick={toggleServiceVisible.setTrue}>选择服务</Button>}
              </ProForm.Item>
            </ProForm>}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};


export default GroupForm;
