import React from 'react'

import Button from 'antd/lib/button';

import "./ImgPreview.less"
import ImgFile from "./ImgFile";

export default class ImgPreview extends React.Component {
  constructor() {
    super()
    this.state = {}
  }


  render() {

    let arr = this.props.files.map((file, i) =>
      <span className="preview-span" key={file.name}>
        <span style={{display: "flex"}}>
          <span><ImgFile file={file}/></span>
           <Button className="preview-close-btn" shape="circle" onClick={() => this.props.delete(i)} icon="close" size={"small"}/>
        </span>
        <div>
           <span>{file.name}</span>
        </div>
      </span>
    )
    return <div>{arr}</div>
  }
}


