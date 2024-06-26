import {useEffect, useState} from 'react';
import {Container, Typography, Box, TextField, Button, InputAdornment, IconButton} from '@mui/material';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import {PatientModel} from '../src/models/patient';
import patientService from './services/patientService';
import { toast } from 'react-toastify';
import SearchResult from './components/SearchResult';
import ClearIcon from '@mui/icons-material/Clear';

function App() {
  const [patients, setPatients] = useState<PatientModel[]>([]);
  const [currentPatient, setCurrentPatient] = useState<PatientModel | null>(null);  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchResult, setSearchResults] = useState<PatientModel[]>([]);
  
  const loadPatients = async() => {
    try {
      const response = await patientService.Patient.list();
      if(response.entry){
        const patientData = response.entry.map((entry: any) => entry.resource);
        setPatients(patientData);
      }else {
        setPatients([]);
      }
    }catch(error){
      console.error("Error fetching patients:", error);
    }
  }

  useEffect(() => {
    loadPatients();
  }, [])

  const handleSave = async(patient: PatientModel) => {
    if(patient.id){
      await patientService.Patient.updatePatientRecord(patient.id, patient);
    }else {
      await patientService.Patient.addPatientRecord(patient);
    }
    loadPatients();
    setCurrentPatient(null);
    setShowForm(false);
    toast.success('Patient saved successfully!');
  }

  const handleEdit = async(patient: PatientModel) => {
    setCurrentPatient({
      ...patient,
      name: [{
        ...patient.name[0],
        given: patient.name[0].given,
        family: patient.name[0].family
      }]
    });
    setShowForm(true);
    toast.success('Patient info edited successfully')
  };

  const handleDelete = async(id: string) => {
    await patientService.Patient.removePatient(id);
    loadPatients();
  }

  const handleSearch = async() => {
    if(searchQuery.trim() === ''){
      setSearchResults([]);
      loadPatients();
      return;
    }
    try{
      const response = await patientService.Patient.searchPatients(searchQuery);
      if(response.entry){
        const patientData = response.entry.map((entry: any) => entry.resource);
        setPatients(patientData);
      }else {
        setPatients([]);
      }
    }catch(error){
      console.error("Error searching patients:", error);
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    loadPatients();
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        FHIR Patient Management
      </Typography>
      <Box mb={2} display="flex" justifyContent="center" alignItems="center" width="100%" >
        <TextField
          label="Search by name or id"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          margin='normal'
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon/>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button onClick={handleSearch} variant="contained" color="primary" sx={{ ml: 2 }}>
          Search
        </Button>
        &nbsp;
        &nbsp;
        &nbsp;
        <br/>
        <Button onClick={() => setShowForm(!showForm)} variant='contained' color="secondary" >
          {showForm ? 'Cancel': 'Add Patient'}
        </Button>
      </Box>
      {showForm && (
        <Box mb={4}>
          <PatientForm  
            onSubmit={handleSave}
            initialData={currentPatient || { resourceType: "Patient", name: [{ given: [], family: '' }] } as PatientModel}
          />
      </Box>
    )}
    {searchQuery.trim() === '' ? (
              <PatientList
              patients={patients}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />):(
              <SearchResult patients={patients}/>
          ) 
    }

    </Container>
  )
}

export default App
