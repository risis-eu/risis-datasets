import React from 'react';

class FileSizeView extends React.Component {
    convertBToMB(size){
        let m = (size/1024)/1024;
        return m;
    }
    render() {
        let label, outputDIV;
        let size = this.convertBToMB(this.props.spec.value);
        if(size<1){
            label = this.props.spec.value + ' Byte';
        }else{
            label = size + ' MB';
        }
        outputDIV = <span> {label} </span>;
        return (
            <div className="ui" ref="fileSizeView">
                {outputDIV}
            </div>
        );
    }
}

export default FileSizeView;
