import { View } from '@vectord/ui';
import React, { useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import EventRegisteredHeader from '../components/EventRegisteredHeader';
import EventGroup from '../components/EventGroup';
import AddToCalendar from '../components/AddToCalendar';

const SlideFlow = ({
  onAddtoCalendar,
  onEventGroupComplete,
  eventTitle,
  eventDate,
  eventTime,
  onJoinPc,
  whatsappQrLink
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddToCalendar
            onAdd={() => {
              onAddtoCalendar && onAddtoCalendar();
              handleNext();
            }}
            eventTitle={eventTitle}
            eventTime={eventTime}
            eventDate={eventDate}
          />
        );
      case 2:
        return (
          <EventGroup
            onJoinPc={onJoinPc}
            whatsappQrLink={whatsappQrLink}
            onComplete={() => {
              onEventGroupComplete && onEventGroupComplete();
              handleNext();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="vd-flex-col vd-items-center vd-gap-16 vd-max-w-540">
      {currentStep <= 2 && <EventRegisteredHeader />}
      <StepIndicator
        step={`Step ${currentStep} / ${totalSteps}`}
        totalSteps={totalSteps}
      />
      {renderStepContent()}
    </View>
  );
};

export default SlideFlow;
