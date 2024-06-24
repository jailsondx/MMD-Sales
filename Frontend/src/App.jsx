// App.js

import React from 'react';
import './App.css'
import Rotas from './components/Rotas/routes';
import Menu from './components/Menu/Menu';

function App() {
  return (
    <div className="App">
      <Menu />
      <Rotas />
    </div>
  );
}

export default App;
