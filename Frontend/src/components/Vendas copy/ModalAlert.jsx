import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Modais.css';

const ModalAlert = ({ show, onHide, mensagem }) => {
    return (
        <Modal show={show} onHide={onHide} className="custom-modal">
            <Modal.Header closeButton className="custom-modal-header-alert">
                <Modal.Title className="custom-modal-title">Alerta</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body-alert">
                <p>{mensagem}</p>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="primary" onClick={onHide} className="custom-modal-button-alert">
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAlert;
