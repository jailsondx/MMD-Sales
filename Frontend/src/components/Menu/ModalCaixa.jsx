import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const ModalCaixa = ({ show, handleClose, onSalvarCaixa }) => {
    const [caixaSelecionada, setCaixaSelecionada] = useState(null);

    // Função para salvar a caixa selecionada no localStorage
    const handleSalvarCaixa = () => {
        if (caixaSelecionada) {
            localStorage.setItem('caixaSelecionada', caixaSelecionada);
            onSalvarCaixa(caixaSelecionada); // Chama a função de callback
            handleClose(); // Fecha o modal após salvar
        }
    };

    return (
        <Modal className="custom-modal" show={show} onHide={handleClose}>
            <Modal.Header className='custom-modal-header' closeButton>
                <Modal.Title>Selecione a Caixa</Modal.Title>
            </Modal.Header>
            <Modal.Body className='custom-modal-body-select'>
                <ListGroup className='custom-modal-body-select'>
                    <ListGroup.Item
                        action
                        active={caixaSelecionada === 'Caixa 1'}
                        onClick={() => setCaixaSelecionada('Caixa 1')}
                    >
                        Caixa 1
                    </ListGroup.Item>
                    <ListGroup.Item
                        action
                        active={caixaSelecionada === 'Caixa 2'}
                        onClick={() => setCaixaSelecionada('Caixa 2')}
                    >
                        Caixa 2
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
                <Button variant="primary" onClick={handleSalvarCaixa} disabled={!caixaSelecionada}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ModalCaixa.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSalvarCaixa: PropTypes.func.isRequired,
};

export default ModalCaixa;