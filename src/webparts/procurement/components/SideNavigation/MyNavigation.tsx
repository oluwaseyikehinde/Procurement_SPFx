import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import styles from './MyNavigation.module.scss';

export default class MyNavigation extends React.Component<any, {}> {
    public render(): React.ReactElement<any> {
        return (
            <div className={styles.myNavigation}>
                <ul className={styles.navigationList}>
                    <li className={styles.navigationItem}>
                        <Icon iconName="Home" className={styles.icon} />
                        <a href="#" className={styles.navigationItemLink}>Home</a>
                    </li>
                    <li className={styles.navigationItem}>
                        <Icon iconName="Bank" className={styles.icon} />
                        <a href="#" className={styles.navigationItemLink}>Accounts</a>
                        <ul className={styles.subNavigationList}>
                            <li className={styles.subNavigationItem}>
                                <Icon iconName="Add" className={styles.icon} />
                                <a href="#" className={styles.subNavigationItemLink}>New</a>
                            </li>
                            <li className={styles.subNavigationItem}>
                                <Icon iconName="Delete" className={styles.icon} />
                                <a href="#" className={styles.subNavigationItemLink}>Delete</a>
                            </li>
                            {/* Add more sub-navigation items as needed */}
                        </ul>
                    </li>
                    <li className={styles.navigationItem}>
                        <Icon iconName="Contact" className={styles.icon} />
                        <a href="#" className={styles.navigationItemLink}>Contacts</a>
                        <ul className={styles.subNavigationList}>
                            <li className={styles.subNavigationItem}>
                                <Icon iconName="Add" className={styles.icon} />
                                <a href="#" className={styles.subNavigationItemLink}>New</a>
                            </li>
                            <li className={styles.subNavigationItem}>
                                <Icon iconName="Delete" className={styles.icon} />
                                <a href="#" className={styles.subNavigationItemLink}>Delete</a>
                            </li>
                            {/* Add more sub-navigation items as needed */}
                        </ul>
                    </li>
                    <li className={styles.navigationItem}>
                        <Icon iconName="Document" className={styles.icon} />
                        <a href="#" className={styles.navigationItemLink}>Opportunities</a>
                        <ul className={styles.subNavigationList}>
                            <li className={styles.subNavigationItem}>
                                <Icon iconName="Add" className={styles.icon} />
                                <a href="#" className={styles.subNavigationItemLink}>New</a>
                            </li>
                            <li className={styles.subNavigationItem}>
                                <Icon iconName="Delete" className={styles.icon} />
                                <a href="#" className={styles.subNavigationItemLink}>Delete</a>
                            </li>
                            {/* Add more sub-navigation items as needed */}
                        </ul>
                    </li>
                    {/* Add more main navigation items as needed */}
                </ul>
            </div>
        );
    }
}
