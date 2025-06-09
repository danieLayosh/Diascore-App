import PropTypes from 'prop-types';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useState } from 'react';

export const LinkGeneratedModal = ({ isOpen, onClose, linkUrl }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(linkUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Link Generated Successfully</ModalHeader>
                <ModalBody>
                    <p className="text-sm text-gray-600 mb-4">
                        Share this link with the patients parents. The link will expire in 14 days and can only be used once.
                    </p>
                    <div className="flex gap-2">
                        <Input
                            value={linkUrl}
                            readOnly
                            className="flex-1"
                        />
                        <Button
                            color={copied ? "success" : "primary"}
                            onClick={handleCopy}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

LinkGeneratedModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    linkUrl: PropTypes.string.isRequired,
}; 