// pages/Lista.js
import React from 'react';
import Modal from 'react-modal';
import ListaProdutos from '../../components/Lista Produtos/ListaProdutos';


Modal.setAppElement('#root');

function Lista() {
  return (
    <div>
      <ListaProdutos />
    </div>
  );
}

export default Lista;
