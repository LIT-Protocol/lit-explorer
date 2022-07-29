import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface StepsProps{
  steps: [] | object | any
}

const HorizontalLabelPositionBelowStepper = (props: StepsProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper className="stepper" activeStep={1} alternativeLabel>
        {props.steps.map((label: any) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default HorizontalLabelPositionBelowStepper;