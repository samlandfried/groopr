import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { makeMainRoutes } from './routes';
import registerServiceWorker from './registerServiceWorker';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import './index.css';

const routes = makeMainRoutes();
ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
