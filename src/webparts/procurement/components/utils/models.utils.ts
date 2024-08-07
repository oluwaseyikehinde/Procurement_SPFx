import { SPFx as spSPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { getLoggedInUserData } from "./graph.utils";

export const getSPClient = (context: any) => {
    return spfi().using(spSPFx(context));
}

export const listNames = {
    request: "Procurement Request List",
    requestItem: "Procurement Request LineItem List",
    items: "Procurement Item List",
    roles: "Procurement Role List",
    approvers: "Procurement Approver List",
    suppliers: "Procurement Supplier List",
    auditLog: "Procurement Audit Log",
    admin: "Procurement Admin List"
}


async function createField(list: any, fieldType: string, fieldName: string, fieldOptions: any = {}) {
    try {
        switch (fieldType) {
            case "Text":
                await list.fields.addText(fieldName, fieldOptions);
                break;
            case "Number":
                await list.fields.addNumber(fieldName, fieldOptions);
                break;
            case "DateTime":
                await list.fields.addDateTime(fieldName);
                break;
            default:
                console.error(`Unknown field type: ${fieldType}`);
        }
        console.log(`Field '${fieldName}' created successfully.`);
    } catch (error) {
        console.error(`Error creating field '${fieldName}':`, error);
    }
}

async function createProcurementTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.request);
        const list = sp.web.lists.getByTitle(listNames.request);
        await createField(list, "Text", "Initiator", { MaxLength: 255 });
        await createField(list, "Text", "Email", { MaxLength: 255 });
        await createField(list, "Text", "Department", { MaxLength: 255 });
        await createField(list, "Text", "ApprovalStatus", { MaxLength: 255 });
        await createField(list, "Number", "ApprovalStage");
    } catch (error) {
        console.error("Error creating Procurement Request List:", error);
    }
}

async function createProcurementRequestLineItemTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.requestItem);
        const list = sp.web.lists.getByTitle(listNames.requestItem);
        await createField(list, "Text", "Supplier", { MaxLength: 255 });
        await createField(list, "Text", "Item", { MaxLength: 255 });
        await createField(list, "DateTime", "DeliveryDate");
        await createField(list, "Text", "Currency", { MaxLength: 255 });
        await createField(list, "Number", "UnitPrice");
        await createField(list, "Number", "Quantity");
        await createField(list, "Number", "ProcurementId");
    } catch (error) {
        console.error("Error creating Procurement Request LineItem List:", error);
    }
}

async function createProcurementItemTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.items);
        const list = sp.web.lists.getByTitle(listNames.items);
        await createField(list, "Text", "Supplier", { MaxLength: 255 });
        await createField(list, "Text", "Item", { MaxLength: 255 });
        await createField(list, "Text", "Currency", { MaxLength: 255 });
        await createField(list, "Number", "Price");
        await createField(list, "Text", "Status", { MaxLength: 255 });
    } catch (error) {
        console.error("Error creating Procurement Item List:", error);
    }
}

async function createRolesTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.roles);
        const list = sp.web.lists.getByTitle(listNames.roles);
        await createField(list, "Text", "Role", { MaxLength: 255 });
        await createField(list, "Text", "Description", { MaxLength: 255 });
        await createField(list, "Text", "Status", { MaxLength: 255 });
    } catch (error) {
        console.error("Error creating Procurement Role List:", error);
    }
}

async function createApproversTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.approvers);
        const list = sp.web.lists.getByTitle(listNames.approvers);
        await createField(list, "Text", "Personnel", { MaxLength: 255 });
        await createField(list, "Text", "Role", { MaxLength: 255 });
        await createField(list, "Number", "Level");
        await createField(list, "Text", "Email", { MaxLength: 255 });
        await createField(list, "Text", "Status", { MaxLength: 255 });
    } catch (error) {
        console.error("Error creating Procurement Approver List:", error);
    }
}

async function createSuppliersTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.suppliers);
        const list = sp.web.lists.getByTitle(listNames.suppliers);
        await createField(list, "Text", "BusinessName", { MaxLength: 255 });
        await createField(list, "Text", "ContactName", { MaxLength: 255 });
        await createField(list, "Text", "ContactPhone", { MaxLength: 255 });
        await createField(list, "Text", "Email", { MaxLength: 255 });
        await createField(list, "Text", "Status", { MaxLength: 255 });
    } catch (error) {
        console.error("Error creating Procurement Supplier List:", error);
    }
}

async function createAuditLogTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.auditLog);
        const list = sp.web.lists.getByTitle(listNames.auditLog);
        await createField(list, "Text", "Type", { MaxLength: 255 });
        await createField(list, "Text", "Action", { MaxLength: 255 });
        await createField(list, "Number", "RelationshipId");
        await createField(list, "Text", "InitiatorFullName", { MaxLength: 255 });
        await createField(list, "Text", "InitiatorEmail", { MaxLength: 255 });
        await createField(list, "Text", "ActivityStage", { MaxLength: 255 });
        await createField(list, "Text", "Information", { MaxLength: 255 });
        await createField(list, "Text", "ListName", { MaxLength: 255 });
    } catch (error) {
        console.error("Error creating Procurement Audit Log:", error);
    }
}

async function createAdminTable(sp: any) {
    try {
        await sp.web.lists.add(listNames.admin);
        const list = sp.web.lists.getByTitle(listNames.admin);
        await createField(list, "Text", "Personnel", { MaxLength: 255 });
        await createField(list, "Text", "Email", { MaxLength: 255 });
        await createField(list, "Text", "AdminRole", { MaxLength: 255 });
    } catch (error) {
        console.error("Error creating Procurement Admin List:", error);
    }
}



async function listExists(listName: string, sp: any) {
    try {
        await sp.web.lists.getByTitle(listName).items();
        return true;
    } catch (error) {
        if (error.message.includes("404")) {
            return false;
        }
        console.error("Error checking list existence:", error);
        throw error;
    }
}

async function checkAdminListAndAddCurrentUserIfEmpty(context: any, sp: any) {
    try {
        const adminList: any[] = await sp.web.lists.getByTitle(listNames.admin).items();

        if (adminList.length === 0) {
            // Get the current user's data
            const currentUser = await getLoggedInUserData(context);
            const userEmail = currentUser.mail;
            const userName = currentUser.displayName;

            // Add current user to admin list
            await sp.web.lists.getByTitle(listNames.admin).items.add({
                Personnel: userName,
                Email: userEmail,
                AdminRole: "Admin"
            });

            console.log("Added current user to Admin list.");
        } 
    } catch (error) {
        console.error("Error checking admin list and adding current user:", error);
        throw error;
    }
}

export async function checkAndCreateListsIfNotExists(context: any) {
    const sp = spfi().using(spSPFx(context));

    if (!(await listExists(listNames.request, sp))) {
        await createProcurementTable(sp);
    }

    if (!(await listExists(listNames.requestItem, sp))) {
        await createProcurementRequestLineItemTable(sp);
    }

    if (!(await listExists(listNames.items, sp))) {
        await createProcurementItemTable(sp);
    }

    if (!(await listExists(listNames.roles, sp))) {
        await createRolesTable(sp);
    }

    if (!(await listExists(listNames.approvers, sp))) {
        await createApproversTable(sp);
    }

    if (!(await listExists(listNames.suppliers, sp))) {
        await createSuppliersTable(sp);
    }

    if (!(await listExists(listNames.auditLog, sp))) {
        await createAuditLogTable(sp);
    }

    if (!(await listExists(listNames.admin, sp))) {
        await createAdminTable(sp);
    }

    await checkAdminListAndAddCurrentUserIfEmpty(context, sp);
}
