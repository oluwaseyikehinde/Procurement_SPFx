import * as React from 'react';
import styles from '../Procurement.module.scss';
import navstyles from '../SideNavigation/SideNavigation.module.scss';
import { IWebPartProps } from "../IProcurementProps";
import { Role } from './role/Role';
import { Supplier } from './supplier/Supplier';
import { Approver } from './approver/Approver';

interface SettingsState {
    activeScreen: 'supplier' | 'role' | 'approver';
}

export class Settings extends React.Component<IWebPartProps, SettingsState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            activeScreen: 'supplier'
        };
    }

    toggleView = (activeScreen: 'supplier' | 'role' | 'approver') => {
        this.setState({ activeScreen });
    };

    render() {
        const { activeScreen } = this.state;

        return (
            <div className={styles.maincontainer}>
                <div className={navstyles.subnavcontainer}>
                    <button className={navstyles.subnav} onClick={() => this.toggleView('supplier')}>Supplier</button>
                    <button className={navstyles.subnav} onClick={() => this.toggleView('role')}>Role</button>
                    <button className={navstyles.subnav} onClick={() => this.toggleView('approver')}>Approver</button>
                </div>
                {activeScreen === 'supplier' && <Supplier context={this.props.context} />}
                {activeScreen === 'role' && <Role context={this.props.context} />}
                {activeScreen === 'approver' && <Approver context={this.props.context} />}
            </div>
        );
    }
}
