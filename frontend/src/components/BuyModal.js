import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/button'
import React from 'react'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'

export default class BuyModal extends React.Component {

  state={ currentQuantity: null }

    handleChange = (e) => {
        this.setState({currentQuantity: e.target.value})
    }

  render(){
    return(
      <Modal 
        show={this.props.isOpen} 
        onHide={this.props.closeModal}
      >
      <Modal.Header closeButton>
        <Modal.Title>{this.props.stock.ticker}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form.Group >
              <p>Current Price: {this.props.currentPrice}</p>
              <p>Money in Wallet: ${Math.round(100*this.props.wallet)/100}</p>
              <Form.Label>Quantity: </Form.Label>
              <Form.Control type="number" onChange={this.handleChange} value={this.state.currentQuantity} placeholder="0"/>           
          </Form.Group>
          {(this.state.currentQuantity*this.props.currentPrice)>this.props.wallet ? <p className='text-danger'>Not enough money in wallet!</p> : null}
          {/* {this.state.validationString && <p className='text-danger'>{this.state.validationString}</p>} */}
      </Modal.Body>
      <Modal.Footer>
            <Row>
                <Col>
                    <p>
                        Total: {this.state.currentQuantity ? Math.round(this.props.currentPrice*this.state.currentQuantity*100)/100 : 0}
                    </p>
                </Col>
                <Col>
                {(this.state.currentQuantity*this.props.currentPrice)>this.props.wallet && this.state.currentQuantity>0 ?
                    <Button variant="success" type="submit" disabled>
                        Buy
                    </Button> :
                    <Button variant="success" type="submit" onClick={() => {
                      this.props.handleSubmit(this.state.currentQuantity, this.props.currentPrice)
                      this.props.closeModal()
                      }} >
                        Buy
                    </Button>
                }
                </Col>
            </Row>
      </Modal.Footer>
    </Modal>
    )
  }
}