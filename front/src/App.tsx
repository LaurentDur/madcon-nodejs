import React from 'react';
import './css/App.scss';
import Board from './components/Board';
import Card from './components/Card';
import { ACTIONCARD_TYPE } from './types/ActionCardType';
import Player from './components/Player';
import MainPlayer from './components/MainPlayer';
import BackInterface from './connector/BackInterface';
import Game from './components/Game';

function App() {
 
  return (
    <div className="App">
      <header className="App-header">

        <Game/>

      </header>
    </div>
  );
}

export default App;
