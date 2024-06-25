import React, {useEffect, useState} from 'react';
import {Button, TextField, Box} from '@mui/material';
import {Patient} from '../models/patient';

interface PatientFormProps{
    onSubmit: (patient: Patient) => void;
    initialData: Patient;
}

const PatientForm = ({onSubmit, initialData}: PatientFormProps) => {
    const[patient, setPatient] = useState<Patient>(initialData);

    useEffect(() => {
        setPatient(initialData)
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setPatient({...patient, [name]: value})
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(patient);
    };

    return(
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Given Name"
                name="givenName"
                value={patient.name[0]?.given.join(' ') || ''}
                onChange={handleChange}
                fullWidth
                margin='normal'
            />
            <TextField
                label="Family Name"
                name="familyName"
                value={patient.name[0]?.family || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Birth Date"
                name="birthDate"
                value={patient.birthDate || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Save
            </Button>
        </Box>
    )
}

export default PatientForm;