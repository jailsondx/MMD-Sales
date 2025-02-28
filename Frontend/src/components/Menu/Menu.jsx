import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import ModalCaixa from './ModalCaixa'; // Importa o componente do modal
import './Menu.css';

function Menu() {
  const [showModal, setShowModal] = useState(false);
  const [caixaSelecionada, setCaixaSelecionada] = useState('');

  // Recupera a caixa selecionada do sessionStorage ao carregar o componente
  useEffect(() => {
      const caixaSalva = sessionStorage.getItem('caixaSelecionada');
      if (caixaSalva) {
          setCaixaSelecionada(caixaSalva);
      }
  }, []);

  // Função para abrir o modal
  const handleAbrirModal = () => {
      setShowModal(true);
  };

  // Função para fechar o modal
  const handleFecharModal = () => {
      setShowModal(false);
  };

  // Função para atualizar a caixa selecionada
  const handleSalvarCaixa = (caixa) => {
      setCaixaSelecionada(caixa); // Atualiza o estado com a nova caixa
  };


    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <div className='Logo-Menu'>
                            <img src='/LOGO.png' className='LogoMMD' alt='Logo do MMD'></img>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title="Cadastro" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/Cadastro-Produto">Cadastro de Produto</NavDropdown.Item>
                                <NavDropdown.Item href="/Cadastro-Mercadoria">Cadastro de Mercadoria no Peso</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Listas" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/Lista-Produto">Lista de Produtos</NavDropdown.Item>
                                <NavDropdown.Item href="/Lista-Mercadoria">Lista de Mercadoria no Peso</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="/Consulta">Consultar Vendas</Nav.Link>
                            <span className='Caixa'>
                              <Button className='btn-Caixa' variant="outline-light" onClick={handleAbrirModal}>
                                  {caixaSelecionada || 'Selecionar Caixa'}
                              </Button>
                            </span>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/Vendas">Vendas</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Modal para seleção de caixa */}
            <ModalCaixa 
              show={showModal} 
              handleClose={handleFecharModal}
              onSalvarCaixa={handleSalvarCaixa} // Passa a função de callback 
            />
        </>
    );
}

export default Menu;