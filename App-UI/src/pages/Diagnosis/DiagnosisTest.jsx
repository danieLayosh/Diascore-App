import { useParams } from "react-router-dom";

export const DiagnosisTest = () => {
    
    // get the linkId from the URL
    const { linkId } = useParams();


    return (
        <div>
            <h1>Diagnosis Test for {linkId}</h1>
        </div>
    );
};