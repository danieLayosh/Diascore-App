import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../utils';

// Helper function to render array or object values
const renderValue = (value) => {
  if (Array.isArray(value)) {
    // If it's an array, check if it's empty or not
    return value.length > 0 ? "Filled" : "Empty";
  } else if (typeof value === 'object' && value !== null) {
    // If it's an object, show a message or inspect its keys
    return "Filled";  // You can modify this to show more details about the object
  }
  return value;
};

export const DiagnosisPopup = ({ isOpen, onClose, diagnosis }) => {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Diagnosis Details</ModalHeader>
            <ModalBody>
              {diagnosis ? (
                <div>
                  {Object.entries(diagnosis)
                    .filter(([key]) => !["id", "avatar", "therapistID"].includes(key))
                    .map(([key, value]) => (
                      <p key={key}>
                        <strong>{capitalizeFirstLetter(key)}:</strong>{" "}
                        {renderValue(value)} {/* Render the value */}
                      </p>
                    ))}
                </div>
              ) : (
                <p>Loading2...</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

DiagnosisPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    diagnosis: PropTypes.shape({
        patientName: PropTypes.string,
        diagnosisDate: PropTypes.string,
        status: PropTypes.string,
    }),
};
  