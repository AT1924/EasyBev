import React from 'react';
import PropTypes from 'prop-types';
import '../style/react-webcam.css';
class Qrbutton extends React.Component {

    constructor(){
        super();
        this.state = {
            hasUserMedia: false,
        };
        this.scanBarcode = this.scanBarcode.bind(this);
    }

    showResults(results) {
        let context = this.clearOverlay();
        let txts = [];
        try {
            let localization;
            for (var i = 0; i < results.length; ++i) {
                if (results[i].LocalizationResult.ExtendedResultArray[0].Confidence >= 30) {
                    txts.push(results[i].BarcodeText);
                    localization = results[i].LocalizationResult;
                    this.drawResult(context, localization, results[i].BarcodeText);
                }
            }

            this.scanBarcode();

        } catch (e) {
            this.scanBarcode();
        }
    }

    clearOverlay() {
        let context = document.getElementById('overlay').getContext('2d');
        context.clearRect(0, 0, this.props.width, this.props.height);
        context.strokeStyle = '#ff0000';
        context.lineWidth = 5;
        return context;
    }

    drawResult(context, localization, text) {
        context.beginPath();
        context.moveTo(localization.X1, localization.Y1);
        context.lineTo(localization.X2, localization.Y2);
        context.lineTo(localization.X3, localization.Y3);
        context.lineTo(localization.X4, localization.Y4);
        context.lineTo(localization.X1, localization.Y1);
        context.stroke();

        context.font = '18px Verdana';
        context.fillStyle = '#ff0000';
        let x = [ localization.X1, localization.X2, localization.X3, localization.X4 ];
        let y = [ localization.Y1, localization.Y2, localization.Y3, localization.Y4 ];
        x.sort(function(a, b) {
            return a - b;
        });
        y.sort(function(a, b) {
            return b - a;
        });
        let left = x[0];
        let top = y[0];

        context.fillText(text, left, top + 50);
    }

    loadCamera() {
        console.log("AY")
    }
    scanBarcode() {
        if (window.reader) {
            let canvas = document.createElement('canvas');
            canvas.width = this.props.width;
            canvas.height = this.props.height
            let ctx = canvas.getContext('2d');
            ctx.drawImage(this.video, 0, 0, this.props.width, this.props.height);

            window.reader.decodeBuffer(
                ctx.getImageData(0, 0, canvas.width, canvas.height).data,
                canvas.width,
                canvas.height,
                canvas.width * 4,
                window.dynamsoft.BarcodeReader.EnumImagePixelFormat.IPF_ARGB_8888
            )
                .then((results) => {
                    this.showResults(results);
                });
        }

    }
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
                playsInline
                style={this.props.style}
                ref={(ref) => {
                    this.video = ref;
                }}
            />
            <canvas id="overlay" width={this.props.width} height={this.props.height}></canvas>
        </div>)
    }
}




export default Qrbutton;
