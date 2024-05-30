import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

export const listNames = {
    request: "Procurement List",
    requestItem: "Procurement Item List",
    roles: "Procurement Role List",
    approvers: "Procurement Approver List",
    suppliers: "Procurement Supplier List",
    auditLog: "Procurement Audit Log"
}

async function createProcurementTable(sp: any) {
    try {
        // create list
        await sp.web.lists.add(listNames.request);

        // create columns
        const list = sp.web.lists.getByTitle(listNames.request);
        await list.fields.addText("Initiator", { MaxLength: 255 });
        await list.fields.addText("Email", { MaxLength: 255 });
        await list.fields.addText("Department", { MaxLength: 255 });
        await list.fields.addText("DeliveryDate", { MaxLength: 255 });
        await list.fields.addText("Supplier", { MaxLength: 255 });
        await list.fields.addText("ApprovalStatus", { MaxLength: 255 });
        await list.fields.addNumber("ApprovalStage", {MaxLength: 255});
    } catch (error) {
        console.log("An error occured.", error);
    }
}

async function createProcurementItemTable(sp: any) {
    try {
        // create list
        await sp.web.lists.add(listNames.requestItem);

        // create columns
        const list = sp.web.lists.getByTitle(listNames.requestItem);
        await list.fields.addText("Description", { MaxLength: 255 });
        await list.fields.addText("UnitPrice");
        await list.fields.addText("Quantity");
        await list.fields.addText("ProcurementId", { MaxLength: 255 });
    } catch (error) {
        console.log("An error occured.", error);
    }
}

async function createRolesTable(sp: any) {
    try {
        // create list
        await sp.web.lists.add(listNames.roles);

        // create columns
        const list = sp.web.lists.getByTitle(listNames.roles);
        await list.fields.addText("Role", { MaxLength: 255 });
        await list.fields.addText("Description", { MaxLength: 255 });
    } catch (error) {
        console.log("An error occured.", error)
    }
}

async function createApproversTable(sp: any) {
    try {
        // create list
        await sp.web.lists.add(listNames.approvers);

        // create columns
        const list = sp.web.lists.getByTitle(listNames.approvers);
        await list.fields.addText("Personnel", { MaxLength: 255 });
        await list.fields.addText("Role", { MaxLength: 255 });
        await list.fields.addText("Level", { MaxLength: 255 });
        await list.fields.addText("Email", { MaxLength: 255 });
    } catch (error) {
        console.log("An error occured.", error)
    }
}

async function createSuppliersTable(sp: any) {
    try {
        // create list
        await sp.web.lists.add(listNames.suppliers);

        // create columns
        const list = sp.web.lists.getByTitle(listNames.suppliers);
        await list.fields.addText("BusinessName", { MaxLength: 255 });
        await list.fields.addText("ContactName", { MaxLength: 255 });
        await list.fields.addText("ContactPhone", { MaxLength: 255 });
        await list.fields.addText("Email", { MaxLength: 255 });
    } catch (error) {
        console.log("An error occured.", error)
    }
}

async function createAuditLogTable(sp: any) {
    try {
        // create list
        await sp.web.lists.add(listNames.auditLog);

        // create columns
        const list = sp.web.lists.getByTitle(listNames.auditLog);
        await list.fields.addText("Type", { MaxLength: 255 });
        await list.fields.addText("Action", { MaxLength: 255 });
        await list.fields.addNumber("RelationshipId", { MaxLength: 255 });
        await list.fields.addText("InitiatorFullName", { MaxLength: 255 });
        await list.fields.addText("InitiatorEmail", { MaxLength: 255 });
        await list.fields.addText("MoreInitiatorInfo", { MaxLength: 255 });
        await list.fields.addText("Information", { MaxLength: 255 });
    } catch (error) {
        console.log("An error occured.", error)
    }
}

async function listExists(listName: string, sp: any) {
    try {
        await sp.web.lists.getByTitle(listName).items();
        return true;
    } catch (error) {
        return false;
    }
}

export async function checkAndCreateListsIfNotExists(context: any) {
    const sp = spfi().using(SPFx(context));

    if (!(await listExists(listNames.request, sp))) {
        await createProcurementTable(sp);
    };

    if (!(await listExists(listNames.requestItem, sp))) {
        await createProcurementItemTable(sp);
    };

    if (!(await listExists(listNames.roles, sp))) {
        await createRolesTable(sp);
    };

    if (!(await listExists(listNames.approvers, sp))) {
        await createApproversTable(sp);
    };

    if (!(await listExists(listNames.suppliers, sp))) {
        await createSuppliersTable(sp);
    };

    if (!(await listExists(listNames.auditLog, sp))) {
        await createAuditLogTable(sp);
    };
}