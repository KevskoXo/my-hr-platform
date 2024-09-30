import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ToggleSliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  background: theme.palette.grey[300],
  borderRadius: 30,
  padding: '5px',
  margin: '1rem 0',
  width: '100%',
  height: '55px',
  border: `3px solid ${theme.palette.primary.main}`,
}));

const ToggleSliderButton = styled(Box)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  padding: '15px 20px',
  cursor: 'pointer',
  zIndex: 2,
  fontWeight: 500,
  transition: 'color 0.3s',
}));

const SliderMarker = styled(Box)(({ theme, position }) => ({
  position: 'absolute',
  top: 5,
  left: position === 'option1' ? 5 : 'calc(50% + 5px)',
  width: 'calc(50% - 10px)',
  height: '45px',
  background: theme.palette.primary.main,
  borderRadius: 30,
  transition: 'left 0.3s ease-in-out',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
}));

const CustomSlider = ({ options, value, onChange }) => {
  return (
    <ToggleSliderContainer>
      <SliderMarker position={value} />
      {options.map((option, index) => (
        <ToggleSliderButton
          key={index}
          onClick={() => onChange(option.value)}
          style={{
            color: value === option.value ? '#fff' : '#000',
          }}
        >
          {option.label}
        </ToggleSliderButton>
      ))}
    </ToggleSliderContainer>
  );
};

export default function SliderExample() {
  const [role, setRole] = useState('option1');

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: '2rem', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Wähle eine Option
      </Typography>
      <CustomSlider
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ]}
        value={role}
        onChange={setRole}
      />
    </Box>
  );
}
