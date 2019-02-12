import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/style.scss';
import WebFont from 'webfontloader';
import App from './components/App';

WebFont.load({
  google: {
    families: ['Muli: 400, 700, 900']
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
