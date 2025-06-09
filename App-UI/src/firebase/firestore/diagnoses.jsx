import { collection, updateDoc, getDoc, addDoc, doc, deleteDoc, query, where, getDocs } from "firebase/firestore";
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

export const getDiagnosticDataByUUID = async (diagnosisId, linkId = null, secretToken = null) => {
    console.log("Getting diagnostic data by UUID:", diagnosisId);

    try {
        let userId;
        
        // If we have a link, use it to get the user ID
        if (linkId && secretToken) {
            const linkDocRef = doc(firestore, "Links", linkId);
            const linkDoc = await getDoc(linkDocRef);
            
            if (!linkDoc.exists()) {
                throw new Error("Link not found");
            }

            const linkData = linkDoc.data();
            
            // Verify the secret token
            if (linkData.secretToken !== secretToken) {
                throw new Error("Invalid link");
            }

            userId = linkData.userId;

            // Create a query with the link information
            const diagnosisQuery = query(
                collection(firestore, "Users", userId, "Diagnoses"),
                where("__name__", "==", diagnosisId),
                where("linkId", "==", linkId),
                where("secretToken", "==", secretToken)
            );

            const querySnapshot = await getDocs(diagnosisQuery);
            
            if (querySnapshot.empty) {
                throw new Error("Diagnosis not found");
            }

            return querySnapshot.docs[0].data();
        } else {
            // If no link provided, require authentication
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No authenticated user found");
            }

            const diagnosisDocRef = doc(firestore, "Users", user.uid, "Diagnoses", diagnosisId);
            const diagnosisDoc = await getDoc(diagnosisDocRef);
            
            if (!diagnosisDoc.exists()) {
                throw new Error("Diagnosis not found");
            }

            return diagnosisDoc.data();
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


export const updateDiagnosisStatus = async (diagnosisId, status, linkId = null, secretToken = null) => {
    console.log("Updating diagnosis status:", diagnosisId, status);
    try {
        let userId;
        
        // If we have a link, use it to get the user ID
        if (linkId && secretToken) {
            const linkDocRef = doc(firestore, "Links", linkId);
            const linkDoc = await getDoc(linkDocRef);
            
            if (!linkDoc.exists()) {
                throw new Error("Link not found");
            }

            const linkData = linkDoc.data();
            
            // Verify the secret token
            if (linkData.secretToken !== secretToken) {
                throw new Error("Invalid link");
            }

            userId = linkData.userId;
        } else {
            // If no link provided, require authentication
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No authenticated user found");
            }
            userId = user.uid;
        }

        const diagnosisDocRef = doc(firestore, "Users", userId, "Diagnoses", diagnosisId);
        await updateDoc(diagnosisDocRef, {
            status: status,
            lastUpdated: new Date()
        });
        console.log("Diagnosis status updated successfully");
    } catch (error) {
        console.error("Error updating diagnosis status:", error);
        throw error;
    }
};


export const uploadJsonToDiagnosis = async (diagnosisId, jsonData, linkId = null, secretToken = null) => {
    console.log("Uploading JSON to diagnosis:", diagnosisId);
    try {
        let userId;
        
        // If we have a link, use it to get the user ID
        if (linkId && secretToken) {
            const linkDocRef = doc(firestore, "Links", linkId);
            const linkDoc = await getDoc(linkDocRef);
            
            if (!linkDoc.exists()) {
                throw new Error("Link not found");
            }

            const linkData = linkDoc.data();
            
            // Verify the secret token
            if (linkData.secretToken !== secretToken) {
                throw new Error("Invalid link");
            }

            userId = linkData.userId;
        } else {
            // If no link provided, require authentication
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No authenticated user found");
            }
            userId = user.uid;
        }

        const diagnosisDocRef = doc(firestore, "Users", userId, "Diagnoses", diagnosisId);
        await updateDoc(diagnosisDocRef, {
            scores: jsonData,
            lastUpdated: new Date()
        });
        console.log("JSON uploaded successfully to diagnosis");
    } catch (error) {
        console.error("Error uploading JSON to diagnosis:", error);
        throw error;
    }
};

export const updateDiagnosisWithTestAnswers = async (userId, diagnosisId, answers, linkId, secretToken) => {
    console.log("Updating diagnosis with test answers:", { userId, diagnosisId, linkId });

    try {
        const diagnosisDocRef = doc(firestore, "Users", userId, "Diagnoses", diagnosisId);
        
        // Update only the specific fields we need
        const updateData = {
            answers: answers,
            lastUpdated: new Date(),
            status: "COMPLETED",
            linkId: linkId,
            secretToken: secretToken
        };

        // Use updateDoc instead of setDoc to only update specific fields
        await updateDoc(diagnosisDocRef, updateData);
        console.log("Diagnosis updated successfully with test answers");
    } catch (error) {
        console.error("Error updating diagnosis with test answers:", error);
        throw error;
    }
};
