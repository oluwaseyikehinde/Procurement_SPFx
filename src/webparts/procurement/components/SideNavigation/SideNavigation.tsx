import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SideNavigation.module.scss';
import '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

const HomeIcon = () => <Icon iconName="HomeSolid" className={styles.menuicons} />;
const Dashboard = () => <Icon iconName="BIDashboard" className={styles.menuicons} />;
const Request = () => <Icon iconName="BulletedList" className={styles.menuicons} />;
const AllRequest = () => <Icon iconName="PageList" className={styles.menuicons} />;
const Approval = () => <Icon iconName="DocumentApproval" className={styles.menuicons} />;
const Admin = () => <Icon iconName="AdminALogo32" className={styles.menuicons} />;

export class SideNavigation extends React.Component<{}, {}> {
    public render(): React.ReactElement<{}> {
        return (
            <div>
                <div className={styles.divtop}>
                    <NavLink className={styles.menunav} activeClassName={styles.active} exact to="/">
                        <HomeIcon />Home
                    </NavLink>
                    <NavLink className={styles.menunav} activeClassName={styles.active} to="/dashboard">
                        <Dashboard />My Dashboard
                    </NavLink>
                    <NavLink className={styles.menunav} activeClassName={styles.active} to="/request">
                        <Request />Request
                    </NavLink>
                    <NavLink className={styles.menunav} activeClassName={styles.active} to="/allRequest">
                        <AllRequest />All Request
                    </NavLink>
                    <NavLink className={styles.menunav} activeClassName={styles.active} to="/approval">
                        <Approval />Approval
                    </NavLink>
                    <NavLink className={styles.menunav} activeClassName={styles.active} to="/admin">
                        <Admin />Administration
                    </NavLink>
                </div>
            </div>
        );
    }
}
