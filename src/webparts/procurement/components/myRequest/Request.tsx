import * as React from 'react';
import styles from '../Procurement.module.scss';
import navstyles from '../SideNavigation/SideNavigation.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
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
                    <div className={navstyles.subnavitem}>
                        <button className={navstyles.subnav} onClick={() => this.toggleView('new')}>
                            <Icon iconName="Add" className={navstyles.icon} />
                            New
                        </button>
                    </div>
                    <div className={navstyles.subnavitem}>
                        <button className={navstyles.subnav} onClick={() => this.toggleView('view')}>
                            <Icon iconName="View" className={navstyles.icon} />
                            View
                        </button>
                    </div>
                </div>
                {activeScreen === 'new' ? <NewRequestForm context={this.props.context} /> : <RecordsTable context={this.props.context} />}
            </div>
        );
    }
}
