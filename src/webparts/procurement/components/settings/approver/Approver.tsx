import * as React from 'react';
import styles from '../../Procurement.module.scss';
import navstyles from '../../SideNavigation/SideNavigation.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { NewApproverForm } from './NewApproverForm';
import { ApproversTable } from './ViewApprover';
import { IWebPartProps } from "../../IProcurementProps";

interface ApproverState {
    activeScreen: 'new' | 'view';
}

export class Approver extends React.Component<IWebPartProps, ApproverState> {
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
                {activeScreen === 'new' ? <NewApproverForm context={this.props.context} /> : <ApproversTable context={this.props.context} />}
            </div>
        );
    }
}
