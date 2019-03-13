import React, {Component} from 'react'
import actions from 'actions/pipeline/pipelineStartModals/annoTask'
import {connect} from 'react-redux'
const {selectLabelTree} = actions
import {Card, CardBody} from 'reactstrap'
import ReactTable from 'react-table'

class SelectTree extends Component{
    constructor(){
        super()
        this.selectRow = this.selectRow.bind(this)
    }

    selectRow(row){
        console.log('------rrrrrrrr------------------------------');
        console.log(row);
        console.log('------------------------------------');
        this.props.selectLabelTree(
            this.props.peN, 
            row.idx)
        this.props.verifyTab(this.props.peN, 2, true)
        this.props.selectTab(this.props.peN, 3)
        
    }


    renderTable(){
        console.log('------------3------------------------');
        console.log(this.props);
        console.log('------------------------------------');
        // return this.props.availableLabelTrees.map((el)=>{
        //     return(
        //         <div key={el.idx} id={el.idx} onClick={this.selectRow}>{el.name}</div>
        //     )
        // })
        return (
            <ReactTable
            columns={[
                {
                    Header: "ID",
                    accessor: "idx"
                },
                {
                    Header: "Name",
                    accessor: "name"
                },
                {
                    Header: "Description",
                    accessor: "description"
                }
            ]}
            getTrProps={(state, rowInfo) => ({
                onClick: () => this.selectRow(rowInfo.original)
            })}
            defaultSorted={[
                {
                    id: "name",
                    desc: true
                }
            ]}
            data={this.props.availableLabelTrees}
            defaultPageSize={10}
            className="-striped -highlight"
        />)
    }
    render(){
        return(
            <Card className='annotask-modal-card'>
            <CardBody>
                {this.renderTable()}
                </CardBody>
                </Card>
        )
    }
}

export default connect(null, {selectLabelTree})(SelectTree)