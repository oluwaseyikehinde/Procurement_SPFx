import * as React from 'react';
import styles from '../Procurement.module.scss';
import { IWebPartProps } from "../IProcurementProps";

interface HomeProps extends IWebPartProps {
    // Add any additional props if needed
}

export class Home extends React.Component<HomeProps> {
    constructor(props: HomeProps) {
        super(props);
    }

    render() {
        return (
            <div className={styles.maincontainer}>
                <h1 className={styles.mainheader}>Welcome to the Procurement Application</h1>
                <hr />
                        <p>Welcome to the procurement application. Use the navigation buttons above to create a new request, view existing requests, or manage settings.</p>
            </div>
        );
    }
}
