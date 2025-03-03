import { useNavigate } from "react-router-dom";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

// eslint-disable-next-line react/prop-types
export const ConfirmDontSave = ({ isOpen, onOpenChange }) => {
    const navigate = useNavigate();

    const handleReturnClick = () => {
        onOpenChange(false); // Close modal
        navigate('/welcome'); // Navigate to home
    };

    const handleCancelClick = () => {
        onOpenChange(false);  // Close the modal when cancel is clicked
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Confirm Leave Without Save
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to go back without saving?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="light" onPress={handleCancelClick}>
                        Close
                    </Button>
                    <Button color="danger" onPress={handleReturnClick}>
                        Return
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
