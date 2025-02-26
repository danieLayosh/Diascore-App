import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

// eslint-disable-next-line react/prop-types
export const ConfirmDelete = ({ isOpen, onOpenChange, onConfirm }) => {
    const handleDeleteClick = () => {
        onConfirm();  // Call the onConfirm callback passed from the parent component
    };

    const handleCancelClick = () => {
        onOpenChange(false);  // Close the modal when cancel is clicked
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Confirm Delete</ModalHeader>
                <ModalBody>
                    <p>Think twice before deleting this item. Are you sure you want to delete this item?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="light" onPress={handleCancelClick}>
                        Close
                    </Button>
                    <Button color="danger" onPress={handleDeleteClick}>
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};