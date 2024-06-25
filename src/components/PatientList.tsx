
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import {Patient} from '../models/patient';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface PatientListProps{
    patients: Patient[];
    onEdit: (patient: Patient) => void;
    onDelete: (id: string) => void;
}

const PatientList = ({ patients, onEdit, onDelete}: PatientListProps) => {
    return (
        <List>
            {patients.map((patient) => (
                <ListItem key={patient.id}>
                    <ListItemText
                        primary={`${patient.name[0].given.join(' ')} ${patient.name[0]?.family}`}
                        secondary={patient.birthDate}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(patient)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="edit" onClick={() => onDelete(patient.id!)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};
export default PatientList;