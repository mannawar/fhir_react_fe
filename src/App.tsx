import {useEffect, useState} from 'react';
import {Container, Typography, Box} from '@mui/material';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import {Patient} from '../src/models/patient';
import patientService from './services/patientService';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);  
  
  const loadPatients = async() => {
    try {
      const response = await patientService.Patient.list();
      console.log('Api Response', response);
      if(response.data.entry){
        const patientData = response.data.entry.map((entry: any) => entry.resource);
        console.log('Processed patient data', patientData);
        setPatients(patientData);
      }else {
        console.log('No patient entries found.');
        setPatients([]);
      }
    }catch(error){
      console.error("Error fetching patients:", error);
    }
  }
  console.log(patients)

  useEffect(() => {
    console.log('useEffect triggered');
    loadPatients();
  }, [])

  const handleSave = async(patient: Patient) => {
    if(patient.id){
      await patientService.Patient.updatePatientRecord(patient.id, patient);
    }else {
      await patientService.Patient.addPatientRecord(patient);
    }
    loadPatients();
    setCurrentPatient(null);
  }

  const handleEdit = async(patient: Patient) => {
    setCurrentPatient({
      ...patient,
      name: [{
        ...patient.name[0],
        given: patient.name[0].given,
        family: patient.name[0].family
      }]
    });
  };

  const handleDelete = async(id: string) => {
    await patientService.Patient.removePatient(id);
    loadPatients();
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        FHIR Patient Management
      </Typography>
      <Box mb={4}>
        <PatientForm  
          onSubmit={handleSave}
          initialData={currentPatient || {} as Patient}
        />
      </Box>
      <PatientList
        patients={patients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Container>
  )
}

export default App
