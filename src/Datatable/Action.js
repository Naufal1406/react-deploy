import React from 'react'
import { Link } from 'react-router-dom'

export default function Action(props) {
    const link = props.link ? (props.link) : ("#")
    const actionType = <Link to={link} className={"btn btn-" + props.type} title={props.title} onClick={props.onClick} data-toggle={props.dataToggle} data-target={props.dataTarget}><i className={"fas fa-" + props.icon}/></Link>
    return (actionType);
}
