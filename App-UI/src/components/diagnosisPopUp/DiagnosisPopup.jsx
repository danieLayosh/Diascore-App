import {
  Modal,
  ModalContent,
  ModalBody,
  Image,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Button,
} from "@heroui/react";
import PropTypes from 'prop-types';
import { useState } from 'react';

const capitalizeFullName = (fullName) => {
  if (!fullName) return ''; // Return an empty string if fullName is undefined or null
  const nameParts = fullName.split(' ');
  return nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const statusColorMap = {
  COMPLETED: "success",
  READY: "primary",
  PENDING: "warning",
};

const convertToList = (json) => {
  if (!json) return []; // Return an empty array if json is undefined or null
  
  const scoresList = Object.entries(json).map(([key, value]) => {
    const cleanedKey = key.replace('_score', ''); // Remove '_score' from the key
    const CapitalKey = capitalizeFullName(cleanedKey);
    return { key: CapitalKey, value };
  });

  // Separate 'Total' score to be shown last
  const totalScore = scoresList.filter(score => score.key === 'Total');
  const otherScores = scoresList.filter(score => score.key !== 'Total');

  // Combine the scores so that the 'Total' appears last
  return [...otherScores, ...totalScore];
};

const convertToListDetails = (json) => {
  if (!json) return [];

  const scoresList = Object.entries(json).map(([key, value]) => {
    if (key === 'scores' || key === 'answers' || key === 'id' || key ==="therapistID" || key ==="avatar" || key ==="patientName" ) return null;
    const CapitalKey = capitalizeFullName(key);
    const CapitalValue = capitalizeFullName(value)
    return { key: CapitalKey, value: CapitalValue };
  }).filter(item => item !== null); // Remove null values from the array

  return scoresList;
};

export const DiagnosisPopup = ({ isOpen, onClose, diagnosis }) => {
  const [showDetailsCard, setShowDetailsCard] = useState(false); // State to control the details card visibility

  // Determine if the filler is Parent or Teacher
  const fillerLabel = diagnosis.filler === 'p' ? 'Parent' : (diagnosis.filler === 't' ? 'Teacher' : '');
  if (diagnosis.filler === 'p') {
    diagnosis.filler = 'Parent';
  } else if (diagnosis.filler === 't') {
    diagnosis.filler = 'Teacher';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" centered="true" scrollBehavior="inside" >
      <ModalContent>
        <ModalBody>
          <Card className="max-w-[400px] bg-transparent shadow-none border-none" >
            <CardHeader className="flex gap-3">
              <Image
                alt="avatar"
                height={40}
                radius="sm"
                src={diagnosis.avatar}
                width={40}
              />
              <div className="flex flex-col">
                <p className="text-md ">{capitalizeFullName(diagnosis.patientName)}</p>
                <p className={`text-small text-${statusColorMap[diagnosis.status] || "default-500"}`}>
                  {diagnosis.status}
                </p>
                {fillerLabel && (
                  <p className="text-small text-gray-600">{fillerLabel}</p> 
                )}
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {convertToList(diagnosis.scores).map((score, index) => {
                const isTotal = score.key === 'Total'; // Check if it's the Total score
                return (
                  <div key={index}>
                    {isTotal ? <Divider /> : <></>}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        fontWeight: isTotal ? 'bold' : '500', // Make Total score bold
                        color: isTotal ? '#FF5733' : '#000000', // Change color for Total score
                      }}
                    >
                      <p>{score.key}</p>
                      <p>{score.value}</p>
                    </div>
                    {/* Add divider only if it's not the last score */}
                    {index < convertToList(diagnosis.scores).length - 1 && <Divider />}
                  </div>
                );
              })}

              {/* Button to toggle the details card */}
              <Button onClick={() => setShowDetailsCard(prevState => !prevState)} className="mt-4">
                {showDetailsCard ? 'Hide Details' : 'Show Details'}
              </Button>

              {/* Display details card when showDetailsCard is true */}
              {showDetailsCard && (
                <Card className="mt-4 bg-transparent shadow-none border-none">
                  <CardHeader className="flex gap-3">
                    <Image
                      alt="avatar"
                      height={40}
                      radius="sm"
                      src={diagnosis.avatar}
                      width={40}
                    />
                    <div className="flex flex-col">
                      <p className="text-md ">{capitalizeFullName(diagnosis.patientName)}</p>
                      <p className={`text-small text-${statusColorMap[diagnosis.status] || "default-500"}`}>
                        {diagnosis.status}
                      </p>
                      {fillerLabel && (
                        <p className="text-small text-gray-600">{fillerLabel}</p> 
                      )}
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {convertToListDetails(diagnosis).map((propertie, index) => {
                      return (
                        <div key={index}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px',
                            }}
                          >
                            <p>{propertie.key}</p>
                            <p>{propertie.value}</p>
                          </div>
                          {/* Add divider only if it's not the last propertie */}
                          {index < convertToListDetails(diagnosis).length - 1 && <Divider />}
                        </div>
                      );
                    })}
                  </CardBody>
                </Card>
              )}
            </CardBody>
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

DiagnosisPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  diagnosis: PropTypes.object,
};
