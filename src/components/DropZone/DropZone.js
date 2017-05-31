
import React from 'react'
import Dropzone from "react-dropzone"
import "./DropZone.less"
export  default  class DropZone extends React.Component {
  constructor() {
    super()
    this.state = {
      accepted: [],
      rejected: []
    }
  }
  onDrop= (acceptedFiles,rejected)=> {
    this.setState({ accepted:acceptedFiles, rejected })
    //this.props.
    const req = request.post('/upload');
    acceptedFiles.forEach(file => {
      req.attach(file.name, file);
    });
    req.end(callback);
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone   accept="image/jpeg, image/png" onDrop={this.onDrop} >
            <div className="dropzone-msg">
              <div>拖入文件(多文件请一起拖入)</div>
              <div>支持jpeg,png,zip,html</div>
              <div>图片会自动索引,压缩包会自动解压</div>

              {
                this.state.accepted.map(f => <div key={f.name}>{f.name} - {f.size} bytes</div>)
              }
            </div>
          </Dropzone>
        </div>
        <aside>

        </aside>
      </section>
    );
  }
}


