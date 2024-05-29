import * as React from 'react';
import styles from '../../Procurement.module.scss';
import navstyles from '../../SideNavigation/SideNavigation.module.scss';
import { NewSupplierForm } from './NewSupplierForm';
import { SuppliersTable } from './ViewSupplier';
import { IWebPartProps } from "../../IProcurementProps";

interface SupplierState {
    activeScreen: 'new' | 'view';
}

export class Supplier extends React.Component<IWebPartProps, SupplierState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            activeScreen: 'view'
        };
    }

    toggleView = (activeScreen: 'new' | 'view') => {
        this.setState({ activeScreen });
    };

    render() {
        const { activeScreen } = this.state;

        return (
            <div className={styles.maincontainer}>
                <div className={navstyles.subnavcontainer}>
                    <button className={navstyles.subnav} onClick={() => this.toggleView('new')}>New</button>
                    <button className={navstyles.subnav} onClick={() => this.toggleView('view')}>View</button>
                </div>
                {activeScreen === 'new' ? <NewSupplierForm context={this.props.context} /> : <SuppliersTable context={this.props.context} />}
            </div>
        );
    }
}
