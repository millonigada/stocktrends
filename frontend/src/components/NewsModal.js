import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/esm/Button"
import Container from "react-bootstrap/esm/Container";
import { MdClear } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Row from "react-bootstrap/esm/Row";

const NewsModal = ({newsItem, showModal, closeModal}) => {
    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <p>{newsItem.source}</p>
                    <p>{newsItem.date}</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="h3">{newsItem.headline}</p>
                <p>{newsItem.summary}</p>
                <p>For more details click <a target="_blank" href={newsItem.url}>Here</a></p>

                {/* <div class="fb-share-button" data-href="https://developers.facebook.com/docs/plugins/" data-layout="" data-size=""><a target="_blank" href={https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsModalData && newsModalData.url)}} class="fb-xfbml-parse-ignore"><FontAwesomeIcon icon={faSquareFacebook} /></a></div>
                <Button variant='btn-primary-outline' href={https://twitter.com/intent/tweet?text=${encodeURIComponent(newsModalData && newsModalData.headline)}+ ' ' + ${encodeURIComponent(newsModalData && newsModalData.url)}} target="_blank">
                <FontAwesomeIcon icon={faXTwitter} />
                </Button> */}

                <Row>
                    <Container class="fb-share-button" data-href="https://developers.facebook.com/docs/plugins/" data-layout="" data-size=""><a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsItem && newsItem.url)}`} class="fb-xfbml-parse-ignore"><FontAwesomeIcon icon={faSquareFacebook} /></a></Container>
                    <Button variant='btn-primary-outline' href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(newsItem && newsItem.headline)}+ ' ' + ${encodeURIComponent(newsItem && newsItem.url)}`} target="_blank">
                    <FontAwesomeIcon icon={faXTwitter} />
                    </Button>
                </Row>
                
            </Modal.Body>
        </Modal>
    )
}

export default NewsModal