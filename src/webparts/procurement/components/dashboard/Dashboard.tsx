import * as React from 'react';
import styles from '../Procurement.module.scss';
import { IWebPartProps } from "../IProcurementProps";

interface DashboardProps extends IWebPartProps {
    // Add any additional props if needed
}

export class Dashboard extends React.Component<DashboardProps> {
    constructor(props: DashboardProps) {
        super(props);
    }

    render() {
        return (
            <div className={styles.maincontainer}>
                <h1 className={styles.mainheader}>Welcome to the Procurement Dashboard</h1>
                <hr />
                <p>Welcome to the procurement dashboard. Use the navigation buttons above to create a new request, view existing requests, or manage settings.</p>
            </div>
        );
    }
}
