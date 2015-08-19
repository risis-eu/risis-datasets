import React from 'react';
import URIUtil from '../../../utils/URIUtil';
class UploadedView extends React.Component {
    render() {
        let val, outputDIV;
        val = 'http://datasets.risis.eu/' + this.props.spec.value;
        outputDIV = '<' + URIUtil.getURILabel(val) + '>';
        return (
            <div className="ui" ref="uploadedView">
                <a href={val}>{outputDIV}</a>
            </div>
        );
    }
}

export default UploadedView;
