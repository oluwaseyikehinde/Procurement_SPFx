import * as React from 'react';
import * as moment from 'moment';
import styles from './Dashboard.module.scss'; 
import { IWebPartProps } from "../IProcurementProps";
import { getListItems } from '../utils/sp.utils'; 
import { listNames } from '../utils/models.utils';
import { Chart } from 'react-google-charts';
import Table from './DashboardTable'; 
import Loader from '../loader/Loader';

interface GeneralDashboardState {
    requests: any[];
    requestItems: any[];
    loading: boolean;
}

export class GeneralDashboard extends React.Component<IWebPartProps, GeneralDashboardState> {
    constructor(props: IWebPartProps) {
        super(props);
        this.state = {
            requests: [],
            requestItems: [],
            loading: true
        };
    }

    async componentDidMount() {
        try {
            // Fetching list items for requests and request items
            const requestData = await getListItems(this.props.context, listNames.request);
            const requestItemData = await getListItems(this.props.context, listNames.requestItem);
            this.setState({
                requests: requestData,
                requestItems: requestItemData,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching data:', error); 
            this.setState({ loading: false });
        }
    }

    render() {
        const { requests, requestItems, loading } = this.state;

        if (loading) {
            return <Loader />; 
        }

        // Calculating totals and aggregating data for charts and tables
        const totalRequests = requests.length;
        const totalItems = requestItems.length;

        // Aggregating request counts by status
        const requestStatusCount = requests.reduce((acc: { [key: string]: number }, request: any) => {
            const status = request.ApprovalStatus;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Aggregating total prices by supplier
        const supplierStats = requestItems.reduce((acc: { [key: string]: number }, item: any) => {
            const supplier = item.Supplier;
            const totalPrice = item.Quantity * item.UnitPrice;
            acc[supplier] = (acc[supplier] || 0) + totalPrice;
            return acc;
        }, {});

        // Formatting data for Google Charts
        const supplierLabels = Object.keys(supplierStats);
        const supplierData = [['Supplier', 'Total Price']];
        supplierLabels.forEach(supplier => {
            supplierData.push([supplier, supplierStats[supplier]]);
        });

        const requestStatusData = [['Status', 'Count']];
        Object.keys(requestStatusCount).forEach(status => {
            requestStatusData.push([status, requestStatusCount[status]]);
        });

        // Defining columns for the table
        const tableColumns = [
            { header: 'Initiator', key: 'Initiator' },
            { header: 'Email', key: 'Email' },
            { header: 'Department', key: 'Department' },
            { header: 'Request Date', key: 'Created' },
            { header: 'Status', key: 'ApprovalStatus' }
        ];

        // Formatting table data
        const tableData = requests.map(request => ({
            ...request,
            Created: moment(request.Created).format('DD-MMM-YY') 
        }));

        // Aggregating request counts by department
        const requestCountByDepartment = requests.reduce((acc: { [key: string]: number }, request: any) => {
            const department = request.Department;
            acc[department] = (acc[department] || 0) + 1;
            return acc;
        }, {});

        const departmentData = [['Department', 'Request Count']];
        Object.keys(requestCountByDepartment).forEach(department => {
            departmentData.push([department, requestCountByDepartment[department]]);
        });

        // Aggregating request counts over time
        const requestTrends = requests.reduce((acc: { [key: string]: number }, request: any) => {
            const date = moment(request.Created).format('YYYY-MMM');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const trendData = [['Month', 'Request Count']];
        Object.keys(requestTrends).sort().forEach(date => {
            trendData.push([date, requestTrends[date]]);
        });

        return (
            <div className={styles.dashboardcontainer}>
                <div className={styles.section}>
                    <div className={styles.sectionchart}>
                        {/* Rendering pie chart for requests by status */}
                        <div className={styles.card}>
                            <h3>Requests by Status</h3>
                            <Chart
                                chartType="PieChart"
                                data={requestStatusData}
                                options={{
                                    title: 'Requests by Status',
                                    pieHole: 0.1,
                                }}
                                className={styles.chart}
                            />
                        </div>
                        {/* Rendering column chart for supplier statistics */}
                        <div className={styles.card}>
                            <h3>Supplier Statistics</h3>
                            <Chart
                                chartType="ColumnChart"
                                data={supplierData}
                                options={{
                                    title: 'Total Price by Supplier',
                                    hAxis: { title: 'Supplier' },
                                    vAxis: { title: 'Total Price' },
                                    isStacked: true,
                                }}
                                className={styles.chart}
                            />
                        </div>
                        {/* Rendering bar chart for requests by department */}
                        <div className={styles.card}>
                            <h3>Requests by Department</h3>
                            <Chart
                                chartType="BarChart"
                                data={departmentData}
                                options={{
                                    title: 'Requests by Department',
                                    hAxis: { title: 'Request Count' },
                                    vAxis: { title: 'Department' },
                                }}
                                className={styles.chart}
                            />
                        </div>
                        {/* Rendering line chart for request trends over time */}
                        <div className={styles.card}>
                            <h3>Request Trends Over Time</h3>
                            <Chart
                                chartType="LineChart"
                                data={trendData}
                                options={{
                                    title: 'Request Trends Over Time',
                                    hAxis: { title: 'Month' },
                                    vAxis: { title: 'Request Count' },
                                }}
                                className={styles.chart}
                            />
                        </div>
                    </div>
                    {/* Rendering total requests and total items count */}
                    <div className={styles.cardcount}>
                        <h3>Total Requests: {totalRequests}</h3>
                        <h3>Total Items: {totalItems}</h3>
                    </div>
                </div>
                <div className={styles.section}>
                    {/* Rendering table of requests */}
                    <div className={styles.cardtable}>
                        <h3>Requests</h3>
                        <div className={styles['table-container']}>
                            <Table data={tableData} columns={tableColumns} className={styles.table} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GeneralDashboard;