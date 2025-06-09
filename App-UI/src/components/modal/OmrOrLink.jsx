import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
export const OmrOrLink = ({ isOpen, onOpenChange, onConfirm, hasAnswers }) => {
    const handleOmr = () => {
        onConfirm("OMR");  
    };

    const handleLink = () => {
        onConfirm("Link"); 
        onOpenChange(false); 
    };

    const handleProcess = () => {
        onConfirm("Process");
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Process Diagnosis</ModalHeader>
                <ModalBody>
                    <p>How would you like to process this diagnosis?</p>
                    {hasAnswers && (
                        <p className="text-sm text-gray-500 mt-2">
                            This diagnosis already has answers submitted. You can process them directly.
                        </p>
                    )}
                </ModalBody>
                <ModalFooter className="flex gap-2">
                    {hasAnswers && (
                        <Button color="success" onPress={handleProcess} className="font-bold">
                            Process Answers
                        </Button>
                    )}
                    <Button color="secondary" onPress={handleLink} className="font-bold">
                        Generate Link
                    </Button>
                    <Button color="primary" onPress={handleOmr} className="font-bold">
                        Scan OMR
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

OmrOrLink.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    hasAnswers: PropTypes.bool
};

OmrOrLink.defaultProps = {
    hasAnswers: false
};