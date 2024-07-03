import { SPFx as spSPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getLoggedInUserData, sendEmail } from "./graph.utils";
import { listNames } from "./models.utils";
import * as moment from 'moment';


export const getSPClient = (context: any) => {
    return spfi().using(spSPFx(context));
}

// Function to format line items as a table for email body
const formatLineItemsTable = (lineItems: any[]) => {
    const tableHeader = `
    <tr>
        <th>Supplier</th>
        <th>Item</th>
        <th>Delivery Date</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total Price</th>
    </tr>`;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const tableRows = lineItems.map(item => `
        <tr>
            <td>${item.Supplier}</td>
            <td>${item.Item}</td>
            <td>${moment(item.DeliveryDate).format('DD-MMM-YYYY')}</td>
            <td>${item.Quantity}</td>
            <td>${item.Currency}${formatCurrency(item.UnitPrice)}</td>
            <td>${item.Currency}${formatCurrency(item.Quantity * item.UnitPrice)}</td>
        </tr>`).join('');

    return `<table border="1" >${tableHeader}${tableRows}</table>`;
};

export const getMyRequestListItems = async (context: any, listName: string) => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the current user's data
        const currentUser = await getLoggedInUserData(context);
        const userEmail = currentUser.mail;

        // Fetch list items filtered by the current user's email
        const items = await sp.web.lists.getByTitle(listName).items.filter(`Email eq '${userEmail}'`)();
        return items;
    } catch (error) {
        console.error('Error getting list items:', error);
        throw error;
    }
};

export const createMyRequestListItem = async (context: any, listName: string, listItemName: string, itemProperties: any) => {
    try {
        const sp = spfi().using(spSPFx(context));
        const { Initiator, Department, Email, ApprovalStatus, ApprovalStage } = itemProperties;

        // Create a new object with the extracted properties
        const formData = { Initiator, Department, Email, ApprovalStatus, ApprovalStage };
        // Add the form data to the Procurement List
        const newItem = await sp.web.lists.getByTitle(listName).items.add(formData);
       
        // Get the ID of the newly created item in the Procurement List
        const ProcurementId = newItem.ID;
        

        // Save each grid row to the Procurement Item List
        let gridItemPropertiesArray: any[] = [];
        if (itemProperties.gridRows && itemProperties.gridRows.length > 0) {
            const gridItemsPromises = itemProperties.gridRows.map(async (gridRow: any) => {
                // Omit TotalPrice and Id from grid row properties
                const { TotalPrice, Id, ...gridItemProperties } = gridRow;

                // Add ProcurementId field to link to the parent item in Procurement List
                gridItemProperties.ProcurementId = ProcurementId;

                // Add grid row to Procurement Item List
                await sp.web.lists.getByTitle(listItemName).items.add(gridItemProperties);
                gridItemPropertiesArray.push(gridItemProperties);
            });
            await Promise.all(gridItemsPromises);
        }

        // Get current lineItem Records
        const lineItemsTable = formatLineItemsTable(gridItemPropertiesArray);
        // Get current approver's email
        const approvers = await sp.web.lists.getByTitle(listNames.approvers).items.filter(`Level eq ${ApprovalStage} and Status eq 'Active'`)();
        const currentApproverEmail = approvers[0].Email;
        const currentApproverPersonnel = approvers[0].Personnel;
        const currentApproverRole = approvers[0].Role;
        
        // Construct the approval URL
        const absoluteUrl = context.pageContext.web.absoluteUrl;
        const approvalUrl = `${absoluteUrl}#/approval`;

        if (approvers.length > 0) {
            // Send email notification to initiator
            const initiatorSubject = "New Procurement Request Created";
            const initiatorBody = `<p>Your request has been successfully created and sent for approval to ${currentApproverRole} (${currentApproverPersonnel}).</p>
                               <p></p>
                               <p>Regards</p>`;
            await sendEmail(context, [Email], initiatorSubject, initiatorBody);

            // Send email notification to current approver
            const approverSubject = "New Request Pending Approval";
            const approverBody = `<p>A new request is pending your approval.</p>
                                  <p>Details:</p>
                                  <p>Initiator: ${Initiator}</p>
                                  <p>Department: ${Department}</p>
                                  ${lineItemsTable}
                                  <p><a href="${approvalUrl}">Click here to approve the request</a></p>`;
            await sendEmail(context, [currentApproverEmail], approverSubject, approverBody);
        }

       return newItem.data;
    } catch (error) {
        console.error('Error creating list item:', error);
        throw error;
    }
};

export const getPendingApprovalRequestListItems = async (context: any, requestListName: string, approverListName: string) => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the current user's data
        const currentUser = await getLoggedInUserData(context);
        const userEmail = currentUser.mail;

        // Fetch approvers list filtered by the current user's email
        const approvers = await sp.web.lists.getByTitle(approverListName).items.filter(`Email eq '${userEmail}' and Status eq 'Active'`)();

        // Extract approver levels where the current user is an approver
        const approverLevels = approvers.map(approver => approver.Level);

        if (approverLevels.length === 0) {
            return []; // No pending approvals if the user is not an approver at any level
        }

        // Fetch request list items filtered by pending status and matching approval stages
        const filterConditions = approverLevels.map(level => `ApprovalStage eq ${level}`).join(' or ');
        const items = await sp.web.lists.getByTitle(requestListName).items.filter(`ApprovalStatus eq 'Pending' and (${filterConditions})`)();

        return items;
    } catch (error) {
        console.error('Error getting pending approval request list items:', error);
        throw error;
    }
};

export const getListItems = async (context: any, listName: string) => {
    try {
        const sp = spfi().using(spSPFx(context));
        const items = await sp.web.lists.getByTitle(listName).items();
        return items;
    } catch (error) {
        console.error('Error getting list items:', error);
        throw error;
    }
};

export const createListItem = async (context: any, listName: string, itemProperties: any) => {
    try {
        const sp = spfi().using(spSPFx(context));
        const newItem = await sp.web.lists.getByTitle(listName).items.add(itemProperties);

        // Get the initiator's full name and email
        const userData = await getLoggedInUserData(context);
        const initiatorFullName = userData.displayName;
        const initiatorEmail = userData.mail;

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Create',
            Action: 'Created',
            RelationshipId: newItem.ID,
            InitiatorFullName: initiatorFullName || 'Unknown',
            InitiatorEmail: initiatorEmail || 'Unknown',
            ActivityStage: '0',
            Information: `Created item in list ${listName}`,
            ListName: listName
        });

        return newItem.data;
    } catch (error) {
        console.error('Error creating list item:', error);
        throw error;
    }
};

export const updateListItem = async (context: any, listName: string, itemId: number, itemProperties: any) => {
    try {
        const sp = spfi().using(spSPFx(context));
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update(itemProperties);

        // Get the initiator's full name and email
        const userData = await getLoggedInUserData(context);
        const initiatorFullName = userData.displayName;
        const initiatorEmail = userData.mail;

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Update',
            Action: 'Updated',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName || 'Unknown',
            InitiatorEmail: initiatorEmail || 'Unknown',
            ActivityStage: '0',
            Information: `Updated item in list ${listName}`,
            ListName: listName
        });
    } catch (error) {
        console.error('Error updating list item:', error);
        throw error;
    }
};

export const deleteListItem = async (context: any, listName: string, itemId: number) => {
    try {
        const sp = spfi().using(spSPFx(context));

        await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();

        // Get the initiator's full name and email
        const userData = await getLoggedInUserData(context);
        const initiatorFullName = userData.displayName;
        const initiatorEmail = userData.mail;

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Delete',
            Action: 'Deleted',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName || 'Unknown',
            InitiatorEmail: initiatorEmail || 'Unknown',
            ActivityStage: '0',
            Information: `Deleted item in list ${listName}`,
            ListName: listName
        });
    } catch (error) {
        console.error('Error deleting list item:', error);
        throw error;
    }
};

export const approveRequest = async (context: any, listName: string, itemId: number, comment: string, activeApproversCount: number) => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the initiator's full name and email
        const userData = await getLoggedInUserData(context);
        const initiatorFullName = userData.displayName;
        const initiatorEmail = userData.mail;

        // Get the current item to determine the current ApprovalStage
        const currentItem = await sp.web.lists.getByTitle(listName).items.getById(itemId)();
        const currentApprovalStage = currentItem.ApprovalStage || 0;

        // Fetch line items from Procurement Item list
        const lineItems = await sp.web.lists.getByTitle(listNames.requestItem).items.filter(`ProcurementId eq ${itemId}`)();
        const lineItemsTable = formatLineItemsTable(lineItems);

        // Determine the next approval status and stage
        const nextApprovalStage = currentApprovalStage + 1;
        const approvalStatus = nextApprovalStage > activeApproversCount ? 'Approved' : 'Pending';
        const approvalStage = nextApprovalStage > activeApproversCount ? currentApprovalStage : nextApprovalStage;

        // Update the item's ApprovalStatus
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update({
            ApprovalStatus: approvalStatus,
            ApprovalStage: approvalStage
        });

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Approval',
            Action: 'Approved',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName,
            InitiatorEmail: initiatorEmail,
            ActivityStage: currentApprovalStage.toString(),
            Information: comment,
            ListName: listName
        });

        // Get the current approver details
        const currentApprover = await sp.web.lists.getByTitle(listNames.approvers).items.filter(`Level eq ${currentApprovalStage} and Status eq 'Active'`)();
        const currentApproverPersonnel = currentApprover[0].Personnel;
        const currentApproverRole = currentApprover[0].Role;

        // Construct the approval URL
        const absoluteUrl = context.pageContext.web.absoluteUrl;
        const approvalUrl = `${absoluteUrl}#/approval`;

        // Get the next approver details if there is any
        const nextApprover = await sp.web.lists.getByTitle(listNames.approvers).items.filter(`Level eq ${nextApprovalStage} and Status eq 'Active'`)();

        if (nextApprover.length > 0) {
            // There is a next approver
            const nextApproverEmail = nextApprover[0].Email;
            const nextApproverPersonnel = nextApprover[0].Personnel;
            const nextApproverRole = nextApprover[0].Role;

            // Send email notification to initiator
            const initiatorSubject = "Request Approved";
            const initiatorBody = `<p>Your request has been approved by the ${currentApproverRole} (${currentApproverPersonnel}) and sent to the ${nextApproverRole} (${nextApproverPersonnel}).</p>
                                   <p>Comment: ${comment}</p>`;
            await sendEmail(context, [currentItem.Email], initiatorSubject, initiatorBody);

            // Send email notification to next approver
            const approverSubject = "New Request Pending Approval";
            const approverBody = `<p>A request is pending your approval.</p>
                                  <p>Details:</p>
                                  <p>Initiator: ${currentItem.Initiator}</p>
                                  <p>Department: ${currentItem.Department}</p>
                                  <p>Comment: ${comment}</p>
                                  ${lineItemsTable}
                                  <p><a href="${approvalUrl}">Click here to approve the request</a></p>`;
            await sendEmail(context, [nextApproverEmail], approverSubject, approverBody);
        } else {
            // No next approver, notify initiator
            const initiatorSubject = "Request Approved";
            const initiatorBody = `<p>Your request has been approved by the ${currentApproverRole} (${currentApproverPersonnel}) and is pending no further approval.</p>
                                   <p>Comment: ${comment}</p>`;
            await sendEmail(context, [currentItem.Email], initiatorSubject, initiatorBody);
        }

    } catch (error) {
        console.error('Error approving request:', error);
        throw error;
    }
};

export const rejectRequest = async (context: any, listName: string, itemId: number, comment: string) => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the initiator's full name and email
        const userData = await getLoggedInUserData(context);
        const initiatorFullName = userData.displayName;
        const initiatorEmail = userData.mail;

        // Get the current item to determine the current ApprovalStage
        const currentItem = await sp.web.lists.getByTitle(listName).items.getById(itemId)();
        const currentApprovalStage = currentItem.ApprovalStage || 0;

        // Fetch line items from Procurement Item list
        const lineItems = await sp.web.lists.getByTitle(listNames.requestItem).items.filter(`ProcurementId eq ${itemId}`)();
        const lineItemsTable = formatLineItemsTable(lineItems);

        // Determine the next approval status and stage
        const approvalStatus = 'Rejected';

        // Update the item's ApprovalStatus
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update({
            ApprovalStatus: approvalStatus,
            ApprovalStage: currentApprovalStage
        });

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Approval',
            Action: 'Rejected',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName,
            InitiatorEmail: initiatorEmail,
            ActivityStage: currentApprovalStage.toString(),
            Information: comment,
            ListName: listName
        });

        const currentApprover = await sp.web.lists.getByTitle(listNames.approvers).items.filter(`Level eq ${currentApprovalStage} and Status eq 'Active'`)();
        const currentApproverPersonnel = currentApprover[0].Personnel;
        const currentApproverRole = currentApprover[0].Role;
        const currentApproverEmail = currentApprover[0].Email;
        
        if (currentApprover.length > 0) {
        // Send email notification to initiator
        const initiatorSubject = "Request Rejected";
        const initiatorBody = `<p>Your request has been rejected the ${currentApproverRole} (${currentApproverPersonnel}).</p>
                               <p></p>
                               <p>Comment: ${comment}</p>
                               <p></p>
                               ${lineItemsTable}`;
        await sendEmail(context, [currentItem.Email], initiatorSubject, initiatorBody);

        // Send email notification to current approver
        const approverSubject = "Request Rejected";
            const approverBody = `<p>A request you has been rejected.</p>
                                  <p>Details:</p>
                                  <p>Initiator: ${currentItem.Initiator}</p>
                                  <p>Department: ${currentItem.Department}</p>
                                  <p>Comment: ${comment}</p>
                                  ${lineItemsTable}`;
            await sendEmail(context, [currentApproverEmail], approverSubject, approverBody);
        }

    } catch (error) {
        console.error('Error rejecting request:', error);
        throw error;
    }
};