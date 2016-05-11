import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import request from 'superagent';

class FileUploader extends React.Component {
    constructor(props) {
        super(props);
        let v = this.props.spec.value;
        this.state = {value: v};
    }
    componentDidMount() {

    }
    getRandomNumber() {
        return Math.round(+new Date() / 1000);
    }
    getFormatFromName(name) {
        let tmp = name.split('.');
        return tmp[tmp.length - 1];
    }
    onDrop(files) {
        let req, fname;
        files.forEach((file)=> {
            fname = encodeURIComponent(this.props.config.filePrefix) + this.getRandomNumber() + '.' + this.getFormatFromName(file.name);
            req = request.post('/uploadFile/' + fname + '/' + this.props.config.fileSizeLimit)
            req.attach('file', file, file.name);
        });

        req.on('progress', function(e) {
            //console.log('Percentage done: ', e.percent);
        }).end((err,res)=> {
            this.props.onDataEdit(this.props.config.uploadFolder + '/' + fname);
            this.setState({value: this.props.config.uploadFolder + '/' + fname});
            this.props.onEnterPress();
            //console.log(err,res);
        });

    }
    render() {
        return (
            <div className="ui">
                <Dropzone onDrop={this.onDrop.bind(this)} ref="fileUploader" multiple={false} accept="application/pdf, application/msword,  application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                  <div><div className="ui basic big button info">Try dropping the file here, or click here to select your file to upload.</div></div>
                </Dropzone>
            </div>
        );
    }
}

export default FileUploader;
//                <input ref="basicIndividualInput" type="text" value={this.state.value} placeholder={placeholder} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}/>
