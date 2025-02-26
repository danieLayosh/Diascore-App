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
import { Form, Input, CheckboxGroup, Checkbox, DateInput } from '@heroui/react';
import { CalendarDate, parseDate } from "@internationalized/date";
import { useState, useEffect } from 'react';
import { getDiagnosticDataByUUID } from '../../firebase/firestore/diagnoses';
import PropTypes from 'prop-types';

const EditDiagnosisForm = ({ id }) => {
    const [submitted, setSubmitted] = useState(false);
    const [diagnosisData, setDiagnosisData] = useState(null);

    // States for controlled inputs
    const [selectedGender, setSelectedGender] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const [selectedFiller, setSelectedFiller] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchDiagnosisData = async () => {
                try {
                    const data = await getDiagnosticDataByUUID(id);
                    console.log("Diagnosis Data:", data);
                    setDiagnosisData(data);

                    // Update state when data is fetched
                    setSelectedGender([data?.gender || "boy"]);
                    setSelectedType([data?.type || "kids"]);
                    setSelectedFiller([data?.filler || "p"]);
                } catch (error) {
                    console.error("Error fetching diagnosis data:", error);
                }
            };

            fetchDiagnosisData();
        }
    }, [id]);

    const handleChange = (values) => setSelectedGender(values.slice(-1));
    const handleTypeChange = (values) => setSelectedType(values.slice(-1));
    const handleFillerChange = (values) => setSelectedFiller(values.slice(-1));

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

    if (!diagnosisData) {
        return <p>Loading...</p>; // Prevents rendering empty fields
    }

    return (
        <div className="flex flex-col items-center justify-center w-full shadow-card p-4 rounded-xl">
            <h3 className="text-2xl font-bold text-black">Edit Diagnosis</h3>

            <Form
                onSubmit={handleSubmit}
                className="flex w-full flex-wrap"
                validationBehavior="native"
                id="edit-diagnosis-form"
            >
                <input type="hidden" name="documentId" value={id} />
                <Input
                    isRequired
                    className="max-w-[220px]"
                    label="Patient Name"
                    name="patientName"
                    type="text"
                    variant="bordered"
                    classNames={{
                        label: "text-lg text-black",
                        input: "text-xl border-none focus:outline-none focus:ring-0 pb-0 pl-0 text-black",
                    }}
                    defaultValue={diagnosisData?.patientName || ''}
                />
                <Input
                    className="max-w-[220px]"
                    label="Patient ID"
                    name="patientID"
                    type="text"
                    variant="bordered"
                    minLength={9}
                    maxLength={9}
                    classNames={{
                        label: "text-lg text-black",
                        input: "text-xl border-none focus:outline-none focus:ring-0 pb-0 pl-0 text-black",
                    }}
                    defaultValue={diagnosisData?.patientID || ''}
                />
                <div className="border-white border-2 p-2 rounded-xl">
                    <CheckboxGroup
                        isRequired
                        size="lg"
                        label="Gender"
                        name="gender"
                        orientation="horizontal"
                        value={selectedGender}
                        onChange={handleChange}
                        classNames={{ label: "text-lg text-black" }}
                        className="flex flex-row"
                    >
                        <Checkbox value="boy">Boy</Checkbox>
                        <Checkbox value="girl">Girl</Checkbox>
                    </CheckboxGroup>
                </div>
                <div className="flex w-full flex-wrap">
                    <DateInput
                        isRequired
                        defaultValue={diagnosisData?.birthDate ? parseDate(diagnosisData.birthDate) : parseDate("2020-04-04")}
                        className="max-w-[220px]"
                        label="Birth date"
                        name="birthDate"
                        placeholderValue={new CalendarDate(1995, 11, 6)}
                        variant="bordered"
                        classNames={{
                            label: "text-lg text-black",
                            input: "text-lg mb-2",
                            errorMessage: "text-red-500 text-lg",
                        }}
                    />
                </div>
                <div className="flex w-full flex-wrap">
                    <DateInput
                        isRequired
                        defaultValue={diagnosisData?.diagnosisDate ? parseDate(diagnosisData.diagnosisDate) : parseDate("2024-01-01")}
                        className="max-w-[220px]"
                        label="Diagnosis date"
                        name="diagnosisDate"
                        placeholderValue={new CalendarDate(1995, 11, 6)}
                        variant="bordered"
                        classNames={{
                            label: "text-lg text-black",
                            input: "text-lg mb-2",
                            errorMessage: "text-red-500 text-lg",
                        }}
                    />
                </div>
                <Input
                    isRequired
                    className="max-w-[220px]"
                    label="Diagnosis filler Name"
                    name="DiagnosisFillerName"
                    type="text"
                    variant="bordered"
                    classNames={{
                        label: "text-lg text-black",
                        input: "text-xl border-none focus:outline-none focus:ring-0 pb-0 pl-0 text-black",
                    }}
                    defaultValue={diagnosisData?.DiagnosisFillerName || ''}
                />
                <div className="border-white border-2 p-2 rounded-xl">
                    <CheckboxGroup
                        isRequired
                        size="lg"
                        label="Type"
                        name="type"
                        orientation="horizontal"
                        value={selectedType}
                        onChange={handleTypeChange}
                        classNames={{ label: "text-lg text-black" }}
                        className="flex flex-row"
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
                        name="filler"
                        orientation="horizontal"
                        value={selectedFiller}
                        onChange={handleFillerChange}
                        classNames={{ label: "text-lg text-black" }}
                        className="flex flex-row"
                    >
                        <Checkbox value="p">Parent</Checkbox>
                        <Checkbox value="t">Teacher</Checkbox>
                    </CheckboxGroup>
                </div>
            </Form>
        </div>
    );
};

EditDiagnosisForm.propTypes = {
    id: PropTypes.any.isRequired,
};

export default EditDiagnosisForm;