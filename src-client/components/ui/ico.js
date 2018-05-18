import React from 'react';
import PropTypes from 'prop-types';

import styles from './ico.less'

const Ico = ({type}) => <span dangerouslySetInnerHTML={{
  __html: `<svg class="ico" aria-hidden="true"><use xlink:href="#anticon-${type}"></use></svg>`
}}/>

export default Ico
