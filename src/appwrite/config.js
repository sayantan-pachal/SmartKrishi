import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 
    

export const account = new Account(client);
export const databases = new Databases(client);

// Exporting IDs so can use in Fields.jsx and Crops.jsx
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const FIELDS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FIELDS_COLLECTION_ID;
export const CROPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CROPS_COLLECTION_ID;

// Add this so you can generate unique IDs for users and documents
export { ID, client };