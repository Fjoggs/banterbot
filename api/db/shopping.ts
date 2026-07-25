import { env } from '../../app-env';

const API_URL = env.SOMMERLAN_API_URL;
const SERVICE_TOKEN = env.SHOPPING_SERVICE_TOKEN;

export interface ShoppingItem {
  id: number;
  listId: number;
  name: string;
  quantity: number;
  checked: boolean;
}

export type ShoppingStatus = 'active' | 'completed';

export interface ShoppingListSummary {
  id: number;
  name: string;
  status: ShoppingStatus;
  itemCount: number;
}

export interface ShoppingListDetail {
  id: number;
  name: string;
  status: ShoppingStatus;
  items: ShoppingItem[];
}

export interface ShoppingItemInput {
  name: string;
  quantity: number;
}

const authHeaders = (discordId?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${SERVICE_TOKEN}`,
    'Content-Type': 'application/json',
  };
  if (discordId) headers['X-Discord-Id'] = discordId;
  return headers;
};

export const getShopping = async (callback: (lists: ShoppingListSummary[]) => void) => {
  try {
    const res = await fetch(`${API_URL}/shopping/`, { headers: authHeaders() });
    if (!res.ok) {
      callback([]);
      return;
    }
    callback((await res.json()) as ShoppingListSummary[]);
  } catch (error) {
    console.log('Something went wrong: ', error);
    callback([]);
  }
};

export const getShoppingById = async (
  shoppingId: number,
  callback: (list: ShoppingListDetail | undefined) => void
) => {
  try {
    const res = await fetch(`${API_URL}/shopping/${shoppingId}/`, { headers: authHeaders() });
    if (!res.ok) {
      callback(undefined);
      return;
    }
    callback((await res.json()) as ShoppingListDetail);
  } catch (error) {
    console.log('Something went wrong: ', error);
    callback(undefined);
  }
};

export const addShopping = async (
  name: string,
  items: ShoppingItemInput[],
  discordId: string | undefined,
  callback: (id: number | undefined) => void
) => {
  try {
    const listRes = await fetch(`${API_URL}/shopping/`, {
      method: 'POST',
      headers: authHeaders(discordId),
      body: JSON.stringify({ name }),
    });
    if (!listRes.ok) {
      callback(undefined);
      return;
    }
    const list = (await listRes.json()) as ShoppingListDetail;
    for (const item of items) {
      await fetch(`${API_URL}/shopping/${list.id}/items/`, {
        method: 'POST',
        headers: authHeaders(discordId),
        body: JSON.stringify(item),
      });
    }
    console.log('Created shopping list', list.id, items);
    callback(list.id);
  } catch (error) {
    console.log('Something went wrong: ', error);
    callback(undefined);
  }
};

export const updateShopping = async (
  shoppingId: number,
  items: ShoppingItemInput[],
  discordId: string | undefined,
  callback: (updated: boolean) => void
) => {
  try {
    for (const item of items) {
      const res = await fetch(`${API_URL}/shopping/${shoppingId}/items/`, {
        method: 'POST',
        headers: authHeaders(discordId),
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        // 404 (unknown list) or 409 (list already completed) both mean "can't add"
        callback(false);
        return;
      }
    }
    console.log('Updated shopping list', shoppingId, items);
    callback(true);
  } catch (error) {
    console.log('Something went wrong: ', error);
    callback(false);
  }
};

export const finishShopping = async (shoppingId: number, completed: boolean, callback: () => void) => {
  try {
    await fetch(`${API_URL}/shopping/${shoppingId}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status: completed ? 'completed' : 'active' }),
    });
    console.log('Updated shopping status', shoppingId, completed);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    callback();
  }
};

export const undoneShopping = (shoppingId: number, callback: () => void) =>
  finishShopping(shoppingId, false, callback);

export const deleteShopping = async (shoppingId: number, callback: (message: string) => void) => {
  try {
    const res = await fetch(`${API_URL}/shopping/${shoppingId}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    callback(`Sletta shopping med id ${shoppingId} (status: ${res.status})`);
  } catch (error) {
    console.log('Something went wrong: ', error);
    callback('Noe gikk galt');
  }
};
