import * as React from 'react';
import { IProcurementProps } from './IProcurementProps';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SideNavigation } from './SideNavigation/SideNavigation';
import { Request } from './myRequest/Request';
import { Home } from './home/Home';
import { Dashboard } from './dashboard/Dashboard';
import { AllRecordsTable } from './allRequest/AllRequest';
import { ApprovalRecordsTable } from './approvalRequest/ApprovalRequest';
import { Settings } from './settings/Settings';
import { checkAndCreateListsIfNotExists } from './utils/models.utils';


export default class Procurement extends React.Component<IProcurementProps> {

  public async componentDidMount(): Promise<void> {
    // check if all lists needed by the application have been created, and create if not
    await checkAndCreateListsIfNotExists(this.props.context);
  }

  public render() {
    return (
      <Router>
        <section>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          <SideNavigation />
          <Switch>
            <Route exact path="/">
              <Home context={this.props.context} />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard context={this.props.context} />
            </Route>
            <Route exact path="/request">
              <Request context={this.props.context} />
            </Route>
            <Route exact path="/allRequest">
              <AllRecordsTable context={this.props.context} />
            </Route>
            <Route exact path="/approval">
              <ApprovalRecordsTable context={this.props.context} />
            </Route>
            <Route exact path="/admin">
              <Settings context={this.props.context} />
            </Route>
          </Switch>
        </section>
      </Router>
    );
  }
}
