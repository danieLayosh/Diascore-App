import {
    Dropdown,
    DropdownSection,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    cn,
  } from "@heroui/react";
import { useNavigate } from "react-router-dom"; 
import useAlert from "../../context/useAlert"; 
import { useAuth } from "../../context/useAuth";
import { addNewDiagnosticData, checkDiagnosisDataExists, updateDiagnosticData } from "../../firebase/firestore/diagnoses";

  export const AddNoteIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M7.37 22h9.25a4.87 4.87 0 0 0 4.87-4.87V8.37a4.87 4.87 0 0 0-4.87-4.87H7.37A4.87 4.87 0 0 0 2.5 8.37v8.75c0 2.7 2.18 4.88 4.87 4.88Z"
          fill="currentColor"
          opacity={0.4}
        />
        <path
          d="M8.29 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM15.71 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM12 14.75h-1.69V13c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.75H7c-.41 0-.75.34-.75.75s.34.75.75.75h1.81V18c0 .41.34.75.75.75s.75-.34.75-.75v-1.75H12c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"
          fill="currentColor"
        />
      </svg>
    );
  };
    
  export const EditDocumentIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52v7.95C2 19.94 4.07 22 7.52 22h7.95c3.46 0 5.52-2.06 5.52-5.52V8.52C21 5.06 18.93 3 15.48 3Z"
          fill="currentColor"
          opacity={0.4}
        />
        <path
          d="M21.02 2.98c-1.79-1.8-3.54-1.84-5.38 0L14.51 4.1c-.1.1-.13.24-.09.37.7 2.45 2.66 4.41 5.11 5.11.03.01.08.01.11.01.1 0 .2-.04.27-.11l1.11-1.12c.91-.91 1.36-1.78 1.36-2.67 0-.9-.45-1.79-1.36-2.71ZM17.86 10.42c-.27-.13-.53-.26-.77-.41-.2-.12-.4-.25-.59-.39-.16-.1-.34-.25-.52-.4-.02-.01-.08-.06-.16-.14-.31-.25-.64-.59-.95-.96-.02-.02-.08-.08-.13-.17-.1-.11-.25-.3-.38-.51-.11-.14-.24-.34-.36-.55-.15-.25-.28-.5-.4-.76-.13-.28-.23-.54-.32-.79L7.9 10.72c-.35.35-.69 1.01-.76 1.5l-.43 2.98c-.09.63.08 1.22.47 1.61.33.33.78.5 1.28.5.11 0 .22-.01.33-.02l2.97-.42c.49-.07 1.15-.4 1.5-.76l5.38-5.38c-.25-.08-.5-.19-.78-.31Z"
          fill="currentColor"
        />
      </svg>
    );
  };
  
  export const DeleteDocumentIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M21.07 5.23c-1.61-.16-3.22-.28-4.84-.37v-.01l-.22-1.3c-.15-.92-.37-2.3-2.71-2.3h-2.62c-2.33 0-2.55 1.32-2.71 2.29l-.21 1.28c-.93.06-1.86.12-2.79.21l-2.04.2c-.42.04-.72.41-.68.82.04.41.4.71.82.67l2.04-.2c5.24-.52 10.52-.32 15.82.21h.08c.38 0 .71-.29.75-.68a.766.766 0 0 0-.69-.82Z"
          fill="currentColor"
        />
        <path
          d="M19.23 8.14c-.24-.25-.57-.39-.91-.39H5.68c-.34 0-.68.14-.91.39-.23.25-.36.59-.34.94l.62 10.26c.11 1.52.25 3.42 3.74 3.42h6.42c3.49 0 3.63-1.89 3.74-3.42l.62-10.25c.02-.36-.11-.7-.34-.95Z"
          fill="currentColor"
          opacity={0.399}
        />
        <path
          clipRule="evenodd"
          d="M9.58 17a.75.75 0 0 1 .75-.75h3.33a.75.75 0 0 1 0 1.5h-3.33a.75.75 0 0 1-.75-.75ZM8.75 13a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };

  
  export default function ActionNewDiagnosis() {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSaveDiagnosis = async () => {
      console.log("Saving diagnosis");
      const form = document.querySelector("form"); // Make sure your form has the right selector
    
      if (form) {
        // Trigger form submit action
        form.requestSubmit();
    
        // Extracting data from the form fields
        const formData = new FormData(form);
    
        // Print the form data
        const formDataObj = {};
        formData.forEach((value, key) => {
          formDataObj[key] = value; 
        });

        // Check if the diagnosis data already exists
        if (formDataObj["documentId"]) {
          const diagnosisExists = await checkDiagnosisDataExists(formDataObj["documentId"]);
          if (diagnosisExists === true) {
            updateDiagnosticData(formDataObj);
            showAlert("Diagnosis saved successfully", "success");
            navigate("/home");
            return;
          }
        }
        formDataObj["therapistID"] = user.uid;
        formDataObj["answers"] = [];
        formDataObj["status"] = "PENDING";

        if (formDataObj["gender"] === "boy") {
          formDataObj["avatar"] = "public/avatars/boy_avatar.jpg"
        } else if (formDataObj["gender"] === "girl") {
          formDataObj["avatar"] = "public/avatars/girl_avatar.jpg"
        }
        
        if (formDataObj["patientID"] !== "") {
          // Check if the patient ID is valid with 9 digits
          if (formDataObj["patientID"].length !== 9) {
            showAlert("Please enter a valid patient ID with 9 digits", "error");
            return;
          }
        }

        if (formDataObj["patientName"] === "" || formDataObj["DiagnosisFillerName"] === "") {
            showAlert("Please fill in the required fields", "error");
            return;
        } else {
          delete formDataObj["documentId"];
          addNewDiagnosticData(formDataObj);
          showAlert("Diagnosis saved successfully", "success");
          navigate("/home");
        }
        console.log("Form Data:", formDataObj);
      }
    };
    
    const handleProcessDiagnosis = async () => {
      console.log("Processing diagnosis");
      // TODO: Add process diagnosis logic
    };

    const handleDeleteDiagnosis = async () => {
      console.log("Deleting diagnosis");
      // TODO: Add delete diagnosis logic
    };

    return (
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content:
            "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
            <Button title="Add New" className="group bg-transparent  cursor-pointer outline-none hover:rotate-90 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" className="stroke-indigo-400 fill-none group-hover:fill-indigo-800 group-active:stroke-indigo-200 group-active:fill-indigo-600 group-active:duration-0 duration-300">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5" />
                    <path d="M8 12H16" strokeWidth="1.5" />
                    <path d="M12 16V8" strokeWidth="1.5" />
                </svg>
            </Button>        
        </DropdownTrigger>
        <DropdownMenu aria-label="Dropdown menu with description" variant="faded">
          <DropdownSection title="Actions">
            <DropdownItem
              key="save"
              description="Save the diagnosis"
              onPress={handleSaveDiagnosis}
              startContent={<AddNoteIcon className={iconClasses} />}
            >
              Save
            </DropdownItem>
            <DropdownItem
              key="process"
              description="Allows you to process the diagnosis"
              onPress={handleProcessDiagnosis}
              startContent={<EditDocumentIcon className={iconClasses} />}
            >
              Process diagnosis
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Danger zone">
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Permanently delete a diagnosis"
              onPress={handleDeleteDiagnosis}
              startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
            >
              Delete diagnosis
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    );
  }
  