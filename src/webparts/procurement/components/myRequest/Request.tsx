import * as React from 'react';
import styles from '../Procurement.module.scss';
import navstyles from '../SideNavigation/SideNavigation.module.scss';
import { NewRequestForm } from './NewRequestForm';
import { RecordsTable } from './ViewRequest';
import { IWebPartProps } from "../IProcurementProps";

interface RequestState {
    activeScreen: 'new' | 'view';
}

export class Request extends React.Component<IWebPartProps, RequestState> {
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
                {activeScreen === 'new' ? <NewRequestForm context={this.props.context} /> : <RecordsTable context={this.props.context} />}
            </div>
        );
    }
}
