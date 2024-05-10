import * as React from 'react';
import { IProcurementProps } from './IProcurementProps';
import { HashRouter as Router, Route } from 'react-router-dom';
import { NewRequestForm } from './myRequest/NewRequestForm';
import { RecordsTable } from './myRequest/ViewRequest';


export default class Procurement extends React.Component<IProcurementProps, {}> {

  public render() {
    return (
        <Router>
          <section>
            <NewRequestForm/>
            <RecordsTable/>
              <Route path="/NewRequest/NewRequestForm" component={NewRequestForm} />
          </section>
        </Router>
    );
  }
}
