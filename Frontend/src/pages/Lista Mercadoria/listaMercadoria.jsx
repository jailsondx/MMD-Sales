// pages/Lista.js
import React from 'react';
import Modal from 'react-modal';
import ListaMercadorias from '../../components/Lista Mercadorias/ListaMercadorias'


Modal.setAppElement('#root');

function ListaMercadoria() {
  return (
    <div>
      <ListaMercadorias />
    </div>
  );
}

export default ListaMercadoria;
