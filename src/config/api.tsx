import { queryGetItemByUser, queryGetItemsByUser } from "./querys";
import { BASE_API } from "./urls";

export const API_USER_LOGIN_URL = `${BASE_API}/auth/local`;

export const API_USER_ITEMS_URL = (userId: number) =>
  `${BASE_API}/items?${queryGetItemsByUser(userId)}`;

export const API_USER_ITEM_URL = (userId: number, itemId: number) =>
  `${BASE_API}/items?${queryGetItemByUser(userId, itemId)}`;

export const API_ITEM_DETAIL_URL = (itemId: number) =>
  `${BASE_API}/items/${itemId}`;

export const API_ITEM_NEW_URL = `${BASE_API}/items`;

export const API_UPLOAD_URL = `${BASE_API}/upload`;

export const API_DELETE_UPLOAD_URL = (uploadId: number) =>
  `${BASE_API}/upload/files/${uploadId}`;

export const API_ITEM_DELETE_URL = (itemId: number) =>
  `${BASE_API}/items/${itemId}`;
