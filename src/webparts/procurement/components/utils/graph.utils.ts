import { SPFx as graphSPFX, graphfi } from "@pnp/graph";
import "@pnp/graph/users";

export async function getLoggedInUserData(context: any) {
    try {
        const graph = graphfi().using(graphSPFX(context));
        const meData = await graph.me.select("id", "mail", "displayName", "jobTitle", "mobilePhone", "department", "userPrincipalName", "businessPhones", "employeeType", "officeLocation", "employeeId", "userType", "accountEnabled", "onPremisesSyncEnabled", "preferredUserName", "officeLocation")();
        return meData;
    } catch (error) {
        throw error;
    }
}

export async function getLoggedInUsersManagerData(context: any) {
    try {
        const graph = graphfi().using(graphSPFX(context));
        const meManager = await graph.me.manager();
        return meManager;
    } catch (error) {
        throw error;
    }
}

export async function getLoggedInUsersDirectReports(context: any) {
    try {
        const graph = graphfi().using(graphSPFX(context));
        const meDirectReports = await graph.me.directReports();
        return meDirectReports;
    } catch (error) {
        throw error;
    }
}

export async function getAllUsersInOrg(context: any) {
    // note: there is a pending issue of handling pagination should the users be more
    // than a possible limit (which I don't know for this library yet)
    try {
        const graph = graphfi().using(graphSPFX(context));
        let allUsers = await graph.users.select("id", "mail", "displayName", "jobTitle", "mobilePhone", "department", "userPrincipalName", "businessPhones", "employeeType", "officeLocation", "employeeId", "userType", "accountEnabled", "onPremisesSyncEnabled", "preferredUserName", "officeLocation").filter("(onPremisesSyncEnabled eq true OR userType eq 'Member') and accountEnabled eq true")();
        allUsers = allUsers.sort((a: any, b: any) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
        return allUsers;
    } catch (error) {
        throw error;
    }
}