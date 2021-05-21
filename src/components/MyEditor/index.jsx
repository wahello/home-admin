import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MaterialPicker from '@/components/MaterialPicker';
import { PictureOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import { useControllableValue } from 'ahooks';

const editorProps = {
  style: { border: '1px solid #d1d1d1' },
  excludeControls: ['link', 'media'],
  media: false,
  imageControls:
    ['float-left',
      'float-right',
      'align-left',
      'align-center',
      'align-right',
      'remove'],

};
const MyEditor = props => {

  const [editorState, setEditorState] = useControllableValue(props, { defaultValue: [] });

  const insertPic = pics => {
    setEditorState(ContentUtils.insertMedias(editorState, pics.map(url => ({
      type: 'IMAGE',
      url,
    }))));
  };

  const onBlur = e => {
    setEditorState(e);
  };

  return <BraftEditor {...editorProps} value={editorState} onBlur={onBlur}
                      extendControls={[{
                        key: 'material',
                        type: 'button',
                        text: <MaterialPicker customRender={customProps => <PictureOutlined {...customProps} />}
                                              mode={'multi'} maxCount={100}
                                              onChange={insertPic} destroyOnClose/>,
                      }]}
  />;
};

MyEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MyEditor;
