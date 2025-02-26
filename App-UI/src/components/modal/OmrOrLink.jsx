import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

// eslint-disable-next-line react/prop-types
export const OmrOrLink = ({ isOpen, onOpenChange, onConfirm }) => {
    const handleOmr = () => {
        onConfirm("OMR");  
    };

    const handleLink = () => {
        onConfirm("Link"); 
        onOpenChange(false); 
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Confirm Delete</ModalHeader>
                <ModalBody>
                    <p>How whould you like to fill the test? by scanning the paper or by getting an online test.</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onPress={handleLink} className="font-bold">
                        Link
                    </Button>
                    <Button color="primary" onPress={handleOmr} className="font-bold">
                        OMR
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};