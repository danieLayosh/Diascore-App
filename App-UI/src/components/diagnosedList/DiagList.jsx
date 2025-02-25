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

const statusColorMap = {
  COMPLETED: "success",
  CANCELLED: "danger",
  PENDING: "warning",
};

export const DiagList = ({ Diagnoses }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const navigate = useNavigate();

  const handleDetailsClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    onOpen(); // Open the modal
  };

  const handleEditClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    const id = diagnosis.id;  // Assuming diagnosis has an 'id' field

    // Navigate to the EditDiagnosisForm with the diagnosis id in the URL
    console.log("Navigating to edit diagnosis form with id:", id);
    navigate(`/diagnosis/edit/${id}`);
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
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
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

      {/* Modal */}
      <DiagnosisPopup isOpen={isOpen} onClose={onClose} diagnosis={selectedDiagnosis} />
    </>
  );
};

DiagList.propTypes = {
  Diagnoses: PropTypes.array.isRequired, // Ensure it expects an array
};
