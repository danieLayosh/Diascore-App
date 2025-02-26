import { collection, updateDoc, getDoc, addDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase"; 

export const addNewDiagnosticData = async (diagnosticData) => {
    console.log("Adding new diagnostic data:", diagnosticData);
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }

        // Access the specific user's document
        const userDocRef = doc(firestore, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("No user data found for the authenticated user: ${user.uid}");
        }
        // Access the Diagnoses sub-collection for the specific user
        const diagCollectionRef = collection(userDocRef, "Diagnoses");

        const newDiagRef = await addDoc(diagCollectionRef, diagnosticData);
        console.log("New diagnostic data added with ID:", newDiagRef.id);

        return { id: newDiagRef.id, ...diagnosticData };
    } catch (error) {
        console.error("Error adding new diagnostic data:", error);
        throw error;
    }
};

export const checkDiagnosisDataExists = async (uuid) => {
    console.log("Checking if diagnosis data exists:", uuid);

    const user = auth.currentUser;
    if (!user) {
        throw new Error("No authenticated user found");
    }
    
    // Access the specific user's document
    const userDocRef = doc(firestore, "Users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        throw new Error("No user data found for the authenticated user: ${user.uid}");
    }

    // Access the Diagnoses sub-collection for the specific user
    const diagCollectionRef = collection(userDocRef, "Diagnoses");
    const diagSnapshot = await getDoc(doc(diagCollectionRef, uuid));
    return diagSnapshot.exists();

};

export const updateDiagnosticData = async (diagnosticData) => {
    console.log("Updating diagnostic data:", diagnosticData);
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }

        // Access the specific user's document
        const userDocRef = doc(firestore, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("No user data found for the authenticated user: ${user.uid}");
        }
        
        // Extract document ID and remove it from the update object
        const { documentId, ...updatedData } = diagnosticData;

        if (!documentId) {
            throw new Error("Missing documentId for update.");
        }

        // Reference to the specific diagnosis document inside Diagnoses collection
        const diagDocRef = doc(userDocRef, "Diagnoses", documentId);

        await updateDoc(diagDocRef, updatedData);
        console.log("Diagnostic data successfully updated:", documentId);

        return { id: diagnosticData.id, ...diagnosticData };
    } catch (error) {
        console.error("Error updating diagnostic data:", error);
        throw error;
    }
};

export const getDiagnosticDataByUUID = async (uuid) => {
    console.log("Getting diagnostic data by UUID:", uuid);
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }

        // Access the specific user's document
        const userDocRef = doc(firestore, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("No user data found for the authenticated user: ${user.uid}");
        }
        // Access the Diagnoses sub-collection for the specific user
        const diagCollectionRef = collection(userDocRef, "Diagnoses");

        const diagSnapshot = await getDoc(doc(diagCollectionRef, uuid));
        if (diagSnapshot.exists()) {
            return { id: diagSnapshot.id, ...diagSnapshot.data() };
        } else {
            throw new Error("No diagnostic data found for the UUID: ${uuid}");
        }
    } catch (error) {
        console.error("Error getting diagnostic data by UUID:", error);
        throw error;
    }
};

export const deleteDiagnosticData = async (id) => {
    console.log("Deleting diagnostic data:", id);
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }

        // Access the specific user's document
        const userDocRef = doc(firestore, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("No user data found for the authenticated user: ${user.uid}");
        }

        // Access the Diagnoses sub-collection for the specific user
        const diagDocRef = doc(userDocRef, "Diagnoses", id);

        const diagSnapshot = await getDoc(diagDocRef);
        if (diagSnapshot.exists()) {
            await deleteDoc(diagDocRef);
            console.log(`Diagnostic data with id: ${id} deleted successfully.`);
        } else {
            throw new Error("No diagnostic data found for the id: ${id}");
        }
    } catch (error) {
        console.error("Error deleting diagnostic data by id:", error);
        throw error;
    }
};


export const updateAnswersArray = async (documentId, updatedAnswers) => {
    console.log("Updating answers array for document:", documentId);

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

        // Reference to the specific diagnosis document inside Diagnoses collection
        const diagDocRef = doc(userDocRef, "Diagnoses", documentId);

        const diagSnapshot = await getDoc(diagDocRef);

        if (!diagSnapshot.exists()) {
            throw new Error(`No diagnostic data found for the document ID: ${documentId}`);
        }

        // Update the answers array
        await updateDoc(diagDocRef, {
            answers: updatedAnswers,
        });

        console.log(`Answers array successfully updated for document ID: ${documentId}`);
        
        // Returning the updated data
        return { id: documentId, answers: updatedAnswers };
    } catch (error) {
        console.error("Error updating answers array:", error);
        throw error;
    }
};


export const updateDiagnosisStatus = async (diagnosisId, newStatus) => {
    console.log("Updating diagnosis status:", diagnosisId, newStatus);
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

        // Reference to the specific diagnosis document inside Diagnoses collection
        const diagDocRef = doc(userDocRef, "Diagnoses", diagnosisId);

        const diagSnapshot = await getDoc(diagDocRef);

        if (!diagSnapshot.exists()) {
            throw new Error(`No diagnostic data found for the document ID: ${diagnosisId}`);
        }

        // Update the status
        await updateDoc(diagDocRef, {
            status: newStatus,
        });

        console.log(`Diagnosis status successfully updated for document ID: ${diagnosisId}`);
        
        // Returning the updated data
        return { id: diagnosisId, status: newStatus };
    } catch (error) {
        console.error("Error updating diagnosis status:", error);
        throw error;
    }
};
