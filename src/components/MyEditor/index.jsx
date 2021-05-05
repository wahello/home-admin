import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MaterialPicker from '@/components/MaterialPicker';
import { PictureOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';

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

  const [editorState, setEditorState] = useState(null);

  useEffect(() => {
    setEditorState(BraftEditor.createEditorState(props.value));
  }, [props.value]);

  const insertPic = useMemo(() => {
    return pics => {
      const newValue = ContentUtils.insertMedias(editorState, pics.map(url => ({
        type: 'IMAGE',
        url,
      })));
      props.onChange(newValue.toHTML());
    };
  }, [editorState]);
  const onBlur = e => {
    props.onChange(e.toHTML());
  };

  return <BraftEditor {...editorProps} value={editorState} onBlur={onBlur}
                      extendControls={[{
                        key: 'material',
                        type: 'button',
                        text: <MaterialPicker customRender={customProps => <PictureOutlined {...customProps} />}
                                              mode={'multi'} maxCount={100}
                                              onChange={insertPic} />,
                      }]}
  />;
};

MyEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default MyEditor;
