import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    CheckboxGroup,
    Checkbox,
} from "@heroui/react";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export const OmrModal = ({ isOpen, onOpenChange, onConfirm }) => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [kORs, setkORs] = useState(['kids']);
    const [pORt, setpORt] = useState(['p']);

    const handleTypeChange = (values) => {
        setkORs(values.slice(-1));
    };

    const handleFillerChange = (values) => {
        setpORt(values.slice(-1));
    };

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
            kORs,
            pORt,
        };
        onConfirm(data);
        onOpenChange(false);  // Close modal after confirmation
    };

    const handleSubmit = () => {
        handleOmr();
        onOpenChange(false);  // Close modal after selection
    };

    const handleCancel = () => {
        onOpenChange(false);  // Close modal on cancel
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

                    <div className="border-white border-2 p-2 rounded-xl">
                    <CheckboxGroup
                        isRequired
                        size="lg"
                        label="Type"
                        name='type'
                        defaultValue={["kids"]}
                        orientation='horizontal'
                        value={kORs}
                        onChange={handleTypeChange}
                        classNames={{ label: "text-lg text-black" }}
                        className='flex flex-row'
                    >
                        <Checkbox value="kids">Kids</Checkbox>
                        <Checkbox value="school">School</Checkbox>
                    </CheckboxGroup>
                </div>
                <div className="border-white border-2 p-2 rounded-xl">
                    <CheckboxGroup
                        isRequired
                        size="lg"
                        label="Filler"
                        name='filler'
                        defaultValue={["Parent"]}
                        orientation="horizontal"
                        value={pORt}
                        onChange={handleFillerChange}
                        classNames={{ label: "text-lg text-black" }}
                        className='flex flex-row'
                    >
                        <Checkbox value="p">Parent</Checkbox>
                        <Checkbox value="t">Teacher</Checkbox>
                    </CheckboxGroup>
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
