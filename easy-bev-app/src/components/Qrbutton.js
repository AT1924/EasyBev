import React from 'react';

class Qrbutton extends React.Component {
    render() {
        //return <button onClick={loadCamera}></button>;
        return (<div id='videoview' width={this.props.width} height={this.props.height}>
            <button onClick={this.scanBarcode}>Scan Barcodes</button>
            <video
                autoPlay
                width={this.props.width}
                height={this.props.height}
                src={this.state.src}
                muted={this.props.audio}
                className={this.props.className}
                playsinline
                style={this.props.style}
                ref={(ref) => {
                    this.video = ref;
                }}
            />
            <canvas id="overlay" width={this.props.width} height={this.props.height}></canvas>
        </div>)
    }
}

function loadCamera() {
    console.log("AY")
}

export default Qrbutton;
