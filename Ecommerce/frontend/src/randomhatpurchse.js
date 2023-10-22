import { useState, useEffect } from 'react';
import { useStepTracker } from './randomhatpurchse';

export const useStepTracker = (initialSteps = 0) => {
  const [steps, setSteps] = useState(initialSteps);

  useEffect(() => {
    document.title = `Steps: ${steps}`;
  }, [steps]);

  const incrementSteps = () => {
    setSteps(steps + 1);
  };

  return { steps, incrementSteps };
};
