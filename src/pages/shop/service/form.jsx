import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTimePicker,
} from '@ant-design/pro-form';
import { history, useRequest } from 'umi';
import ProCard from '@ant-design/pro-card';
import ServiceCategoryApi from '@/services/shop/service-category';
import ServiceTagApi from '@/services/shop/service-tag';
import { Button, Form, message, Result, Spin } from 'antd';
import Enums from '@/utils/enums';
import MaterialPicker from '@/components/MaterialPicker';
import { EditableProTable } from '@ant-design/pro-table';
import MyEditor from '@/components/MyEditor';
import ServiceApi from '@/services/shop/service';
import uuid from 'uuid';
import BraftEditor from 'braft-editor';
import moment from 'moment';
import { useBoolean } from 'ahooks';


const skuColumns = [
  {
    title: '规格名称',
    dataIndex: 'name',
    width: '15%',
  },
  {
    title: '价格',
    dataIndex: 'price',
    valueType: 'money',
    width: '15%',
  },
  {
    title: '划线价格',
    dataIndex: 'linePrice',
    valueType: 'money',
    width: '15%',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: '10%',
  },
  {
    title: '起售数量',
    dataIndex: 'minNum',
    valueType: 'digit',
    fieldProps: { precision: 0, min: 1 },
    width: '10%',
  },
  {
    title: '图片',
    dataIndex: 'pic',
    width: '20%',
    renderFormItem: () => <MaterialPicker size={40} />,
  },
  {
    title: '操作',
    valueType: 'option',
  },
];


const ServiceForm = props => {
  const [baseForm] = Form.useForm();
  const skuRef = useRef();
  const [id] = useState(props.location.query.id);
  const [editableKeys, setEditableRowKeys] = useState([]);
  const getRequest = useRequest(ServiceApi.get, { manual: true });
  const [submitLoading, toggleSubmitLoading] = useBoolean(false);

  const addSku = () => {
    skuRef.current?.addEditRecord?.({
      id: uuid().replaceAll('-', ''),
      minNum: 1,
    }, { newRecordType: 'dataSource' });
  };

  useEffect(() => {
    if (id) {
      getRequest.run(id);
    } else {
      const sku = {
        id: uuid().replaceAll('-', ''),
        minNum: 1,
      };
      baseForm.setFieldsValue({
        payType: Enums.payType.BEFORE.value,
        skus: [sku],
      });
      setEditableRowKeys([sku.id]);
    }
  }, [id]);

  useEffect(() => {
    const service = getRequest.data;
    if (service) {
      const skus = service.skus.filter(sku => !sku.default);
      const formData = {
        ...service,
        skus,
        pics: service.pics?.split(','),
        content: BraftEditor.createEditorState(service.content),
      };
      baseForm.setFieldsValue(formData);
      setEditableRowKeys(skus.map(it => it.id));
    }
  }, [getRequest.data]);

  const submitService = async values => {
    if (values.skus) {
      const err = values.skus.find(it => {
        return !it.name || Number.isNaN(Number(it.price));
      });
      if (err) {
        baseForm.scrollToField('skus', { block: 'center' });
        message.error('服务规格必须填写完整');
        return;
      }
    }
    try {
      toggleSubmitLoading.setTrue();
      const submitValues = {
        ...values,
        content: values.content?.toHTML(),
        pics: values.pics?.join(','),
      };
      if (id) {
        await ServiceApi.update({ ...submitValues, id });
      } else {
        await ServiceApi.add(submitValues);
      }
      message.success('保存成功');
      history.goBack();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      toggleSubmitLoading.setFalse();
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
                name='name'
                width={'lg'}
                label='服务名称'
                placeholder='请输入名称'
                rules={[{ required: true }]}
              />
              {/*<ProFormText*/}
              {/*  name='sub_title'*/}
              {/*  width={'lg'}*/}
              {/*  label='描述信息'*/}
              {/*  placeholder='副标题，展示在名称下方'*/}
              {/*/>*/}
              <ProFormSelect
                name='keywords'
                width={'lg'}
                label='关键字'
                mode={'tags'}
                fieldProps={{ open: false }}
                placeholder=''
                extra={'用于搜索引擎优化，可输入多个，回车分隔。例如北京上门保洁、北京冰箱清洗等'}
              />
              <ProFormSelect name='categoryId' label='服务分类' width='md' placeholder='请选择分类' rules={[{ required: true }]}
                             request={async () => {
                               const { data: categoryList } = await ServiceCategoryApi.list();
                               return categoryList?.map((cat) => ({
                                 value: cat.id,
                                 label: cat.name,
                                 children: cat.children.map(it => ({ value: it.id, label: it.name })),
                                 optionType: 'optGroup',
                               }));
                             }}
              />
              <ProFormSelect name='tagIds' label='服务标签' mode={'multiple'} width={'md'}
                             request={async () => {
                               const { data: tagList } = await ServiceTagApi.list();
                               return tagList?.map((tag) => ({
                                 value: tag.id,
                                 label: tag.name,
                               }));
                             }}
              />
              <ProFormTimePicker.RangePicker name='appointTimeRange' label='可预约时间段'
                                             fieldProps={{ minuteStep: 30, format: 'HH:mm' }}
                                             initialValue={[moment('2020-01-01 08:30'), moment('2020-01-01 18:00')]} />
              <ProFormDigit name={'virtualSales'} label={'虚拟销量'} min={0} initialValue={0} width={'xs'}
                            fieldProps={{ precision: 0 }} />
              <ProForm.Item
                label='服务规格'
                required
              >
                <ProForm.Item name='skus' trigger='onValuesChange' noStyle rules={[{ required: true }]}>
                  <EditableProTable
                    style={{ display: editableKeys.length ? 'block' : 'none' }}
                    rowKey={'id'}
                    actionRef={skuRef}
                    toolBarRender={false}
                    columns={skuColumns}
                    recordCreatorProps={{
                      newRecordType: 'dataSource',
                      creatorButtonText: '添加规格',
                      record: () => ({
                        id: uuid().replaceAll('-', ''),
                        minNum: 1,
                      }),
                    }}
                    editable={{
                      type: 'multiple',
                      editableKeys,
                      onChange: setEditableRowKeys,
                      actionRender: (row, _, dom) => {
                        return [dom.delete];
                      },
                    }}
                  />
                </ProForm.Item>
                {!editableKeys.length && <Button onClick={addSku}>添加规格</Button>}
              </ProForm.Item>

              <ProFormRadio.Group
                name={'payType'}
                label='付款方式'
                rules={[{ required: true }]}
                options={Object.values(Enums.payType).map(({ text, value }) => ({ label: text, value }))}
              />
              <ProFormDependency name={['payType']}>
                {({ payType }) => payType === Enums.payType.PART.value && <ProFormDigit
                  width='sm'
                  name={'payPart'}
                  label={'预定金额'}
                  rules={[{ required: true }]}
                />}
              </ProFormDependency>
              <ProForm.Item name={'mainPic'} label={'主图'} rules={[{ required: true }]}>
                <MaterialPicker />
              </ProForm.Item>
              <ProForm.Item name={'pics'} label={'轮播图'}>
                <MaterialPicker mode={'multi'} />
              </ProForm.Item>
              <ProForm.Item name={'content'} label={'服务详情'}>
                <MyEditor />
              </ProForm.Item>
              <div style={{ textAlign: 'center' }}>
                <Button htmlType={'submit'} type={'primary'} loading={submitLoading}>保存</Button>
              </div>
            </Form>}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};


export default ServiceForm;
