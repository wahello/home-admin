import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Input, Space } from 'antd';
import MaterialPicker from '@/components/MaterialPicker';
import LinkPicker from '@/pages/app/diy/components/LinkPicker';
import { useControllableValue } from 'ahooks';
import { CloseCircleOutlined } from '@ant-design/icons';

const LinkSelect = props => {
  const [links, setLinks] = useControllableValue(props, { defaultValue: [] });
  const selectPic = (v, idx) => {
    const newLinks = [...links];
    newLinks[idx].pic = v;
    setLinks(newLinks);
  };
  const selectPage = (v, idx) => {
    const newLinks = [...links];
    newLinks[idx].page = v;
    setLinks(newLinks);
  };
  const changeTitle = (v, idx) => {
    const newLinks = [...links];
    newLinks[idx].title = v.target.value;
    setLinks(newLinks);
  };
  const renderAddBtn = useMemo(() => {
    if (props.max > 1) {
      if (links?.length < props.max) {
        return <Button type={'primary'} onClick={() => setLinks([...links, {}])} block>添加</Button>;
      }
    }
    return null;
  }, [links, props.max, setLinks]);

  const removeItem = idx => {
    const newLinks = [...links];
    newLinks.splice(idx, 1);
    setLinks(newLinks);
  };

  return <div style={{ width: 300 }}>
    {links?.map((link, idx) => {
      return <div style={{ marginTop: 10, marginBottom: 10, position: 'relative' }} key={idx.toString()}>
        <Card size={'small'}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MaterialPicker size={75} value={link?.pic} onChange={v => selectPic(v, idx)} />
            <Space direction={'vertical'} style={{ marginLeft: 10 }}>
              {props.title && <Input value={link?.title} onChange={v => changeTitle(v, idx)} placeholder={'输入标题'} />}
              <LinkPicker value={link?.page} onChange={v => selectPage(v, idx)} />
            </Space>
          </div>
        </Card>
        {props.canDelete && <CloseCircleOutlined style={{ position: 'absolute', top: -5, right: -5, color: '#999999' }}
                                                 onClick={() => removeItem(idx)} />
        }
      </div>;
    })}
    {renderAddBtn}
  </div>;
};

LinkSelect.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  title: PropTypes.bool,
  max: PropTypes.number,
  canDelete: PropTypes.bool,
};
LinkSelect.defaultProps = {
  title: false,
  max: Number.MAX_SAFE_INTEGER,
  canDelete: false,
};

export default LinkSelect;
