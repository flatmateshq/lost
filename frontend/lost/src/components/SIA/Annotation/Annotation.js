import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

import actions from '../../../actions'

import Point from './Point'
import BBox from './BBox'
import Line from './Line'
import Polygon from './Polygon'

const {selectAnnotation } = actions


class Annotation extends Component{

    constructor(props){
        super(props)
        this.state = {
            readyToMove: false
        }
        this.myAnno = React.createRef()
        // this.myKey = _.uniqueId('annokey')
    }

    componentDidMount(){
        if (this.props.data.createMode){
            this.props.selectAnnotation(this.props.data.id)
        }
    }
    componentDidUpdate(){
        console.log('Annotation did update', this.props.data.id)
        if (this.isSelected()){
            console.log('I am selected :-)')
        }
    }
    
    onClick(e: Event){
        e.stopPropagation()
        console.log('Clicked on: ', this.props.type)
        this.props.selectAnnotation(this.props.data.id)
        //Create a new key in order to create a completely new compontent
        //this.myKey = _.uniqueId('annokey')

    }
    onMouseDown(e: Event){
        this.setState({readyToMove: true})
    }
    onMouseUp(e: Event){
        this.setState({readyToMove: false})
    }
    onMouseOut(e: Event){
        if (this.state.readyToMove){
            this.setState({readyToMove: false})
        }
    }

    onMouseMove(e: Event){
        if (this.state.readyToMove && this.isSelected()){
            this.myAnno.current.move(e.movementX, e.movementY)
        }
    }
    
    isSelected(){
        return this.props.selectedAnno === this.props.data.id
    }

    getResult(){
        console.log('Hi there i am a ', this.props.type, this.props.data.id)
        console.log('My annos are: ', this.myAnno.current.state.anno)
    }
    
    getStyle(){
        if (this.isSelected()){
            return {
                stroke: 'orange'
            }
        } else {
            return {}
        }
    }

    getCssClass(){
        if (this.isSelected()){
            return 'selected'
        } else {
            return 'not-selected'
        }
    }

    onNodeClick(e, idx){
        console.log('Annotation')
        console.log('NodeClick on ', idx, e.pageX)
    }
    renderAnno(){
        const type = this.props.type
        const data = this.props.data

        switch(type) {
            case 'point':
                return <Point ref={this.myAnno} data={data} isSelected={this.isSelected()}></Point>
            case 'bBox':
                return <BBox ref={this.myAnno} data={data} 
                    style={this.getStyle()}
                    className={this.getCssClass()}
                    onNodeClick={(e, idx) => this.onNodeClick(e, idx)}
                    isSelected={this.isSelected()}
                    />
            case 'polygon':
                return <Polygon ref={this.myAnno} data={data} 
                    style={this.getStyle()}
                    className={this.getCssClass()}
                    onNodeClick={(e, idx) => this.onNodeClick(e, idx)}
                    isSelected={this.isSelected()}
                    />
            case 'line':
                return <Line ref={this.myAnno} data={data}
                    isSelected={this.isSelected()}
                    />
            default:
                console.log("Wrong annoType for annotations: ",
                    this.props.annoType)
        } 
    }
    render(){
        return (
            <g 
                onClick={e => this.onClick(e)}
                onMouseDown={e => {this.onMouseDown(e)}}
                onMouseUp={e => {this.onMouseUp(e)}}
                onMouseMove={e => {this.onMouseMove(e)}}
                onMouseOut={e => {this.onMouseOut(e)}}
            >
                {this.renderAnno()}
            </g>
        )
        
    }
}

function mapStateToProps(state) {
    return ({
        selectedAnno: state.sia.selectedAnno
    })
}

export default connect(mapStateToProps, {selectAnnotation})(Annotation)