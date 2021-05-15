import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Input, Space } from 'antd';
import MaterialPicker from '@/components/MaterialPicker';
import LinkPicker from '@/pages/shop/diy/components/LinkPicker';
import { useControllableValue } from 'ahooks';

const LinkSelect = props => {
  const [links, setLinks] = useControllableValue(props, { defaultValue: [] });

  const selectPic = (v,idx) => {
    const newLinks = [...links];
    newLinks[idx].pic=v
    setLinks(newLinks)
  };
  const selectPage = (v,idx) => {
    const newLinks = [...links];
    newLinks[idx].page=v
    setLinks(newLinks)
  };
  const renderAddBtn = useMemo(()=>{
    if (props.max > 1) {
      if (links?.length <props.max) {
        return <Button type={'primary'} onClick={()=>setLinks([...links,{}])} block>添加</Button>
      }
    }
    return null;
  },[links, props.max, setLinks])
  return <div style={{ width:300 }}>
    {links?.map((link,idx)=>{
      return <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Card size={'small'}>
          <div style={{ display: 'flex', alignItems: 'center',  }}>
            <MaterialPicker size={75} value={link?.pic} onChange={v=>selectPic(v,idx)} />
            <Space direction={'vertical'} style={{ marginLeft: 10 }}>
              {props.title && <Input placeholder={'输入标题'} />}
              <LinkPicker value={link?.page} onChange={v=>selectPage(v,idx)} />
            </Space>
          </div>
        </Card>
      </div>
    })}
    {renderAddBtn}
  </div>;
};

LinkSelect.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  title: PropTypes.bool,
  max: PropTypes.number,
};
LinkSelect.defaultProps = {
  title: false,
  max: 1,
};

export default LinkSelect;
