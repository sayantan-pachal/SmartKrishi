import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject('69cd38d8002c1a81cf34'); 
    

export const account = new Account(client);
export const databases = new Databases(client);

// Add this so you can generate unique IDs for users and documents
export { ID, client };