import PropTypes from 'prop-types';

export const DiagnosisTestForm = ({ linkId }) => {

    
    return (
        <div>
            <p>DiagnosisTestForm {linkId}</p>
        </div>
    );

};

DiagnosisTestForm.propTypes = {
    linkId: PropTypes.string,
};
