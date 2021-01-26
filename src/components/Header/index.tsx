import React from 'react'
// import classNames from 'classnames'
// import PropTypes from 'prop-types'
import styles from './index.less'

interface Props {
  name: string
  color: string
}

const Header: React.FC<Props> = ({ name, color }: Props) => {
  return (
    <div className={styles.header} style={{ color }}>
      <div>Header {name}</div>
    </div>
  )
}

// Header.defaultProps = {
// }

// Header.propTypes = {
//   : PropTypes.
// }

export default Header
