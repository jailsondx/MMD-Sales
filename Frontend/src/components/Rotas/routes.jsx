// Routes.js

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../../pages/Home/home'
import CadastroProduto from '../../pages/Cadastro-Produto/cadastroproduto'
import CadastroMercadoria from '../../pages/Cadastro-Mercadoria/cadastromercadoria'
import ListaProduto from '../../pages/Lista Produto/listaProduto'
import ListaMercadoria from '../../pages/Lista Mercadoria/listaMercadoria'
import Vendas from '../../pages/Vendas/vendas'
import ConsultaVendas from '../Consulta Vendas/ConsultaVendas';


function Rotas (){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cadastro-Produto' element={<CadastroProduto />} />
          <Route path='/Cadastro-Mercadoria' element={<CadastroMercadoria />} />
          <Route path='/Lista-Produto' element={<ListaProduto />} />
          <Route path='/Lista-Mercadoria' element={<ListaMercadoria />} />
          <Route path='/Vendas' element={<Vendas />} />
          <Route path='/Consulta' element={<ConsultaVendas />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Rotas;
