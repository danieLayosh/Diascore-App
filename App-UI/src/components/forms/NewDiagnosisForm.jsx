/* eslint-disable no-unused-vars */
{ /* <NewDiagnosisForm /> 
 This is the form that will be used to create a new diagnosis. It will contain the following fields:
 - Patient Name
 - Patient ID 
 - Patient gender
 - Patient Date of Birth
 - Diagnosis Date
 - diagnosis filler name
 - pORt (Parent or teacher - p or t)
 - kORs (kids or students - kids or school)
 - Diagnosis (link to Diagnosis Form || Dianosis Form Photo || Fill Manual)
*/}
import { Form, Input, CheckboxGroup, Checkbox, DateInput} from '@heroui/react';
import {CalendarDate, parseDate} from "@internationalized/date";
import { useState } from 'react';

const NewDiagnosisForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [selectedGender, setSelectedGender] = useState(["boy"]);
    const [selectedType, setSelectedType] = useState(['kids']);
    const [selectedFiller, setSelectedFiller] = useState(['p']);

    const handleChange = (values) => {
        setSelectedGender(values.slice(-1));
    };

    const handleTypeChange = (values) => {
        setSelectedType(values.slice(-1));
    };

    const handleFillerChange = (values) => {
        setSelectedFiller(values.slice(-1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted({
            patientName: e.target.patientName.value,
            patientID: e.target.patientID.value,
            gender: selectedGender,
            type: selectedType,
            filler: selectedFiller,
            birthDate: e.target.birthDate.value,
            diagnosisDate: e.target.diagnosisDate.value,
            diagnosisFillerName: e.target.DiagnosisFillerName.value,
        });
    };

    // Function to get today's date in 'YYYY-MM-DD' format
    const getTodayDate = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full shadow-card p-4 rounded-xl">
            <h3 className="text-2xl font-bold text-black">New Diagnosis</h3>

            <Form
            onSubmit={handleSubmit}
            className="flex w-full flex-wrap"
            validationBehavior="native"
            id='new-diagnosis-form'
            >
                <Input
                    isRequired
                    className="max-w-[220px]"
                    label="Patient Name"
                    name="patientName"
                    // labelPlacement='outside'
                    type="text"
                    variant="bordered" 
                    classNames={{ 
                        label: "text-lg text-black",
                        input: "border-none focus:outline-none focus:ring-0", // Removes inner border and focus ring
                    }}
                    onClear={() => console.log("input cleared")}
                />
                <Input 
                    className="max-w-[220px]"
                    label="Patient ID" 
                    // labelPlacement='outside'
                    name='patientID'
                    type="text" 
                    variant="bordered" 
                    minLength={9}
                    maxLength={9}
                    classNames={{ 
                        label: "text-lg text-black",
                        input: "border-none focus:outline-none focus:ring-0", // Removes inner border and focus ring
                    }}
                    onClear={() => console.log("input cleared")}
                />
                <div className="border-white border-2 p-2 rounded-xl">
                    <CheckboxGroup
                        isRequired
                        size="lg"
                        label="Gender"
                        name='gender'
                        defaultValue={["boy"]}
                        orientation="horizontal"
                        value={selectedGender}
                        onChange={handleChange}
                        classNames={{ label: "text-lg text-black" }}
                        className='flex flex-row'
                    >
                        <Checkbox value="boy">Boy</Checkbox>
                        <Checkbox value="girl">Girl</Checkbox>
                    </CheckboxGroup>
                </div>
                <div className="flex w-full flex-wrap">
                    <DateInput
                        isRequired
                        defaultValue={parseDate("2020-04-04")}
                        className="max-w-[220px]"
                        label="Birth date"
                        name='birthDate'
                        placeholderValue={new CalendarDate(1995, 11, 6)}
                        variant='bordered'
                        classNames={{ 
                            label: "text-lg text-black",
                            input: "text-lg mb-2 ",
                            errorMessage: "text-red-500 text-lg",
                        }}
                     />
                </div>
                <div className="flex w-full flex-wrap">
                    <DateInput
                        isRequired
                        defaultValue={parseDate(getTodayDate())}
                        className="max-w-[220px]"
                        label="Diagnosis date"
                        name='diagnosisDate'
                        placeholderValue={new CalendarDate(1995, 11, 6)}
                        variant='bordered'
                        classNames={{ 
                            label: "text-lg text-black",
                            input: "text-lg mb-2 ",
                            errorMessage: "text-red-500 text-lg",
                        }}
                     />
                </div>
                <Input
                    isRequired
                    className="max-w-[220px]"
                    label="Diagnosis filler Name"
                    name="DiagnosisFillerName"
                    // labelPlacement='outside'
                    type="text"
                    variant="bordered" 
                    classNames={{ 
                        label: "text-lg text-black",
                        input: "border-none focus:outline-none focus:ring-0", // Removes inner border and focus ring
                    }}
                    onClear={() => console.log("input cleared")}
                />
                <div className="border-white border-2 p-2 rounded-xl">
                    <CheckboxGroup
                        isRequired
                        size="lg"
                        label="Type"
                        name='type'
                        defaultValue={["kids"]}
                        orientation='horizontal'
                        value={selectedType}
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
                        value={selectedFiller}
                        onChange={handleFillerChange}
                        classNames={{ label: "text-lg text-black" }}
                        className='flex flex-row'
                    >
                        <Checkbox value="p">Parent</Checkbox>
                        <Checkbox value="t">Teacher</Checkbox>
                    </CheckboxGroup>
                </div>
            </Form>
        </div>    
);
};

export default NewDiagnosisForm;