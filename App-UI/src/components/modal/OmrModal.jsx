import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from "@heroui/react";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export const OmrModal = ({ isOpen, onOpenChange, onConfirm }) => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);

    const handleImageChange = (e, setImage) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleOmr = () => {
        const data = {
            image1,
            image2,
        };
        onConfirm(data);
        onOpenChange(false);
    };

    const handleSubmit = () => {
        handleOmr();
        onOpenChange(false); 
    };

    const handleCancel = () => {
        onOpenChange(false);  
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Fill the Test</ModalHeader>
                <ModalBody>
                    {/* OMR Image Upload Section */}
                    <div>
                        <label htmlFor="image1">Choose Image 1 (OMR Paper):</label>
                        <Input
                            type="file"
                            id="image1"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setImage1)}
                        />
                        {image1 && <img src={image1} alt="Image 1 Preview" width="100" />}
                    </div>

                    <div>
                        <label htmlFor="image2">Choose Image 2 (OMR Paper):</label>
                        <Input
                            type="file"
                            id="image2"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setImage2)}
                        />
                        {image2 && <img src={image2} alt="Image 2 Preview" width="100" />}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onPress={handleCancel} className="font-bold">
                        Cancel
                    </Button>
                    <Button color="primary" onPress={handleSubmit} className="font-bold">
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
