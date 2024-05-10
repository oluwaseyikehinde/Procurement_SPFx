import { sp } from '@pnp/sp';

export const getListItems = async (listName: string) => {
    try {
        const items = await sp.web.lists.getByTitle(listName).items.getAll();
        return items;
    } catch (error) {
        console.error('Error getting list items:', error);
        throw error;
    }
};

export const createListItem = async (listName: string, itemProperties: any) => {
    try {
        const newItem = await sp.web.lists.getByTitle(listName).items.add(itemProperties);
        return newItem.data;
    } catch (error) {
        console.error('Error creating list item:', error);
        throw error;
    }
};

export const updateListItem = async (listName: string, itemId: number, itemProperties: any) => {
    try {
        await sp.web.lists.getByTitle(listName).items.getById(itemId).update(itemProperties);
    } catch (error) {
        console.error('Error updating list item:', error);
        throw error;
    }
};

export const deleteListItem = async (listName: string, itemId: number) => {
    try {
        await sp.web.lists.getByTitle(listName).items.getById(itemId).delete();
    } catch (error) {
        console.error('Error deleting list item:', error);
        throw error;
    }
};
