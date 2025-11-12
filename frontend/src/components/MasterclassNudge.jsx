import { useState } from 'react';
import { createEventStore } from '../store/event';
import { useStore } from '@nanostores/react';

const MasterclassNudge = ({ eventId }) => {
  const [$eventStore] = useState(createEventStore(eventId));

  const {
    data: eventData,
    loading: isEventLoading,
    error: eventError
  } = useStore($eventStore);

  if (isEventLoading) {
    return <div>Loading...</div>;
  }

  if (eventError) {
    return <div>Error...</div>;
  }

  return <div>MasterclassNudge</div>;
};

export default MasterclassNudge;
