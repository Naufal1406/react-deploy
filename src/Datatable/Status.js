import React from 'react'

const Status = props => <span className={"badge bg-" + props.type} >{props.val}</span>

export default Status
