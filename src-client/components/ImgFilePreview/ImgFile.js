import React from 'react'
import "./ImgPreview.less"

export default class ImgFile extends React.Component {
  constructor() {
    super()
    this.state = {
      URL: ""
    }
  }

  buildPreviewImg = (file) => {
    let URL = ""
    let reader = new FileReader();
    reader.onload = (e) => {
      URL = e.target.result
    }
    reader.onloadend = () => {
      this.setState({URL})
    }
    reader.readAsDataURL(file);
  }

  componentWillReceiveProps = (props) => {
    this.buildPreviewImg(props.file)
  }
  componentDidMount = () => {
    this.buildPreviewImg(this.props.file)
  }


  render() {
    return <img src={this.state.URL} className="preview-img"/>
  }
}


