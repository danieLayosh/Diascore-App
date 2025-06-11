import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getDiagnosisQuestions } from "../../api/main_requests";
import { getLinkData, updateLinkWithAnswers } from "../../firebase/firestore/linkTest";
import { updateDiagnosisWithTestAnswers } from "../../firebase/firestore/diagnoses";
import { Question } from "./Question";
import useAlert from "../../context/useAlert"; 
import { useNavigate, useParams } from 'react-router-dom';

export const DiagnosisTestForm = ({ linkId }) => {
    const [linkData, setLinkData] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const { token } = useParams(); // Get the token from URL params

    useEffect(() => {
        const fetchLinkData = async () => {
            try {
                if (!token) {
                    throw new Error('Invalid link');
                }
                const data = await getLinkData(linkId, token);
                setLinkData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Invalid or expired link');
                setLoading(false);
            }
        };

        fetchLinkData();
    }, [linkId, token]);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (linkData) {
                const fetchedQuestions = await getDiagnosisQuestions(linkData.kORs, linkData.pORt);
                setQuestions(fetchedQuestions);
                setAnswers(new Array(fetchedQuestions.length).fill(null)); // Initialize answers array
            }
        };

        fetchQuestions();
    }, [linkData]);

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
    };

    const convertToNumber = {
        'א - אף פעם לא': 1,
        'פ - לפעמים': 2,
        'ת - לעיתים קרובות/תמיד': 3
    };
    
    const handleSubmit = async () => {
        // Check if all questions are answered
        if (answers.includes(null)) {
            showAlert("Please answer all questions before submitting.", "error");
            return;
        }
    
        try {
            // Convert answers to numbers
            const convertedAnswers = answers.map(answer => convertToNumber[answer]);
            
            // Update the link document with the secret token and answers
            await updateLinkWithAnswers(linkId, convertedAnswers, token);
            
            // Update the diagnosis document with link information and answers
            await updateDiagnosisWithTestAnswers(
                linkData.userId, 
                linkData.diagnosisId, 
                convertedAnswers,
                linkId,
                token
            );
            
            showAlert("Answers submitted successfully!", "success");
            
            // Redirect to a thank you page or show a completion message
            navigate('/diagnosis/thank-you');
        } catch (error) {
            console.error("Error submitting answers:", error);
            showAlert("Failed to submit answers. Please try again.", "error");
        }
    };
    

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (linkData === null) return <div className="text-center"><p>Link data not found</p></div>;
    if (linkData !== null && linkData.submitted === true) return <div className="text-center"><p>This link has expired or has already been submitted.</p></div>;
    if (questions === null) return <div className="text-center"><p>Loading questions...</p></div>;

    const question = questions[currentIndex];

    return (
        <div className="flex flex-col justify-center items-center bg-transparent p-4" dir="rtl">
            <Question
                index={currentIndex + 1}
                question={question}
                selectedAnswer={answers[currentIndex]}
                onAnswer={handleAnswer}
                onPrev={handlePrev}
                onNext={handleNext}
                isLast={currentIndex === questions.length - 1}
            />
            
            {/* Submit Button */}
            {currentIndex === questions.length - 1 && (
                <button 
                    onClick={handleSubmit}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
            )}
        </div>
    );
};

DiagnosisTestForm.propTypes = {
    linkId: PropTypes.string,
};
