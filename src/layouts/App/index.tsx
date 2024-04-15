import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

const Auth = loadable(() => import('../../pages/Auth/index'));
const Main = loadable(() => import('../../pages/Main/index'));
const Management = loadable(() => import('../../pages/Management/index'));
const ManagementAntd = loadable(() => import('../../pages/Management/index_antd'));
// const RegisterBusiness = loadable(() => import('../../pages/RegisterBusiness/index'));

const App = () => {
  return (
      <Switch>
          <Redirect exact path="/" to="/auth" />
          <Route path="/auth" component={Auth} />
          <Route path="/management" component={Management} />
          <Route path="/management_test" component={ManagementAntd} />
          <Route path="/main/:companyId" component={Main} />
          {/*<Route path="/register_businesses" component={RegisterBusiness} />*/}
      </Switch>
  )
}

export default App;