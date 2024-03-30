import Card from "react-bootstrap/esm/Card"
import Alert from "react-bootstrap/esm/Alert"

const MessageBox = ({isPositive, isDismissible, setShow, message}) => {
    return (

        isDismissible ?
            <Alert className="my-4" variant={isPositive ? "success" : "danger"} onClose={() => setShow(false)} dismissible>
              <p className="text-center">
                { message }
              </p>
            </Alert> :
            <Alert className="my-4" variant={isPositive ? "success" : "danger"} >
            <p className="text-center">
               { message }
            </p>
          </Alert> 
          
    )
}

export default MessageBox