import { Box, Typography } from "@mui/material";
import { PatientModel } from "../models/patient"

interface SearchResultProps{
    patients: PatientModel[];
}
export default function SearchResult ({patients}: SearchResultProps){
    return (
        <Box>
           <Typography variant="h5" gutterBottom>
                Top Search Results
            </Typography> 
            {patients && patients.length > 0 ? (
                <Box>
                    {patients.map((patient) => (
                        <Box key={patient.id} mb={2}>
                            <Typography variant="subtitle1">
                                Name: {patient.name[0].given && patient.name[0].given.join(' ')} {patient.name[0].family && patient.name[0].family}
                                </Typography>
                            <Typography variant="body2">ID: {patient.id}</Typography>
                        </Box>
                    ))}
                </Box>
            ): (  <Typography variant="body1">No patients found.</Typography>   
            )}
        </Box>
    )
}