import { setDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../firebase"; 
import { v4 as uuidv4 } from "uuid";

export const generateNewLinkTest = async (userId, diagnosisId) => {
    console.log("Generating new link for user:", userId, "and diagnosis:", diagnosisId);

    const linkId = uuidv4();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);
    
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
        };

        await setDoc(linkDocRef, data);

        console.log("New link generated:", linkId);
        return linkId;
    } catch (error) {
        console.error("Error generating new link:", error);
        throw error;
    }
};