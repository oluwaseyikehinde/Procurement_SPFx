import { SPFx as spSPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getLoggedInUserData } from "./graph.utils";

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
        const { Initiator, Department, DeliveryDate, Supplier, ApprovalStatus, ApprovalStage } = itemProperties;

        // Create a new object with the extracted properties
        const formData = { Initiator, Department, DeliveryDate, Supplier, ApprovalStatus, ApprovalStage };
        // Add the form data to the Procurement List
        const newItem = await sp.web.lists.getByTitle(listName).items.add(formData);

        // Get the ID of the newly created item in the Procurement List
        const ProcurementId = newItem.data.ID;


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
    } catch (error) {
        console.error('Error updating list item:', error);
        throw error;
    }
};

export const deleteListItem = async (context: any, listName: string, itemId: number) => {
    try {
        const sp = spfi().using(spSPFx(context));
        await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
    } catch (error) {
        console.error('Error deleting list item:', error);
        throw error;
    }
};