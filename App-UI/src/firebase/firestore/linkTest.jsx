import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase"; 
import { v4 as uuidv4 } from "uuid";
import { getDiagnosticDataByUUID } from "./diagnoses";

// Function to generate a secure random token
const generateSecureToken = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const generateNewLinkTest = async (userId, diagnosisId) => {
    console.log("Generating new link for user:", userId, "and diagnosis:", diagnosisId);

    const linkId = uuidv4();
    const secretToken = generateSecureToken(); // Use our browser-compatible function
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);
    const diagnosticData = await getDiagnosticDataByUUID(diagnosisId);
    const kORs = diagnosticData.type;
    const pORt = diagnosticData.filler;

    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user found");
        }

        const linkDocRef = doc(firestore, "Links", linkId);

        const data = {
            userId: userId,
            diagnosisId: diagnosisId,
            expirationDate: expirationDate,
            submitted: false,
            createdAt: new Date(),
            kORs: kORs,
            pORt: pORt,
            secretToken: secretToken,
        };

        await setDoc(linkDocRef, data);

        console.log("New link generated:", linkId);
        return { linkId, secretToken };
    } catch (error) {
        console.error("Error generating new link:", error);
        throw error;
    }
};

export const getLinkData = async (linkId, secretToken) => {
    console.log("Getting link data for link:", linkId);

    try {
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

        // Check if already submitted
        if (linkData.submitted) {
            throw new Error("Link already submitted");
        }

        // Check if expired
        if (new Date() > linkData.expirationDate.toDate()) {
            throw new Error("Link expired");
        }

        console.log("Link data found:", linkData);
        return linkData;
    } catch (error) {
        console.error("Error getting link data:", error);
        throw error;
    }
};

export const updateLinkAfterSubmission = async (linkId, secretToken, answers) => {
    console.log("Updating link after submission:", linkId);

    try {
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

        // Check if already submitted
        if (linkData.submitted) {
            throw new Error("Link already submitted");
        }

        // Check if expired
        if (new Date() > linkData.expirationDate.toDate()) {
            throw new Error("Link expired");
        }
        
        const updateData = {
            submitted: true,
            submittedAt: new Date(),
            answers: answers
        };

        await setDoc(linkDocRef, updateData, { merge: true });
        console.log("Link updated successfully after submission");
    } catch (error) {
        console.error("Error updating link after submission:", error);
        throw error;
    }
};

export const updateLinkWithAnswers = async (linkId, answers) => {
  try {
    console.log("Updating link with answers:", linkId);
    const linkRef = doc(firestore, "Links", linkId);
    const linkDoc = await getDoc(linkRef);

    if (!linkDoc.exists()) {
      throw new Error("Link not found");
    }

    const linkData = linkDoc.data();
    if (linkData.submitted) {
      throw new Error("This link has already been used");
    }

    await updateDoc(linkRef, {
      answers
    });

    console.log("Link updated successfully with answers");
  } catch (error) {
    console.error("Error updating link with answers:", error);
    throw error;
  }
};