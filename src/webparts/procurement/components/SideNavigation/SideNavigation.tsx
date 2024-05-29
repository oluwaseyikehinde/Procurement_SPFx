import * as React from 'react';
import { Link } from 'react-router-dom';
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
                    <Link className={styles.menunav} to="/"><HomeIcon></HomeIcon>Home</Link>
                    <Link className={styles.menunav} to="/dashboard"><Dashboard></Dashboard>My Dashboard</Link>
                    <Link className={styles.menunav} to="/request"><Request></Request>Request</Link>
                    <Link className={styles.menunav} to="/allRequest"><AllRequest></AllRequest>Approval</Link>
                    <Link className={styles.menunav} to="/approval"><Approval></Approval>Approval</Link>
                    <Link className={styles.menunav} to="/admin"><Admin></Admin>Adminstration</Link>
                </div>
            </div>
        );
    }
}