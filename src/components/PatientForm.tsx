import React, {useEffect, useState} from 'react';
import {Button, TextField, Box} from '@mui/material';
import {PatientModel} from '../models/patient';

interface PatientFormProps{
    onSubmit: (patient: PatientModel) => void;
    initialData: PatientModel;
}

const PatientForm = ({onSubmit, initialData}: PatientFormProps) => {
    const[patient, setPatient] = useState<PatientModel>(initialData);

    useEffect(() => {
        setPatient(initialData)
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if(name === 'givenName'){
            setPatient({
                ...patient,
                name: [
                    {
                        ...patient.name[0],
                        given: value.split(' '),
                    },
                ],
            });
        }else if(name === 'familyName'){
            setPatient({
                ...patient,
                name: [
                    {
                        ...patient.name[0],
                        family: value
                    }
                ]  
            });
        }else if(name === 'birthDate'){
            setPatient({ ...patient, birthDate: value });
        }
        else {
            setPatient({...patient, [name]: value});
        }
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
                value={patient.name[0].given && patient.name[0]?.given.join(' ') || ''}
                onChange={handleChange}
                fullWidth
                margin='normal'
            />
            <TextField
                label="Family Name"
                name="familyName"
                value={patient.name && patient.name[0]?.family || ''}
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
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button type="submit" variant="contained" color="primary">
                Save
            </Button>
        </Box>
    )
}

export default PatientForm;