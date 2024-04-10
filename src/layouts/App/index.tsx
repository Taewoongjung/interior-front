import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

const Auth = loadable(() => import('../../pages/Auth/index'));
const Main = loadable(() => import('../../pages/Main/index'))
const Management = loadable(() => import('../../pages/Management/index'));

const App = () => {
  return (
      <Switch>
          <Redirect exact path="/" to="/auth" />
          <Route path="/auth" component={Auth} />
          <Route path="/management" component={Management} />
          <Route path="/main" component={Main} />
      </Switch>
  )
}

export default App;