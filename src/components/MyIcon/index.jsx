import { createFromIconfontCN } from '@ant-design/icons';
import PropTypes from 'prop-types';

const Icon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2526926_csf983ljh18.js',
});

const MyIcon = props => {
  return <Icon type={`icon-${props.type}`} style={{ fontSize: props.size, color: props.color }} />;
};
MyIcon.prototype = {
  type: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};
export default MyIcon;
