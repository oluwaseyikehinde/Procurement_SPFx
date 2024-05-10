import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './SideNavigation.module.scss';
import '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
const HomeIcon = () => <Icon iconName="HomeSolid" className={styles.menuicons} />;
const Dashboard = () => <Icon iconName="BIDashboard" className={styles.menuicons} />;
const Request = () => <Icon iconName="BulletedList" className={styles.menuicons} />;
const Travelrequestrecord = () => <Icon iconName="ViewList" className={styles.menuicons} />;
const Faq = () => <Icon iconName="StatusCircleQuestionMark" className={styles.menuicons} />;
export class SideNavigation extends React.Component<{}, {}> {
    public render(): React.ReactElement<{}> {
        return (
            <div>
                <div className={styles.divtop}>
                    <Link className={styles.menunav} to="/Userdetails"><HomeIcon></HomeIcon>Home</Link>
                    <Link className={styles.menunav} to="/Userdetails"><Dashboard></Dashboard>My Dashboard</Link>
                    <Link className={styles.menunav} to="/TravelRequestlist"><Request></Request>Request</Link>
                    <Link className={styles.menunav} to="/NewRequest"><Faq></Faq>FAQ</Link>
                    <a className={styles.menunav}><Link to="/Quizresult" ></Link>Adminstration</a>
                </div>
                <div className={styles.divtop}>
                    <Link className={styles.menunav} to="/Quizresult" ><Travelrequestrecord></Travelrequestrecord>Travel Request Records</Link>
                    <a className={styles.menunav}>All Approvals<Link to="/RegisterQuestions" ></Link></a>
                    <a className={styles.menunav}>Logistics Booking<Link to="/Userdetails"></Link></a>
                    <a className={styles.menunav}>Approvers<Link to="/Quizresult" ></Link></a>
                    <a className={styles.menunav}>Settings<Link to="/RequestRecords"></Link></a>
                    <a className={styles.menunav}>FAQ<Link to="/Userdetails"></Link></a>
                    <a className={styles.menunav}>AI<Link to="/Welcome" ></Link></a>
                </div>
                <div className={styles.divtop}>
                    <Link className={styles.menunav} to="/Userdetails">Chat</Link>
                    <Link className={styles.menunav} to="/Userdetails">Library Policies</Link>
                </div>
            </div>
        );
    }
}