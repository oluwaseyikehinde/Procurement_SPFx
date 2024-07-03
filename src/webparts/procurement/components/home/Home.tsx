import * as React from 'react';
import * as moment from 'moment';
import styles from '../Procurement.module.scss';
import { IWebPartProps } from "../IProcurementProps";
import { getListItems } from '../utils/sp.utils';
import { listNames } from '../utils/models.utils';
import { Chart } from 'react-google-charts';
import Table from '../Table';

interface HomeState {
    requests: any[];
    requestItems: any[];
    loading: boolean;
}

export class Home extends React.Component<IWebPartProps, HomeState> {
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
            return <div>Loading...</div>;
        }

        // Process data to create analyses
        const totalRequests = requests.length;
        const totalItems = requestItems.length;

        // Example analysis: Count of requests by status
        const requestStatusCount = requests.reduce((acc: { [key: string]: number }, request: any) => {
            const status = request.ApprovalStatus;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Example analysis: Total quantity and total price by supplier and currency
        const supplierStats = requestItems.reduce((acc: { [key: string]: { [currency: string]: number } }, item: any) => {
            const supplier = item.Supplier;
            const currency = item.Currency;
            acc[supplier] = acc[supplier] || {};
            acc[supplier][currency] = (acc[supplier][currency] || 0) + item.Quantity * item.UnitPrice;
            return acc;
        }, {});

        const supplierLabels = Object.keys(supplierStats);
        const currencyLabels = Array.from(new Set(requestItems.map(item => item.Currency)));

        // Prepare data for the chart
        const supplierData = [['Supplier', ...currencyLabels]];
        supplierLabels.forEach(supplier => {
            const rowData = [supplier];
            currencyLabels.forEach(currency => {
                rowData.push(supplierStats[supplier][currency] || 0);
            });
            supplierData.push(rowData);
        });

        const requestStatusData = [['Status', 'Count']];
        Object.keys(requestStatusCount).forEach(status => {
            requestStatusData.push([status, requestStatusCount[status]]);
        });

        // Define the columns to display in the table
        const tableColumns = [
            { header: 'Initiator', key: 'Initiator' },
            { header: 'Email', key: 'Email' },
            { header: 'Department', key: 'Department' },
            { header: 'Request Date', key: 'Created' },
            { header: 'Status', key: 'ApprovalStatus' }
        ];

        // Format the Created column
        const tableData = requests.map(request => ({
            ...request,
            Created: moment(request.Created).format('DD-MMM-YY')
        }));

    
        const requestCountByDepartment = requests.reduce((acc: { [key: string]: number }, request: any) => {
            const department = request.Department;
            acc[department] = (acc[department] || 0) + 1;
            return acc;
        }, {});

        const departmentData = [['Department', 'Request Count']];
        Object.keys(requestCountByDepartment).forEach(department => {
            departmentData.push([department, requestCountByDepartment[department]]);
        });

    
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
            <div className={styles.maincontainer}>
                <div>
                    <h3>Total Requests: {totalRequests}</h3>
                    <h3>Total Items: {totalItems}</h3>
                </div>
                <div>
                    <h3>Requests by Status</h3>
                    <Chart
                        chartType="PieChart"
                        data={requestStatusData}
                        options={{
                            title: 'Requests by Status',
                            pieHole: 0.4,
                        }}
                        width="100%"
                        height="400px"
                    />
                </div>
                <div>
                    <h3>Supplier Statistics</h3>
                    <Chart
                        chartType="ColumnChart"
                        data={supplierData}
                        options={{
                            title: 'Total Price by Supplier and Currency',
                            hAxis: { title: 'Supplier' },
                            vAxis: { title: 'Total Price' },
                            isStacked: true,
                        }}
                        width="100%"
                        height="400px"
                    />
                </div>
                <div>
                    <h3>Requests by Department</h3>
                    <Chart
                        chartType="BarChart"
                        data={departmentData}
                        options={{
                            title: 'Requests by Department',
                            hAxis: { title: 'Request Count' },
                            vAxis: { title: 'Department' },
                        }}
                        width="100%"
                        height="400px"
                    />
                </div>
                <div>
                    <h3>Request Trends Over Time</h3>
                    <Chart
                        chartType="LineChart"
                        data={trendData}
                        options={{
                            title: 'Request Trends Over Time',
                            hAxis: { title: 'Month' },
                            vAxis: { title: 'Request Count' },
                        }}
                        width="100%"
                        height="400px"
                    />
                </div>
                <div>
                    <h3>Requests</h3>
                    <Table data={tableData} columns={tableColumns} />
                </div>
            </div>
        );
    }
}

export default Home;
