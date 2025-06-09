import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { showAlert } from '../../utils/alert';
import { useAuth } from '../../context/AuthContext';
import './DiagnosisProcessor.css';

const DiagnosisProcessor = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchDiagnoses();
    }
  }, [currentUser]);

  const fetchDiagnoses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        throw new Error("You must be logged in to view diagnoses");
      }
      
      // Query diagnoses for the current user
      const diagnosesRef = collection(firestore, `Users/${currentUser.uid}/Diagnoses`);
      const q = query(diagnosesRef, where("status", "in", ["pending", "completed"]));
      const querySnapshot = await getDocs(q);
      
      const diagnosesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setDiagnoses(diagnosesList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
      setError(error.message || "Failed to load diagnoses. Please try again.");
      setLoading(false);
    }
  };

  const handleProcessAnswers = async (diagnosis) => {
    if (processingId === diagnosis.id) return; // Prevent double processing

    try {
      setProcessingId(diagnosis.id);
      setError(null);

      // Get the diagnosis document
      const diagnosisRef = doc(firestore, `Users/${currentUser.uid}/Diagnoses/${diagnosis.id}`);
      const diagnosisDoc = await getDoc(diagnosisRef);
      
      if (!diagnosisDoc.exists()) {
        throw new Error("Diagnosis not found. It may have been deleted.");
      }

      const diagnosisData = diagnosisDoc.data();
      
      // Validate diagnosis data
      if (!diagnosisData.answers || diagnosisData.answers.length === 0) {
        throw new Error("No answers found in the diagnosis.");
      }

      if (diagnosisData.status === "completed") {
        throw new Error("This diagnosis has already been processed.");
      }

      console.log("Processing answers for diagnosis:", diagnosisData);

      // Process answers and calculate scores
      const processedAnswers = diagnosisData.answers.map(answer => ({
        questionId: answer.questionId,
        answer: answer.answer
      }));

      // Upload answers to diagnosis
      await updateDoc(diagnosisRef, {
        processedAnswers,
        status: "completed",
        processedAt: new Date()
      });

      console.log("Answers processed successfully");
      showAlert("Answers processed successfully!", "success");
      
      // Refresh the diagnoses list
      await fetchDiagnoses();
    } catch (error) {
      console.error("Error processing answers:", error);
      const errorMessage = error.message || "Failed to process answers. Please try again.";
      showAlert(errorMessage, "error");
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetails = (diagnosis) => {
    // Navigate to diagnosis details page
    console.log("Viewing details for diagnosis:", diagnosis.id);
  };

  if (!currentUser) {
    return (
      <div className="diagnosis-list error">
        <div className="error-message">
          <h3>Authentication Required</h3>
          <p>Please log in to view and process diagnoses.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="diagnosis-list loading">
        <div className="loading-spinner">Loading diagnoses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="diagnosis-list error">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchDiagnoses}>Try Again</button>
        </div>
      </div>
    );
  }

  if (diagnoses.length === 0) {
    return (
      <div className="diagnosis-list empty">
        <p>No diagnoses found.</p>
      </div>
    );
  }

  return (
    <div className="diagnosis-list">
      <h2>Diagnoses</h2>
      {diagnoses.map((diagnosis) => (
        <div key={diagnosis.id} className="diagnosis-item">
          <div className="diagnosis-info">
            <h3>{diagnosis.patientName || "Unnamed Patient"}</h3>
            <p>Status: {diagnosis.status}</p>
            <p>Date: {new Date(diagnosis.createdAt?.toDate()).toLocaleDateString()}</p>
          </div>
          <div className="diagnosis-actions">
            {diagnosis.status === "pending" && (
              <button
                onClick={() => handleProcessAnswers(diagnosis)}
                className="process-button"
                disabled={processingId === diagnosis.id}
              >
                {processingId === diagnosis.id ? "Processing..." : "Process Answers"}
              </button>
            )}
            <button
              onClick={() => handleViewDetails(diagnosis)}
              className="view-button"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiagnosisProcessor; 