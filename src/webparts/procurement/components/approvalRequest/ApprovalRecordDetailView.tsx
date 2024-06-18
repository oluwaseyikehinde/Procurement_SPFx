import * as React from 'react';
import * as moment from 'moment';
import styles from '../Procurement.module.scss';
import { getListItems, approveRequest, rejectRequest } from '../utils/sp.utils';
import { listNames } from '../utils/models.utils';
import { IWebPartProps } from '../IProcurementProps';
import toast from 'react-hot-toast';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

interface RecordDetailViewProps {
    record: any;
    onClose: () => void;
    context: IWebPartProps['context'];
    refreshRecords: () => void;
}

interface RecordDetailViewState {
    relatedItems: any[];
    loading: boolean;
    error: string | null;
    comment: string;
    activeApproversCount: number;
    approvalAction: string | null;
    isSubmitting: boolean;
}

class ApprovalRecordDetailView extends React.Component<RecordDetailViewProps, RecordDetailViewState> {
    constructor(props: RecordDetailViewProps) {
        super(props);
        this.state = {
            relatedItems: [],
            loading: true,
            error: null,
            comment: '',
            activeApproversCount: 0,
            approvalAction: null,
            isSubmitting: false
        };
    }

    async componentDidMount() {
        try {
            const relatedItems = await getListItems(this.props.context, listNames.requestItem);
            const filteredItems = relatedItems.filter((item: any) => item.ProcurementId === this.props.record.Id);

            const approvers = await getListItems(this.props.context, listNames.approvers);
            const activeApprovers = approvers.filter(approver => approver.Status === 'Active');

            this.setState({
                relatedItems: filteredItems,
                loading: false,
                activeApproversCount: activeApprovers.length
            });
        } catch (error) {
            this.setState({ error: 'Failed to load related items', loading: false });
        }
    }

    handleApprove = async () => {
        try {
            this.setState({ approvalAction: 'Approve', isSubmitting: true });
            const { context, record, refreshRecords } = this.props;
            const { comment, activeApproversCount } = this.state;

            await approveRequest(context, listNames.request, record.Id, comment, activeApproversCount);
            toast.success('Request Approved successfully!');
            this.setState({ approvalAction: null, isSubmitting: false });
            this.props.onClose();
            refreshRecords();
        } catch (error) {
            this.setState({ approvalAction: null, isSubmitting: false });
            toast.error('Failed to Approve Procurement Request.', error);
        }
    };

    handleReject = async () => {
        const { context, record, refreshRecords } = this.props;
        const { comment } = this.state;

        if (comment.trim() === '') {
            toast.error('Comment is required to reject the request.');
            return;
        }

        try {
            this.setState({ approvalAction: 'Reject', isSubmitting: true });
            await rejectRequest(context, listNames.request, record.Id, comment);
            toast.success('Request Rejected successfully!');
            this.setState({ approvalAction: null, isSubmitting: false });
            this.props.onClose();
            refreshRecords();
        } catch (error) {
            this.setState({ approvalAction: null, isSubmitting: false });
            toast.error('Failed to Reject Procurement Request.', error);
        }
    };

    handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ comment: e.target.value });
    };

    render() {
        const { record, onClose } = this.props;
        const { relatedItems, loading, error, comment, approvalAction, isSubmitting } = this.state;

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
                            <Icon iconName="ErrorBadge" onClick={onClose} className={styles.closeButton} />
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
                                                    <td>{item.Currency}{formatCurrency(item.UnitPrice)}</td>
                                                    <td>{item.Currency}{formatCurrency(item.Quantity * item.UnitPrice)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                        <div className={styles.commentSection}>
                            <textarea
                                className={styles.commentBox}
                                value={comment}
                                onChange={this.handleCommentChange}
                                placeholder="Enter your comment"
                            />
                        </div>
                        <div className={styles.buttoncontainer}>
                            {!isSubmitting ? (
                                <>
                                    <button type="submit" onClick={this.handleApprove}>
                                        <Icon iconName="Accept" className={styles.buttonicon} /> Approve
                                    </button>
                                    <button type="submit" onClick={this.handleReject}>
                                        <Icon iconName="Cancel" className={styles.buttonicon} /> Reject
                                    </button>
                                </>
                            ) : (
                                <>
                                    {approvalAction === 'Approve' && (
                                        <button className={styles.submitingbutton} disabled>
                                            <div className={styles.loadingcontainer}>
                                                <div className={styles.loadingbar}></div>
                                            </div>
                                            Approving...
                                        </button>
                                    )}
                                    {approvalAction === 'Reject' && (
                                        <button className={styles.submitingbutton} disabled>
                                            <div className={styles.loadingcontainer}>
                                                <div className={styles.loadingbar}></div>
                                            </div>
                                            Rejecting...
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ApprovalRecordDetailView;
