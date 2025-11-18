import { useCallback, useState } from 'react';
import { createEventStore } from '../store/event';
import { useStore } from '@nanostores/react';

import { ThankyouPage } from './ThankyouPage';
import { $initialData } from '../store/initial-data';
import { addToCalendar } from '../utils/calendar';
import { fetchEventTime, fetchWhatsappData } from '../utils/mcNudge';

const MasterclassNudge = ({ eventId }) => {
  const [$eventStore] = useState(createEventStore(eventId));

  const {
    data: eventData,
    loading: isEventLoading,
    error: eventError
  } = useStore($eventStore);
  const { data } = useStore($initialData);
  const { userData: { timezone } = {} } = data?.userData ?? {};

  console.log('eventData', eventData);

  const {
    all_social_profiles: allSocialProfiles,
    slug,
    title,
    start_time: startTime,
    end_time: endTime,
    qrLink
  } = eventData || {};
  const eventTime = fetchEventTime(startTime, endTime);
  const whatsappLink = fetchWhatsappData(allSocialProfiles)?.[0]?.link;
  const handleAddToCalendar = useCallback(() => {
    addToCalendar(slug, title, timezone, startTime, endTime);
  }, [slug, title, timezone, startTime, endTime]);

  const handleEventGroupComplete = useCallback(() => {
    window.open(whatsappLink, '_blank');
  }, [whatsappLink]);

  const handleRedirection = useCallback(() => {
    window.location.href = '/academy/mentee-dashboard/todos';
  }, []);

  const handleJoinPc = useCallback(() => {
    window.open(whatsappLink, '_blank');
  }, [whatsappLink]);

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
        onClose={handleClose}
        wrapperClassName=""
        containerClassName=""
        eventTitle={title}
        eventDate={startTime}
        eventTime={eventTime}
        onAddtoCalendar={handleAddToCalendar}
        onEventGroupComplete={handleEventGroupComplete}
        onRedirect={handleRedirection}
        onJoinPc={handleJoinPc}
        whatsappQrLink={qrLink || ''}
        onUnlockClick={handleUnlockClick}
      />
    </div>
  );
};

export default MasterclassNudge;
