import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import './Menu.css';



function Menu() {
  return (
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
          </Nav>
          <Nav>
            <Nav.Link href="/Vendas">Vendas</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;