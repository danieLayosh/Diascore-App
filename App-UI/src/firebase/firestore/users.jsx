import { collection, getDoc, getDocs, setDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase"; 

// Add a user
export const addUserDoc = async (user) => {
    try {

        // Define the user object
        const newUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            createdAt: new Date(),
            diagnoses_count: 0,
        };

        // Add the user to the Users collection
        const userDocRef = doc(firestore, 'Users', user.uid);
        await setDoc(userDocRef, newUser);

        // create an empty Diagnoses subcollection for the user
        const diagnosesCollectionRef = collection(userDocRef, 'Diagnoses');
        await setDoc(doc(diagnosesCollectionRef, 'exampleDiagnosis'), {
            title: 'Example Diagnosis',
            description: 'This is a placeholder diagnosis.',
            createdAt: new Date(),
            answers: [],
        });

        console.log("User doc created successfully for UIS:", user.uid);
    } catch (e) {
        console.error("Error creating user document: ", e);
        throw e;
    }
}

// Add or update a user
export const addOrUpdateUserDoc = async (user) => {
    try {
        const userDocRef = doc(firestore, 'Users', user.uid);

        // Check if the document exists
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            // If no document exists, create one
            console.log("No user doc found. Creating a new one...");
            await addUserDoc(user); // Call the addUserDoc function to create a new document
        } else {
            // If the document exists, compare properties and update if necessary
            const userData = userDocSnap.data();
            const updatedData = {};

            // Check for mismatched properties
            if (userData.displayName !== user.displayName) {
                updatedData.displayName = user.displayName || '';
            }
            if (userData.email !== user.email) {
                updatedData.email = user.email;
            }

            // Calculate the size of the Diagnoses subcollection
            const diagnosesCollectionRef = collection(userDocRef, 'Diagnoses');
            const diagnosesSnap = await getDocs(diagnosesCollectionRef);
            const diagnosesCount = diagnosesSnap.size;

            if (userData.diagnoses_count !== diagnosesCount) {
                updatedData.diagnoses_count = diagnosesCount;
            }

            // If there are updates, update the document
            if (Object.keys(updatedData).length > 0) {
                await updateDoc(userDocRef, updatedData);
                console.log("User doc updated successfully:", updatedData);
            } else {
                console.log("User doc is already up-to-date.");
            }
        }
    } catch (error) {
        console.error("Error syncing user document:", error);
        throw error;
    }
};

// Edit user data
export const editUserData = async (id , updatedData) => {
    if (!id) {
        throw new Error("No user ID provided");
    }

    try {
        const userDoc = doc(firestore, "Users", id);
        if (!userDoc.exists()) {
            throw new Error("No user data found for the provided ID: ${id}");
        }

        await updateDoc(userDoc, updatedData);
        console.log("User data updated successfully");
    } catch (error) {
        console.error("Error updating user data: ", error);
        throw error;
    }

}

// Delete current user data
export const deleteCurrentUserData = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }
        const userDoc = doc(firestore, "Users", user.uid);
        await deleteDoc(userDoc);
        console.log("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
};

// Delete current user account
export const deleteCurrentUserAccount = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }
        await user.delete();

    } catch (error) {
        console.error("Error deleting user account: ", error);
        throw error;
    }
};

// Delete current user account and data
export const deleteAccountAndUserData = async () => {
    try {
        await deleteCurrentUserData();
        await deleteCurrentUserAccount();
        console.log("User account and data deleted successfully");
    } catch (error) {
        console.error("Error deleting user account and data: ", error);
        throw error;
    }
}

export const getAuthenticatedUserDataWithDiagnoses = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }

        // Access the specific user's document
        const userDocRef = doc(firestore, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error(`No user data found for the authenticated user: ${user.uid}`);
        }

        const userData = userDoc.data();

        // Access the Diagnoses sub-collection for the specific user
        const diagCollectionRef = collection(userDocRef, "Diagnoses");
        const diagSnapshot = await getDocs(diagCollectionRef);

        // Map through the query snapshot and return the data
        const diagnoses = diagSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { userData, diagnoses };
    } catch (error) {
        console.error("Error fetching authenticated user's data with diagnoses: ", error);
        throw error;
    }
};