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
        value: it.id,
        label: `${it.name} 满${it.useMin}${it.discountType === Enums.discountType.DEDUCTION.value ? (`减${it.deduction}`) : (`打${it.rebate}折`)}`,
      }));
    }}
  />;
};


export default CouponSelect;
