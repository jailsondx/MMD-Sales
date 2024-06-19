// Routes.js

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../../pages/Home/home'
import Cadastro from '../../pages/Cadastro/cadastro'
import Lista from '../../pages/Cadastro/cadastro'
import Vendas from '../../pages/Vendas/vendas'


function Rotas (){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cadastro' element={<Cadastro />} />
          <Route path='/Lista' element={<Lista />} />
          <Route path='/Vendas' element={<Vendas />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Rotas;
