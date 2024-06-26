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
import { isCurrentUserApprover, isCurrentUserAdmin, isCurrentUserManager } from './utils/role.utils';
import Loader from './loader/Loader';

interface ProcurementState {
  isApprover: boolean;
  isAdmin: boolean;
  isManager: boolean;
  loadingRoles: boolean;
}

export default class Procurement extends React.Component<IProcurementProps, ProcurementState> {
  constructor(props: IProcurementProps) {
    super(props);
    this.state = {
      isApprover: false,
      isAdmin: false,
      isManager: false,
      loadingRoles: true
    };
  }

  public async componentDidMount(): Promise<void> {
    try {
      await checkAndCreateListsIfNotExists(this.props.context);

      const isApprover = await isCurrentUserApprover(this.props.context);
      const isAdmin = await isCurrentUserAdmin(this.props.context);
      const isManager = await isCurrentUserManager(this.props.context);

      this.setState({ isApprover, isAdmin, isManager, loadingRoles: false });
    } catch (error) {
      console.error("An error occurred while creating lists and fields or checking roles:", error);
      this.setState({ loadingRoles: false });
    }
  }

  public render() {
    if (this.state.loadingRoles) {
      return <Loader/>;
    }

    return (
      <div>
        <Router>
          <section>
            <Toaster position="top-center" reverseOrder={false} />
            <SideNavigation
              context={this.props.context}
              isApprover={this.state.isApprover}
              isAdmin={this.state.isAdmin}
              isManager={this.state.isManager}
            />
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
      </div>
    );
  }
}