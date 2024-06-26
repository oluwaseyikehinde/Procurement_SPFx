import * as React from 'react';
import styles from '../Procurement.module.scss';
import navstyles from '../SideNavigation/SideNavigation.module.scss';
import { IWebPartProps } from "../IProcurementProps";
import { Role } from './role/Role';
import { Supplier } from './supplier/Supplier';
import { Approver } from './approver/Approver';
import { Item } from './item/Item';
import { Admin } from './admin/Admin';

interface SettingsState {
    activeScreen: 'supplier' | 'role' | 'approver' | 'item' | 'admin';
}

export class Settings extends React.Component<IWebPartProps, SettingsState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            activeScreen: 'supplier'
        };
    }

    toggleView = (activeScreen: 'supplier' | 'role' | 'approver' | 'item' | 'admin') => {
        this.setState({ activeScreen });
    };

    render() {
        const { activeScreen } = this.state;

        return (
            <div className={styles.maincontainer}>
                <div className={navstyles.subnavcontainer}>
                    <button className={`${navstyles.subnav} ${activeScreen === 'supplier' ? navstyles.active : ''}`} onClick={() => this.toggleView('supplier')}>Supplier</button>
                    <button className={`${navstyles.subnav} ${activeScreen === 'item' ? navstyles.active : ''}`} onClick={() => this.toggleView('item')}>Item</button>
                    <button className={`${navstyles.subnav} ${activeScreen === 'role' ? navstyles.active : ''}`} onClick={() => this.toggleView('role')}>Role</button>
                    <button className={`${navstyles.subnav} ${activeScreen === 'approver' ? navstyles.active : ''}`} onClick={() => this.toggleView('approver')}>Approver</button>
                    <button className={`${navstyles.subnav} ${activeScreen === 'admin' ? navstyles.active : ''}`} onClick={() => this.toggleView('admin')}>Admin</button>
                </div>
                {activeScreen === 'supplier' && <Supplier context={this.props.context} />}
                {activeScreen === 'item' && <Item context={this.props.context} />}
                {activeScreen === 'role' && <Role context={this.props.context} />}
                {activeScreen === 'approver' && <Approver context={this.props.context} />}
                {activeScreen === 'admin' && <Admin context={this.props.context} />}
            </div>
        );
    }
}