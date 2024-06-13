import { SPFx as spSPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getLoggedInUserData } from "./graph.utils";
import { listNames } from "./models.utils";
import * as moment from 'moment';

export const getSPClient = (context: any) => {
    return spfi().using(spSPFx(context));
}


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
        if (itemProperties.gridRows && itemProperties.gridRows.length > 0) {
            const gridItemsPromises = itemProperties.gridRows.map(async (gridRow: any) => {
                //const gridItemProperties = { ...gridRow, ProcurementId: ProcurementId };
                // Omit TotalPrice and Id from grid row properties
                const { TotalPrice, Id, ...gridItemProperties } = gridRow;

                // Add ProcurementId field to link to the parent item in Procurement List
                gridItemProperties.ProcurementId = ProcurementId;

                // Add grid row to Procurement Item List
                await sp.web.lists.getByTitle(listItemName).items.add(gridItemProperties);
            });
            await Promise.all(gridItemsPromises);
        }

       return newItem.data;
    } catch (error) {
        console.error('Error creating list item:', error);
        throw error;
    }
};


export const updateMyRequestListItem = async (context: any, listName: string, itemId: number, itemProperties: any) => {
    try {
        const sp = spfi().using(spSPFx(context));
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update(itemProperties);
    } catch (error) {
        console.error('Error updating list item:', error);
        throw error;
    }
};

export const deleteMyRequestListItem = async (context: any, listName: string, itemId: number) => {
    try {
        const sp = spfi().using(spSPFx(context));
        await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
    } catch (error) {
        console.error('Error deleting list item:', error);
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

        const currentDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Create',
            Action: 'Created',
            RelationshipId: newItem.ID,
            InitiatorFullName: initiatorFullName || 'Unknown',
            InitiatorEmail: initiatorEmail || 'Unknown',
            MoreInitiatorInfo: 'More Info',
            Information: `Created item in list ${listName}`,
            ActionDate: currentDate,
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
        console.log("rrrrrrrrrrrrrrrr",itemProperties)
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update(itemProperties);

        // Get the initiator's full name and email
        const userData = await getLoggedInUserData(context);
        const initiatorFullName = userData.displayName;
        const initiatorEmail = userData.mail;

        // Get the current date in the format SharePoint expects
        const currentDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Update',
            Action: 'Updated',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName || 'Unknown',
            InitiatorEmail: initiatorEmail || 'Unknown',
            MoreInitiatorInfo: 'More Info',
            Information: `Updated item in list ${listName}`,
            ActionDate: currentDate,
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

        const currentDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Delete',
            Action: 'Deleted',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName || 'Unknown',
            InitiatorEmail: initiatorEmail || 'Unknown',
            MoreInitiatorInfo: 'More Info',
            Information: `Deleted item in list ${listName}`,
            ActionDate: currentDate,
            ListName: listName
        });
    } catch (error) {
        console.error('Error deleting list item:', error);
        throw error;
    }
};


export const approveRequest = async (context: any, listName: string, itemId: number, comment: string) => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the initiator's full name and email
        const userData = await getLoggedInUserData(context);
        const initiatorFullName = userData.displayName;
        const initiatorEmail = userData.mail;

        // Get the current item to determine the current ApprovalStage
        const currentItem = await sp.web.lists.getByTitle(listName).items.getById(itemId)();
        const currentApprovalStage = currentItem.ApprovalStage || 0;

        const currentDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        // Update the item's ApprovalStatus and ApprovalStage
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update({
            ApprovalStatus: 'Approved',
            ApprovalStage: currentApprovalStage + 1
        });

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Approval',
            Action: 'Approved',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName,
            InitiatorEmail: initiatorEmail,
            MoreInitiatorInfo: 'More Info',
            Information: comment || 'No Comment',
            ActionDate: currentDate,
            ListName: listName
        });

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

        const currentDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        // Update the item's ApprovalStatus
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update({
            ApprovalStatus: 'Rejected'
        });

        // Log the action in the audit log
        await sp.web.lists.getByTitle(listNames.auditLog).items.add({
            Type: 'Approval',
            Action: 'Rejected',
            RelationshipId: itemId,
            InitiatorFullName: initiatorFullName,
            InitiatorEmail: initiatorEmail,
            MoreInitiatorInfo: 'More Info',
            Information: comment,
            ActionDate: currentDate,
            ListName: listName
        });

    } catch (error) {
        console.error('Error rejecting request:', error);
        throw error;
    }
};
