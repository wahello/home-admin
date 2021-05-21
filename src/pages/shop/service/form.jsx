import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ProFormCheckbox,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { history, useRequest } from 'umi';
import ProCard from '@ant-design/pro-card';
import ServiceCategoryApi from '@/services/shop/service-category';
import ServiceTagApi from '@/services/shop/service-tag';
import { Button, Form, Input, message, Result, Select, Spin, Tag } from 'antd';
import Enums from '@/utils/enums';
import MaterialPicker from '@/components/MaterialPicker';
import { EditableProTable } from '@ant-design/pro-table';
import MyEditor from '@/components/MyEditor';
import ServiceApi from '@/services/shop/service';
import uuid from 'uuid';


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
    dataIndex: 'line_price',
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
    dataIndex: 'min_num',
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

  const addSku = () => {
    skuRef.current?.addEditRecord?.({
      id: uuid().replaceAll('-', ''),
      min_num: 1,
    }, { newRecordType: 'dataSource' });
  };

  useEffect(() => {
    if (id) {
      getRequest.run({ id });
    } else {
      const sku = {
        id: uuid().replaceAll('-', ''),
        min_num: 1,
      };
      baseForm.setFieldsValue({
        pay: {
          type: Enums.payType.BEFORE.value,
        },
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
      const submitValues = {
        ...values,
        main_pic: values.main_pic,
        service_content: values.service_content.toHTML(),
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
                  submitter={{
                    searchConfig: {
                      submitText: '保存',
                    },
                    render: (_, dom) => <div style={{ textAlign: 'center' }}>{dom.pop()}</div>,
                    submitButtonProps: {
                      size: 'large',
                    },
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
              <ProFormSelect name='category' label='服务分类' width='md' placeholder='请选择分类' rules={[{ required: true }]}
                             request={async () => {
                               const { data: categoryList } = await ServiceCategoryApi.list();
                               return categoryList?.map(({ _id, name, children }) => ({
                                 value: _id,
                                 label: name,
                                 children: children.map(it => ({ value: it._id, label: it.name })),
                                 optionType: 'optGroup',
                               }));
                             }}
              />
              <ProFormSelect name='tags' label='服务标签' mode={'multiple'} width={'md'}
                             request={async () => {
                               const { data: tagList } = await ServiceTagApi.list();
                               return tagList?.map(({ _id, name }) => ({
                                 value: _id,
                                 label: name,
                               }));
                             }}
              />
              <ProFormDigit name={'virtual_sales'} label={'虚拟销量'} min={0} initialValue={0} width={'xs'}
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
                        min_num: 1,
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
                name={['pay', 'type']}
                label='付款方式'
                rules={[{ required: true }]}
                options={Object.values(Enums.payType).map(({ text, value }) => ({ label: text, value }))}
              />
              <ProFormDependency name={['pay', 'type']}>
                {({ pay }) => pay?.type === Enums.payType.PART.value && <ProFormDigit
                  width='sm'
                  name={['pay', 'part']}
                  label={'预定金额'}
                  rules={[{ required: true }]}
                />}
              </ProFormDependency>
              <ProForm.Item name={'main_pic'} label={'主图'} rules={[{ required: true }]}>
                <MaterialPicker />
              </ProForm.Item>
              <ProForm.Item name={'pics'} label={'轮播图'}>
                <MaterialPicker mode={'multi'} />
              </ProForm.Item>
              <Form.Item name={'service_content'} label={'服务详情'}>
                <MyEditor />
              </Form.Item>
              <Button htmlType={'submit'}>提交</Button>
            </Form>}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};


export default ServiceForm;
