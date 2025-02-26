import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  useDisclosure
} from "@heroui/react";
import { columns } from "./columns";
import { EyeIcon, EditIcon, DeleteIcon } from "./icons";
import { DiagnosisPopup } from '../diagnosisPopUp/DiagnosisPopup';
import { useNavigate } from "react-router-dom";
import { deleteDiagnosticData } from "../../firebase/firestore/diagnoses";
import { ConfirmDelete } from '../modal/ConfirmDelete';
import { GoGear } from "react-icons/go";
import { OmrOrLink } from '../modal/OmrOrLink';
import { OmrModal } from '../modal/OmrModal';

const statusColorMap = {
  COMPLETED: "success",
  CANCELLED: "danger",
  PENDING: "warning",
};

export const DiagList = ({ Diagnoses }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); 
  const [diagnosisToDelete, setDiagnosisToDelete] = useState(null);
  const [isOmrOrLinkOpen, setIsOmrOrLinkOpen] = useState(false);  
  const [diagnosisToProcess, setDiagnosisToProcess] = useState(null);  
  const [isOmrOpen, setIsOmrOpen] = useState(false);  

  const navigate = useNavigate();

  const handleDetailsClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    onOpen(); // Open the modal
  };

  const handleEditClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    const id = diagnosis.id;  // Assuming diagnosis has an 'id' field
    navigate(`/diagnosis/edit/${id}`);
  };

  const handleDeleteClick = (diagnosis) => {
    setDiagnosisToDelete(diagnosis);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (diagnosisToDelete) {
      deleteDiagnosticData(diagnosisToDelete.id);
    }
    setConfirmDeleteOpen(false);
  };

  const handleProcessDiagnosis = (diagnosis) => {
    setDiagnosisToProcess(diagnosis);
    setIsOmrOrLinkOpen(true);
  };

  const handleOmrOrLinkConfirm = (choice) => {
    setIsOmrOrLinkOpen(false);
    if (choice === "OMR") {
      handleOmrModalOpen();
    }
  };

  const handleOmrModalOpen = () => {
    setIsOmrOpen(!isOmrOpen);
  };

  const handleOmeModalClose = () => {
    setIsOmrOpen(false);
  };

  const handleModalFormSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
    const { image1, image2, ...rest } = formData;
    const modifiedObj = {
      files: [image1, image2], 
      ...rest
    };
    console.log('Modified object:', modifiedObj);
    handleOmeModalClose();
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "patientName":
        return (
          <div className="flex items-center gap-2">
            <User avatarProps={{ radius: "lg", src: user.avatar }} />
            <p className="text-bold text-black text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "diagnosisDate":
        return <p className="text-bold text-black text-sm capitalize">{cellValue}</p>;
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleDetailsClick(user)}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span 
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditClick(user)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Process diagnosis">
              <span 
                className="text-lg text-default-500 cursor-pointer active:opacity-50"
                onClick={() => handleProcessDiagnosis(user)}
              >
                <GoGear />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span 
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteClick(user)}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <Table aria-label="Example table with custom cells" color="secondary" selectionMode="single">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={Diagnoses}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DiagnosisPopup isOpen={isOpen} onClose={onClose} diagnosis={selectedDiagnosis} />

      <ConfirmDelete 
        isOpen={confirmDeleteOpen} 
        onOpenChange={setConfirmDeleteOpen} 
        onConfirm={handleDeleteConfirm} 
      />
      
      <OmrOrLink 
        isOpen={isOmrOrLinkOpen} 
        onOpenChange={setIsOmrOrLinkOpen} 
        onConfirm={handleOmrOrLinkConfirm} 
      />

      <OmrModal
        isOpen={isOmrOpen}
        onOpenChange={handleOmrModalOpen}
        onConfirm={handleModalFormSubmit}
      />
    </>
  );
};

DiagList.propTypes = {
  Diagnoses: PropTypes.array.isRequired,
};
