import React from 'react';
import ReactDOM from 'react-dom';
import {list} from '../../../../data/mimeTypes';
import {BasicIndividualInput} from './BasicIndividualInput';

class MediaTypeInput extends React.Component {
    constructor(props) {
        super(props);
        let v = this.props.spec.value;
        if(this.props.spec.isDefault){
            v = this.createDefaultValue(this.props.spec.valueType, this.props.spec.dataType);
        }
        //to initialize value in Property state
        this.props.onDataEdit(v);
        this.state = {value: v, userDefinedMode: 0};
    }
    componentDidMount() {
        if(!this.props.noFocus){
            ReactDOM.findDOMNode(this.refs.mediaTypeInputSelect).focus();
        }
    }

    createDefaultValue(valueType, dataType) {
        if(this.props.config && this.props.config.defaultValue){
            return this.props.config.defaultValue[0];
        }else{
            return 'text/plain';
        }
    }
    handleChange(event) {
        if(event.target.value === 'other'){
            this.setState({userDefinedMode: 1});

        }else{
            this.props.onDataEdit(event.target.value);
            this.setState({value: event.target.value});
        }
    }
    handleDataEdit(value){
        this.props.onDataEdit(value);
    }
    handleEnterPress(){
        this.props.onEnterPress();
    }
    buildOptions(data) {
        let optionsList = [];
        for (let prop in data) {
            optionsList.push(<option key={prop} value={data[prop]}> {prop} [ {data[prop]} ]</option>);
        }
        return optionsList;
    }
    render() {
        let output;
        if(this.state.userDefinedMode){
            output = <BasicIndividualInput placeholder="Enter you other format..." spec={{value: '', valueType: this.props.spec.valueType, dataType: this.props.spec.dataType}} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)} allowActionByKey="1"/>;
        }else{
            let optionList = this.buildOptions(list);
            output = <div className="field">
                                <select className="ui search dropdown" ref="mediaTypeInputSelect" value={this.state.value} onChange={this.handleChange.bind(this)}>
                                    {optionList}
                                    {(this.props.config.allowUserDefinedValue? <option value="other"> **Other** </option>: '' )}
                                </select>
                     </div>
        }
        return (
            <div className="content ui form" ref="mediaTypeInput">
                {output}
            </div>
        );
    }
}

export default MediaTypeInput;
