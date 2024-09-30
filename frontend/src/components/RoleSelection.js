import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Beispiel-Icon für JobSeeker
import BusinessIcon from '@mui/icons-material/Business'; // Beispiel-Icon für Recruiter
import BackButton from './BackButton';

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <Typography variant="h4" align="center" gutterBottom>
                Register as
            </Typography>

            <Box display="flex" justifyContent="space-around" alignItems="center" mt={5}>
                {/* JobSeeker Section */}
                <Box textAlign="center">
                    <IconButton
                        onClick={() => navigate('/register/jobseeker')}
                        style={{ fontSize: '100px', color: '#1976d2' }} // Stil anpassen
                    >
                            {<img
                                src="/images/jobseeker-image.png" alt="JobSeeker" // Dein eigenes Bild
                                //alt="JobSeeker Icon"
                                style={{ width: '300px', height: '300px' }} // Größe des Bildes anpassen
                            />}
                        {/*<AccountCircleIcon fontSize="inherit" /> {/* Symbol für JobSeeker */}
                    </IconButton>
                    <Typography variant="h5" mt={2}>
                        JobSeeker
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        Find your dream job easily.
                    </Typography>
                </Box>

                {/* Recruiter Section */}
                <Box textAlign="center">
                    <IconButton
                        onClick={() => navigate('/register/recruiter')}
                        style={{ fontSize: '100px', color: '#ff5722' }} // Stil anpassen
                    >
                        {<img
                            src="/images/Recruiter-image.png" alt="Recruiter" // Dein eigenes Bild
                            //alt="JobSeeker Icon"
                            style={{ width: '300px', height: '300px' }} // Größe des Bildes anpassen
                        />}
                        {/*<BusinessIcon fontSize="inherit" /> {/* Symbol für Recruiter */}
                    </IconButton>
                    <Typography variant="h5" mt={2}>
                        Recruiter
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        Post jobs and find talent.
                    </Typography>
                </Box>
            </Box>
            <BackButton/>
        </div>
    );
};

export default RoleSelection;
