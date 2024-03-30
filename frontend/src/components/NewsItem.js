import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { MdClear } from "react-icons/md";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";

const NewsItem = ({ newsItem, openNewsModal }) => {

    useEffect(() => {

    }, [])

  return (
    <Card className="my-2" onClick={openNewsModal}>
      <Card.Body>
        <Row>
            <Col lg={4} xs={12}>
                <Container fluid="lg">
                    <Image src={newsItem.image} className="object-fit-fill" fluid rounded/>
                </Container>
            </Col>
            <Col lg={8} xs={12} className="text-center">
                <Container className="text-center">
                    {newsItem.headline}
                </Container>
            </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default NewsItem;
