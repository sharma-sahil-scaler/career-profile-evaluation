import { useCallback, useState } from 'react';
import { createEventStore } from '../store/event';
import { useStore } from '@nanostores/react';

import { ThankyouPage } from '@vectord/thankyou-page';

const MasterclassNudge = ({ eventId }) => {
  const [$eventStore] = useState(createEventStore(eventId));

  const {
    data: eventData,
    loading: isEventLoading,
    error: eventError
  } = useStore($eventStore);

  const { attributes = {} } = eventData || {};
  const { startTime, title, slug, endTime, allSocialProfiles } = attributes;

  const handleAddToCalendar = useCallback(() => {
    console.log('addToCalendar');
  }, []);

  const handleEventGroupComplete = useCallback(() => {
    console.log('eventGroupComplete');
  }, []);

  const handleRedirection = useCallback(() => {
    console.log('redirection');
  }, []);

  const handleJoinPc = useCallback(() => {
    console.log('joinPc');
  }, []);

  const handleUnlockClick = useCallback(() => {
    console.log('unlockClick');
  }, []);

  const handleClose = useCallback(() => {
    console.log('close');
  }, []);

  if (isEventLoading) {
    return <div>Loading...</div>;
  }

  if (eventError) {
    return <div>Error...</div>;
  }

  return (
    <div className="scaler">
      <ThankyouPage
        visible
        flow="slideFlow"
        wrapperClassName=""
        containerClassName=""
        onClose={handleClose}
        eventTitle="Masterclass Nudge"
        eventDate="2025-11-17"
        onAddtoCalendar={handleAddToCalendar}
        onEventGroupComplete={handleEventGroupComplete}
        onRedirect={handleRedirection}
        onJoinPc={handleJoinPc}
        whatsappQrLink="https://www.google.com"
        onUnlockClick={handleUnlockClick}
      />
    </div>
  );
};

export default MasterclassNudge;
