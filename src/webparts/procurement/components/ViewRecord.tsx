import * as React from 'react';
import * as moment from 'moment';
import styles from './Procurement.module.scss';
import { getListItems } from './utils/sp.utils';
import { listNames } from './utils/models.utils';
import { IWebPartProps } from './IProcurementProps';

interface RecordDetailViewProps {
    record: any;
    onClose: () => void;
    context: IWebPartProps['context'];
}


interface RecordDetailViewState {
    relatedItems: any[];
    loading: boolean;
    error: string | null;
}

class RecordDetailView extends React.Component<RecordDetailViewProps, RecordDetailViewState> {
    constructor(props: RecordDetailViewProps) {
        super(props);
        this.state = {
            relatedItems: [],
            loading: true,
            error: null
        };
    }
    async componentDidMount() {
        try {
            const relatedItems = await getListItems(this.props.context, listNames.requestItem);
            const filteredItems = relatedItems.filter((item: any) => item.ProcurementId === this.props.record.id);
            this.setState({ relatedItems: filteredItems, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to load related items', loading: false });
        }
    }

    
    render() {
        const { record, onClose } = this.props;
        const { relatedItems, loading, error } = this.state;

        const formatCurrency = (value: number) => {
            return value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <h4>
                        Record Details
                        <span>
                            <button onClick={onClose} className={styles.closeButton}>X</button>
                        </span>
                    </h4>
                    <div className={styles.modalRecord}>
                        <p><strong>Initiator:</strong> {record.Initiator}</p>
                        <p><strong>Department:</strong> {record.Department}</p>
                        <p><strong>Request Date:</strong> {moment(record.Created).format('DD-MMM-YYYY')}</p>
                        <p><strong>Status:</strong> {record.ApprovalStatus}</p>
                            {loading ? (
                                <p>Loading related items...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : (
                                <div>
                                    <h5>Related Items</h5>
                                    {relatedItems.length === 0 ? (
                                        <p>No related items found.</p>
                                    ) : (
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Supplier</th>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Delivery Date</th>
                                                    <th>Unit Price</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {relatedItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.Supplier}</td>
                                                        <td>{item.Item}</td>
                                                        <td>{item.Quantity}</td>
                                                        <td>{moment(item.DeliveryDate).format('DD-MMM-YYYY')}</td>
                                                        <td>{formatCurrency(item.UnitPrice)}</td>
                                                        <td>{formatCurrency(item.Quantity * item.UnitPrice)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

export default RecordDetailView;