import { View } from '@vectord/ui';
import React from 'react';
import EventGroup from '../components/EventGroup';

const SlideFlow = ({
  onEventGroupComplete,
  onJoinPc,
  eventTitle,
  whatsappQrLink
}) => {
  return (
    <View className="vd-flex-col vd-white vd-bg-surface-neutral-base vd-items-center vd-gap-16 vd-max-w-540">
      <EventGroup
        onComplete={() => {
          onEventGroupComplete && onEventGroupComplete();
        }}
        {...{ eventTitle, onJoinPc, whatsappQrLink }}
      />
    </View>
  );
};

export default SlideFlow;
