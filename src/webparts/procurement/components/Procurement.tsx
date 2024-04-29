import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { NewRequestForm } from './NewRequest/NewRequestForm';

export default class Procurement extends React.Component {

  public render() {

    return (
      <Router>
      <section>
      <h1>Procrement </h1>
      <Route path ="/NewRequest" component={ NewRequestForm}/>
      </section>
      </Router>
    );
  }
}
