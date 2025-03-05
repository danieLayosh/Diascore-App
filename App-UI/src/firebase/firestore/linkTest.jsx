import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase"; 
import { v4 as uuidv4 } from "uuid";
import { getDiagnosticDataByUUID } from "./diagnoses";

export const generateNewLinkTest = async (userId, diagnosisId) => {
    console.log("Generating new link for user:", userId, "and diagnosis:", diagnosisId);

    const linkId = uuidv4();
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
        };

        await setDoc(linkDocRef, data);

        console.log("New link generated:", linkId);
        return linkId;
    } catch (error) {
        console.error("Error generating new link:", error);
        throw error;
    }
};


export const getLinkData = async (linkId) => {
    console.log("Getting link data for link:", linkId);

    try {
        const linkDocRef = doc(firestore, "Links", linkId);
        const linkDoc = await getDoc(linkDocRef)

        if (!linkDoc.exists()) {
            throw new Error("Link not found");
        }

        const linkData = linkDoc.data();
        console.log("Link data found:", linkData);
        return linkData;
    } catch (error) {
        console.error("Error getting link data:", error);
        throw error;
    }
};