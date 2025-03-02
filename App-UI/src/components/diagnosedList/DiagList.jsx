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
import { omrRequest } from '../../api/omr_requests';
import { mainRequest } from '../../api/main_requests';
import { updateAnswersArray, updateDiagnosisStatus, getDiagnosticDataByUUID, uploadJsonToDiagnosis } from '../../firebase/firestore/diagnoses';

const statusColorMap = {
  COMPLETED: "success",
  READY: "primary",
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

  const handleModalFormSubmit = async (formData) => {
    console.log('Form submitted with data:', formData);


    if (diagnosisToProcess) {
      const diagnosisId = diagnosisToProcess.id;
      const { image1, image2} = formData;
      // API call to OMR
      const response = await omrRequest(image1, image2, diagnosisToProcess.pORt, diagnosisToProcess.kORs)
      console.log('OMR API response:', response.answers);

      await updateAnswersArray(diagnosisId, response.answers);
      await updateDiagnosisStatus(diagnosisId, "READY");
      await handleCalculateScores(diagnosisToProcess);
    }
    handleOmeModalClose();
  };

  const handleCalculateScores = async (diagnosis) => {
    try {
      // Get diagnostic data by UUID
      const data = await getDiagnosticDataByUUID(diagnosis.id);
      console.log("Main API response:", data);
  
      if (data) {
        // Ensure dates are in a proper format
        const birthDateStr = data.birthDate.trim();
        const diagnosisDateStr = data.diagnosisDate.trim();
  
        // Check if the dates are empty
        if (!birthDateStr || !diagnosisDateStr) {
          console.error("Empty birthDate or diagnosisDate:", birthDateStr, diagnosisDateStr);
          return;
        }
  
        const birthDate = new Date(birthDateStr);
        const diagnosisDate = new Date(diagnosisDateStr);
  
        // Check if the date conversion was successful
        if (isNaN(birthDate.getTime()) || isNaN(diagnosisDate.getTime())) {
          console.error("Invalid date format:", birthDateStr, diagnosisDateStr);
          return;
        }
  
        console.log("Calculated birthDate:", birthDate, "diagnosisDate:", diagnosisDate);
  
        // Calculate total months difference
        const totalMonths = (diagnosisDate.getFullYear() - birthDate.getFullYear()) * 12 +
                            (diagnosisDate.getMonth() - birthDate.getMonth());
  
        // Convert to decimal years (e.g., 5.5 for 5 years, 5 months)
        const age = (totalMonths / 12).toFixed(1); // Keep one decimal place
        console.log("Calculated age in years:", age);
  
        // Send data to the main API
        const response_main = await mainRequest(data.gender, age, data.filler, data.type, data.answers);
        console.log('Main API response:', response_main);
  
      // Check if 'converted_scores' exists in the response
      if (response_main.converted_scores) {
        const { converted_scores } = response_main;

        // Dynamically create scoresData from the converted_scores
        const scoresData = {};
        
        // Loop through the converted_scores and add them to scoresData
        for (const key in converted_scores) {
          // Use Object.prototype.hasOwnProperty.call() to avoid prototype warning
          if (Object.prototype.hasOwnProperty.call(converted_scores, key)) {
            scoresData[key] = converted_scores[key];
          }
        }

        console.log("Formatted scores data:", scoresData);
        // If the response contains 'converted_scores', upload JSON and update diagnosis status
        await uploadJsonToDiagnosis(diagnosis.id, scoresData);
        await updateDiagnosisStatus(diagnosis.id, "COMPLETED");
      } else {
        console.error("Main API did not return valid scores:", response_main);
      }

    } else {
      console.error("No diagnostic data found for the provided diagnosis ID.");
    }

  } catch (error) {
    // Catch and log any errors that occur in the try block
    console.error("Error in handleCalculateScores:", error);
  }
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
