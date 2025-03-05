import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getDiagnosisQuestions } from "../../api/main_requests";
import { getLinkData } from "../../firebase/firestore/linkTest";
import { Question } from "./question";
import useAlert from "../../context/useAlert"; 

export const DiagnosisTestForm = ({ linkId }) => {
    const [linkData, setLinkData] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchLinkData = async () => {
            try {
                const data = await getLinkData(linkId);
                setLinkData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch link data');
                setLoading(false);
            }
        };

        fetchLinkData();
    }, [linkId]);

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
    
    const handleSubmit = () => {
        // Check if all questions are answered
        if (answers.includes(null)) {
            showAlert("Please answer all questions before submitting.", "error");
            return;
        }
    
        // Convert answers to numbers
        const convertedAnswers = answers.map(answer => convertToNumber[answer]);
    
        // Process the converted answers (e.g., send them to a server)
        console.log("Submitted Answers (Converted):", convertedAnswers);
    
        // Example: Send answers to an API
        // submitAnswers({ linkId, answers: convertedAnswers }).then(response => console.log(response));
    
        showAlert("Answers submitted successfully!", "success");
    };
    

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (linkData === null) return <div className="text-center"><p>Link data not found</p></div>;
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
