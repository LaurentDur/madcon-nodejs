import React from 'react';
import './css/App.scss';
import Board from './components/Board';
import Card from './components/Card';
import { ACTIONCARD_TYPE } from './types/ActionCardType';
import Player from './components/Player';
import MainPlayer from './components/MainPlayer';

function App() {

  return (
    <div className="App">
      <header className="App-header">

        Hey !!

        <div className='players'>
          <Player uuid='P1' color='red' name='Leo'/>
          <Player uuid='P2' color='blue' name='Marry'/>
          <Player uuid='P3' color='green' name='Nero'/>
        </div>

        <Board uuid='xxx'/>

        <MainPlayer color='pink' uuid='MainP'/>

      </header>
    </div>
  );
}

export default App;
