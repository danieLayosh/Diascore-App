import { useParams } from "react-router-dom";
// import GreenCoverButton from "../../components/buttons/GreenCoverButton";
import { DiagnosisTestForm } from "../../components/link/DiagnosisTestForm";

export const DiagnosisTest = () => {
    
    // get the linkId from the URL
    const { linkId } = useParams();

    return (
        <div className="flex flex-col items-start bg-gradient-bg text-text-light min-h-screen">
            <div className="flex justify-between items-center w-full px-4 sm:px-12 lg:px-12 py-4 bg-card-bg shadow-lg">
                <h3 className="text-5xl sm:text-6xl font-island-moments text-primary-color font-semibold">Diascore</h3>
                <h3 className="text-xl sm:text-6xl lg:text-xl text-white ">Diagnostic form</h3>
                {/* <GreenCoverButton text="Submit" defaultColor="black" onClick={() => {console.log("GreenCoverButton clicked")}} /> */}
            </div>
            {/* <div className="flex flex-col items-center w-full px-4 sm:px-12 lg:px-12 py-4">
                <h3 className="text-xl items-center sm:text-6xl lg:text-6xl text-white ">Diagnostic form</h3>
            </div> */}
            <div className="flex flex-col items-center w-full px-4 sm:px-12 lg:px-12 py-40">
                <DiagnosisTestForm linkId={linkId} />
            </div>
        </div>
    );
};