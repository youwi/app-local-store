
import React from 'react'
import Dropzone from "react-dropzone"
import {Button,InputNumber} from "antd"
import "./PreviewBox.less"
import VersionNumber from "../VersionNumber/VersionNumber";
import ImageGallery from 'react-image-gallery';
export  default  class PreviewBox extends React.Component {



  handleImageLoad(event) {
    console.log('Image loaded ', event.target)
  }

  render() {
    let links=this.props.links||[]

    const images =links.map((link)=>{return{original:link,thumbnail:link}})

    return (
      <ImageGallery
        items={images}
        slideInterval={2000}
        onImageLoad={this.handleImageLoad}/>
    );
  }

}


