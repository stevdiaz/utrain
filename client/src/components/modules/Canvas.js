import React, { Component } from 'react';
import './Canvas.css';

class Canvas extends Component {
    constructor(props) {
        super(props);
        let ref = React.createRef();
        this.state = {
            selectedClassIndex: 0,
            isPainting: false,
            prevPos: {
                offsetX: 0,
                offsetY: 0,
            },
            line: [],
            ref: ref,
        };
    }
    componentDidMount() {
        this.state.ref.current.width = 270;
        this.state.ref.current.height = 270;
        const ctx = this.state.ref.current.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;
        // this.setCanvasLoop();
    }
    componentDidUpdate(prevProps) {
        if (!this.props.isPredicting && this.state.selectedClassIndex < prevProps.classes.length && this.state.selectedClassIndex >= this.props.classes.length) {
            // our selected class has been deleted
            this.setState({
                selectedClassIndex: this.props.classes.length - 1,
            });
        }
    }
    onMouseDown({ nativeEvent }) {
        const { offsetX, offsetY } = nativeEvent;
        const offSetData = { offsetX, offsetY};
        this.setState({
            isPainting: true,
            prevPos: offSetData,
        });
    }
    onMouseMove({ nativeEvent }) {
        if (this.state.isPainting) {
            const { offsetX, offsetY} = nativeEvent;
            const offSetData = { offsetX, offsetY};
            const positionData = {
                start: { ...this.state.prevPos },
                stop: { ...offSetData},
            };
            this.setState(prevState => ({
                line: prevState.line.concat(positionData),
            }), () => this.paint(this.state.prevPos, offSetData));
        }
    }
    endPaintEvent() {
        this.setState({
            isPainting: false,
        });
    }
    paint(prevPos, currPos) {
        const { offsetX, offsetY} = currPos;
        const { offsetX: x, offsetY: y} = prevPos;

        const ctx = this.state.ref.current.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = '#DA63FF';
        ctx.moveTo(x, y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        this.setState({
            prevPos: {
                offsetX,
                offsetY,
            },
        });
    }
    onSelectClass(evt) {
        let selectedClassIndex = evt.target.selectedIndex;
        this.setState({
            selectedClassIndex: selectedClassIndex,
        });
    }
    onCapture() {
        if (this.state.line.length === 0) {
            // nothing drawn
            return;
        }
        const canvas = this.state.ref.current;
        const imageSrc = canvas.toDataURL();
        this.props.onCapture(imageSrc, this.state.selectedClassIndex);
        this.onClearCanvas();
        console.log(this.state);
    }
    onClearCanvas() {
        const canvas = this.state.ref.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.setState({
            prevPos: {
                offsetX: 0,
                offsetY: 0,
            },
            line: [],
        });
    }
    setCanvasLoop() {
        this.props.isPredicting && setTimeout(() => this.onCanvasChange(), 1500);
    }
    onCanvasChange() {
        console.log('canvas is changing!');
        const canvas = this.state.ref.current;
        const imageSrc = canvas.toDataURL();
        this.props.onPredict(imageSrc, this.state.selectedClassIndex);
        this.setCanvasLoop();
    }
    render() {
        const classOptions = this.props.isPredicting ? null : this.props.classes.map((classification, classIndex) => {return (
            <option value={classification} key={classification + classIndex} selected={this.state.selectedClassIndex === classIndex}>{classification}</option>
        )});
        return (
            <div className={`Canvas-container ${this.props.isPredicting ? 'Canvas-containerPredict' : ''}`}>
                <div className={`Canvas-instructions ${this.props.isPredicting ? 'Canvas-instructionsPredict' : ''}`}>
                    Draw Below
                </div>
                <img className='Canvas-deleteImage' src={require('../../public/trash.png')} onClick={() => this.onClearCanvas()}/>
                <div className='Canvas-canvas'>
                    <canvas 
                    id={this.props.isPredicting ? 'CanvasPredict' : 'CanvasData'}
                    ref={this.state.ref}
                    style={{background: 'white' }}
                    onMouseDown={(evt) => this.onMouseDown(evt)}
                    onMouseLeave={() => this.endPaintEvent()}
                    onMouseUp={() => this.endPaintEvent()}
                    onMouseMove={(evt) => this.onMouseMove(evt)}
                    />
                </div>
                {!this.props.isPredicting && (
                    <div className='Canvas-captureAndSend'>
                        <div className={`Canvas-captureButton ${this.state.line.length === 0 ? 'Canvas-captureButtonDisabled' : ''}`} onClick={() => this.onCapture()}>Capture</div>
                        <span> to </span> 
                        <select className='Canvas-captureSelect' onChange={(evt) => this.onSelectClass(evt)}>
                            {classOptions}
                        </select>
                    </div>
                )}
            </div>
        )
    }
}
export default Canvas;