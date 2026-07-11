/* eslint-disable no-unused-vars */
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export const ID = {
    unique: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
};

// Hashing Function
const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

export const account = {
    // 1. Create Account (Signup)
    create: async (userId, email, password, name) => {
        // Hash the password BEFORE saving it to Google Sheets
        const hashedPassword = await hashPassword(password);
        const userData = { userId, email, password: hashedPassword, name, phone: "" };

        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                sheet: "users",
                data: userData
            })
        });

        return userData;
    },

    // 2. Create Session (Login)
    createEmailPasswordSession: async (email, password) => {
        // Hash the input password to match against the database hash
        const hashedPassword = await hashPassword(password);

        const res = await fetch(`${SCRIPT_URL}?sheet=users`);
        const users = await res.json();

        if (users.error) throw new Error(users.error);

        const user = users.find(u =>
            String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase() &&
            String(u.password) === String(hashedPassword) // Compare Hash to Hash
        );

        if (!user) throw new Error("Invalid email or password.");

        localStorage.setItem("smartkrishi_user", JSON.stringify(user));
        return user;
    },

    // 3. Get currently logged in user profile
    get: async () => {
        const userData = localStorage.getItem("smartkrishi_user");
        if (!userData) throw new Error("No active session");
        return JSON.parse(userData);
    },

    // 4. Logout
    deleteSession: async (sessionId = "current") => {
        localStorage.removeItem("smartkrishi_user");
        return true;
    },

    // 5. Update Password from Account Settings
    updatePassword: async (newPassword, oldPassword) => {
        const current = await account.get();
        
        // 1. Verify old password
        const hashedOld = await hashPassword(oldPassword);
        if (current.password !== hashedOld) throw new Error("Old password incorrect");

        // 2. Hash new password
        const hashedNew = await hashPassword(newPassword);
        
        // 3. Prepare updated user object
        const updatedUser = { ...current, password: hashedNew };

        // 4. Send the UPDATE command to Google Sheets
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                sheet: "users",
                action: "update",
                id: current.userId, // This tells the script which row to edit
                data: updatedUser
            })
        });

        // 5. Save locally so the session doesn't drop
        localStorage.setItem("smartkrishi_user", JSON.stringify(updatedUser));
        return true;
    }
};

// Replicating Appwrite's Database interface
export const databases = {
    listDocuments: async (dbId, collectionId, queries = []) => {
        const res = await fetch(`${SCRIPT_URL}?sheet=${collectionId}`);
        const data = await res.json();

        const currentUser = JSON.parse(localStorage.getItem("smartkrishi_user"));
        if (currentUser && currentUser.userId) {
            return { documents: data.filter(doc => doc.userId === currentUser.userId) };
        }
        return { documents: data };
    },

    createDocument: async (dbId, collectionId, documentId, data) => {
        const documentData = { ...data, $id: documentId };
        
        // 🧼 Clear dashboard cache so it pulls fresh row data on navigation
        sessionStorage.removeItem("dashboard_crop_data");
        sessionStorage.removeItem("dashboard_cache_time");

        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                sheet: collectionId,
                action: "create",
                data: documentData
            })
        });
        return documentData;
    },

    updateDocument: async (dbId, collectionId, documentId, data) => {
        const documentData = { ...data, $id: documentId };

        // 🧼 Clear dashboard cache on update
        sessionStorage.removeItem("dashboard_crop_data");
        sessionStorage.removeItem("dashboard_cache_time");

        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                sheet: collectionId,
                action: "update",
                id: documentId,
                data: documentData
            })
        });
        return documentData;
    },

    deleteDocument: async (dbId, collectionId, documentId) => {
        // 🧼 Clear dashboard cache on delete
        sessionStorage.removeItem("dashboard_crop_data");
        sessionStorage.removeItem("dashboard_cache_time");

        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                sheet: collectionId,
                action: "delete",
                id: documentId
            })
        });
        return true;
    }
};

export const DATABASE_ID = "smartkrishi_db";
export const FIELDS_COLLECTION_ID = "fields";
export const CROPS_COLLECTION_ID = "crops";