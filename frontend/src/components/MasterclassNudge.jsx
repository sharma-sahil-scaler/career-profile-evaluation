import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEventStore } from '../store/event';
import { useStore } from '@nanostores/react';

import { ThankyouPage } from './ThankyouPage';
import { fetchEventTime, fetchWhatsappData } from '../utils/mcNudge';
import { markNudgeAsShown } from '../utils/url';
import StatusScreen from '../app/components/StatusScreen';
import tracker from '../utils/tracker';
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
  const navigate = useNavigate();

  const {
    all_social_profiles: allSocialProfiles,
    id,
    title,
    start_time: startTime,
    end_time: endTime,
    qrLink
  } = eventData || {};

  const eventTime = fetchEventTime(startTime, endTime);
  const whatsappLink = fetchWhatsappData(allSocialProfiles)?.[0]?.link;

  const handleEventGroupComplete = useCallback(() => {
    tracker.click({
      click_type: 'mc_nudge_open_whatapp_calendar'
    });
    window.open(whatsappLink, '_blank');
    markNudgeAsShown(id);
    setTimeout(() => {
      navigate(0);
    }, 2000);
  }, [whatsappLink, id]);

  const handleJoinPc = useCallback(() => {
    tracker.click({
      click_type: 'mc_nudge_join_via_pc'
    });
    window.open(whatsappLink, '_blank');
  }, [whatsappLink]);

  const handleOnClose = useCallback(() => {
    tracker.click({
      click_type: 'mc_nudge_close_btn_click'
    });
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
    <div className="scaler gtm-section-view" data-gtm-section-name="MC Nudge">
      <ThankyouPage
        visible
        flow="slideFlow"
        eventTitle={title}
        eventDate={startTime}
        onClose={handleOnClose}
        eventTime={eventTime}
        onEventGroupComplete={handleEventGroupComplete}
        onJoinPc={handleJoinPc}
        whatsappQrLink={qrLink || ''}
      />
    </div>
  );
};

export default MasterclassNudge;

