import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { EditableProTable } from '@ant-design/pro-table';

const Index = props => {
  const serviceRef = useRef();
  const [editableKeys, setEditableRowKeys] = useState([]);

  const [dataSource, setDataSource] = useState([]);

  return (
    <>
      <EditableProTable
        style={{ display: editableKeys.length ? 'block' : 'none' }}
        rowKey={'id'}
        actionRef={serviceRef}
        value={dataSource}
        onChange={setDataSource}
        toolBarRender={false}
        recordCreatorProps={false}
        columns={serviceColumns}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          actionRender: (row, _, dom) => {
            return [dom.delete];
          },
        }}
      />

    </>
  );
};

Index.propTypes = {};

export default Index;
