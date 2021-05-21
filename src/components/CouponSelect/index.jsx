import React from 'react';
import CouponApi from '@/services/promotion/coupon';
import Enums from '@/utils/enums';
import { ProFormSelect } from '@ant-design/pro-form';

const CouponSelect = props => {
  return <ProFormSelect
    {...props}
    fieldProps={{
      filterOption: (inputValue, { label }) => {
        return label.indexOf(inputValue) >= 0;
      },
    }}
    request={async () => {
      const { data: couponList } = await CouponApi.list();
      return couponList?.map(it => ({
        value: it._id,
        label: `${it.name} 满${it.discount.use_min}${it.discount.type === Enums.discountType.DEDUCTION.value ? (`减${it.discount.deduction}`) : (`打${it.discount.rebate}折`)}`,
      }));
    }}
  />;
};


export default CouponSelect;
