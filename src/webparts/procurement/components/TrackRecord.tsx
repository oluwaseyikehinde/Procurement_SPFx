import * as React from 'react';
import styles from './Procurement.module.scss';
import { getListItems } from './utils/sp.utils';
import { listNames } from './utils/models.utils';
import { IWebPartProps } from './IProcurementProps';

interface RecordDetailTrackerProps {
    record: any;
    onClose: () => void;
    context: IWebPartProps['context'];
}

interface Approver {
    Personnel: string;
    Role: string;
    Level: number;
}

interface RecordDetailTrackerState {
    approvers: Approver[];
    loading: boolean;
    error: string | null;
}

class RecordDetailTracker extends React.Component<RecordDetailTrackerProps, RecordDetailTrackerState> {
    constructor(props: RecordDetailTrackerProps) {
        super(props);
        this.state = {
            approvers: [],
            loading: true,
            error: null
        };
    }

    async componentDidMount() {
        try {
            const approvers = await getListItems(this.props.context, listNames.approvers);
            const activeApprovers = approvers.filter(approver => approver.Status === 'Active');
            this.setState({ approvers: activeApprovers, loading: false });
        } catch (error) {
            this.setState({ error: 'Failed to load approvers', loading: false });
        }
    }


    getStatus(level: number) {
        const { ApprovalStage } = this.props.record;
        if (ApprovalStage === level) {
            return 'Pending';
        } else if (ApprovalStage > level) {
            return 'Approved';
        } else {
            return 'NotStarted';
        }
    }

    render() {
        const { onClose } = this.props;
        const { approvers, loading, error } = this.state;

        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                        <div>
                            <button onClick={onClose} className={styles.closeButton}>X</button>
                        </div>
                      {loading ? (
                        <p>Loading approvers...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div className={styles.trackerContainer}>
                            {approvers.map((approver, index) => (
                                <div key={index} className={styles.trackerStep}>
                                    <div className={`${styles.trackerCircle} ${styles[this.getStatus(approver.Level).toLowerCase() as 'approved' | 'pending' | 'notstarted']}`}>
                                   
                                    </div>
                                    <div className={styles.trackerDetails}>
                                        <p><strong>{approver.Personnel}</strong></p>
                                        <p>{approver.Role}</p>
                                        <p>Status: {this.getStatus(approver.Level)}</p>
                                        {index < approvers.length -1 && <div className={styles.trackerLine}></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default RecordDetailTracker;
