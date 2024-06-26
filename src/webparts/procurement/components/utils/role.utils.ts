import { SPFx as spSPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getLoggedInUserData } from "./graph.utils";
import { listNames } from "./models.utils";


export const getSPClient = (context: any) => {
    return spfi().using(spSPFx(context));
}

export const isCurrentUserApprover = async (context: any): Promise<boolean> => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the current user's data
        const currentUser = await getLoggedInUserData(context);
        const userEmail = currentUser.mail;

        const approvers = await sp.web.lists.getByTitle(listNames.approvers).items.filter(`Email eq '${userEmail}' and Status eq 'Active'`)();
        return approvers.length > 0;
    } catch (error) {
        console.error('Error checking if user is an approver:', error);
        throw error;
    }
};

export const isCurrentUserAdmin = async (context: any): Promise<boolean> => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the current user's data
        const currentUser = await getLoggedInUserData(context);
        const userEmail = currentUser.mail;

        const admins = await sp.web.lists.getByTitle(listNames.admin).items.filter(`Email eq '${userEmail}' and AdminRole eq 'Admin'`)();
        return admins.length > 0;
    } catch (error) {
        console.error('Error checking if user is an admin:', error);
        throw error;
    }
};

export const isCurrentUserManager = async (context: any): Promise<boolean> => {
    try {
        const sp = spfi().using(spSPFx(context));

        // Get the current user's data
        const currentUser = await getLoggedInUserData(context);
        const userEmail = currentUser.mail;

        const managers = await sp.web.lists.getByTitle(listNames.admin).items.filter(`Email eq '${userEmail}' and AdminRole eq 'Manager'`)();
        return managers.length > 0;
    } catch (error) {
        console.error('Error checking if user is a manager:', error);
        throw error;
    }
};
