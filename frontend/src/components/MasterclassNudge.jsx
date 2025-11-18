import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEventStore } from '../store/event';
import { useStore } from '@nanostores/react';

import { ThankyouPage } from './ThankyouPage';
import { $initialData } from '../store/initial-data';
import { addToCalendar } from '../utils/calendar';
import { fetchEventTime, fetchWhatsappData } from '../utils/mcNudge';
import { markNudgeAsShown } from '../utils/url';
import StatusScreen from '../app/components/StatusScreen';
import { WarningCircle } from 'phosphor-react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 4px solid #e2e8f0;
  border-top-color: #c71f69;
  animation: ${spin} 0.9s linear infinite;
`;

const MasterclassNudge = ({ eventId }) => {
  const [$eventStore] = useState(createEventStore(eventId));

  const { data: eventData, loading: isEventLoading } = useStore($eventStore);
  const { data } = useStore($initialData);
  const { userData: { timezone } = {} } = data?.userData ?? {};
  const navigate = useNavigate();

  const {
    all_social_profiles: allSocialProfiles,
    slug,
    id,
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

    markNudgeAsShown(id);

    setTimeout(() => {
      navigate(0);
    }, 2000);
  }, [whatsappLink, id]);

  const handleRedirection = useCallback(() => {
    window.location.href = '/academy/mentee-dashboard/todos';
  }, []);

  const handleJoinPc = useCallback(() => {
    window.open(whatsappLink, '_blank');
  }, [whatsappLink]);

  const handleUnlockClick = useCallback(() => {
    console.log('unlockClick');
  }, []);

  if (isEventLoading) {
    return (
      <StatusScreen
        icon={<Spinner size={42} weight="duotone" color="#c71f69" />}
        title={title}
        description="Loading Event Details......."
      />
    );
  }

  return (
    <div className="scaler">
      <ThankyouPage
        visible
        flow="slideFlow"
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
