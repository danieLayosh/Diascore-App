import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getDiagnosisQuestions } from "../../api/main_requests";
import { getLinkData } from "../../firebase/firestore/linkTest";

export const DiagnosisTestForm = ({ linkId }) => {
    const [linkData, setLinkData] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLinkData = async () => {
            try {
                const data = await getLinkData(linkId);
                setLinkData(data);
                setLoading(false);
            } catch (error) {
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
            }
        };

        fetchQuestions();
    }, [linkData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (linkData === null) {
        return (
            <div>
                <p>Link data not found</p>
            </div>
        );
    }

    if (questions === null) {
        return (
            <div>
                <p>Loading questions...</p>
            </div>
        );
    }

    console.log(questions);

    return (
        <div>
            <p>DiagnosisTestForm {linkId}</p>
            <div>{/* Render your questions here */}</div>
        </div>
    );
};

DiagnosisTestForm.propTypes = {
    linkId: PropTypes.string,
};
