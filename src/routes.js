import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import Poodr from './Poodr/Poodr'
import Options from './Poodr/Options/Options'
// import Home from './Home/Home';
import Callback from './Callback/Callback';
import history from './history';

export const makeMainRoutes = () => {
  return (
      <BrowserRouter history={history} component={App}>
        <div>
          <Route path="/" render={(props) => <App  {...props} />} />
          <Route path="/callback" render={(props) => <Callback {...props} /> }/>
          {/* Don't publish this route */}
          <Route path="/test" render={ props => <Callback {...props} />} />
          <Route path="/test/options" render={ props => <Options {...props} />} />
        </div>
      </BrowserRouter>
  );
}