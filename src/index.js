import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Timer from "./timer/timer.js";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    {/*<App />*/}
    <Timer
      autoStart={false}
      infinity={false}
      from={10}
    />
    <Timer
      autoStart={true}
      infinity={true}
      from={60}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
