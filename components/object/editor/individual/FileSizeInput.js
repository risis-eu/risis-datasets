import React from 'react';
import ReactDOM from 'react-dom';

class FileSizeInput extends React.Component {
    constructor(props) {
        super(props);
        let v = this.props.spec.value;
        if(this.props.spec.isDefault){
            v = this.createDefaultValue(this.props.spec.valueType, this.props.spec.dataType);
        }
        //to initialize value in Property state
        this.props.onDataEdit(v);
        this.state = {value: this.convertBToMB(v), unit: 'MB'};
    }
    componentDidMount() {
        if(!this.props.noFocus){
            ReactDOM.findDOMNode(this.refs.fileSizelInput).focus();
        }
    }
    handleKeyDown(evt) {
        if(this.props.allowActionByKey){
            switch (evt.keyCode) {
                //case 9: // Tab
                case 13: // Enter
                    this.props.onEnterPress();
                    break;
            }
        }
    }
    getRandomNumber() {
        return Math.round(+new Date() / 1000);
    }
    createDefaultValue(valueType, dataType) {
        if(this.props.config && this.props.config.defaultValue){
            return this.props.config.defaultValue[0];
        }else{
            return '';
        }
    }
    sizeToB(source, size){
        let v;
        switch(source){
            case 'B':
                v = size;
            break;
            case 'KB':
                v = size * 1024;
            break;
            case 'MB':
                v = size * 1024 * 1024;
            break;
            case 'GB':
                v = size * 1024 * 1024 * 1024;
            break;
            case 'TB':
                v = size * 1024 * 1024 * 1024 * 1024;
            break;
        }
        return v;
    }
    handleChange(event) {
        let v = this.sizeToB(this.state.unit, event.target.value);
        this.props.onDataEdit(v);
        this.setState({value: event.target.value});
    }
    handleUnitChange(event) {
        this.setState({unit: event.target.value});
        let v = this.sizeToB(event.target.value, this.state.value);
        this.props.onDataEdit(v);
    }
    convertBToMB(size){
        let m = (size/1024)/1024;
        return m;
    }
    render() {
        let fileSizeUnits = {
          'B'     : 'Bytes',
          'KB'    : 'Kilobyte = 1024 bytes',
          'MB'    : 'Megabyte = 1024 KB',
          'GB'    : 'Gigabyte = 1024 MB',
          'TB'    : 'Terabyte = 1024 GB'
        };
        let options=[];
        for (let prop in fileSizeUnits) {
            options.push({short: prop, full: fileSizeUnits[prop]});
        }
        let optionsList= options.map(function(m, index) {
              return <option key={index} value={m.short}>{m.short} : {m.full}</option>
        });
        return (
            <div className="ui">
                <input ref="fileSizeInput" type="text" value={this.state.value} placeholder="File Size" onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}/>
                <select className="content ui form" ref="fileSizeUnit" value={this.state.unit} onChange={this.handleUnitChange.bind(this)}>
                    {optionsList}
                </select>
            </div>
        );
    }
}

export default FileSizeInput;
