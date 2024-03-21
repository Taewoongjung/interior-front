import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

const LogIn = loadable(() => import('../../pages/LogIn/index'));

const App = () => {
  return (
      <Switch>
          <Redirect exact path="/" to="/login" />
          <Route path="/login" component={LogIn} />
      </Switch>
  )
}

export default App;