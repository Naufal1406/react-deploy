import React, { Component } from 'react'

export default function Cell({
    content,
    header,
  }) {
  
    const cellMarkup = header ? (
      <th className="text-center text-nowwrap">
        {content}
      </th>
    ) : (
        content
    );
  
    return (cellMarkup);
  }