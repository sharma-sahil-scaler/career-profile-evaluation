import { View } from '@vectord/ui';
import React from 'react';
import EventGroup from '../components/EventGroup';
import EventRegisteredHeader from '../components/EventRegistrationHandler';

const SlideFlow = ({
  onEventGroupComplete,
  onJoinPc,
  eventTitle,
  whatsappQrLink
}) => {
  return (
    <View className="vd-flex-col vd-border-[1px] vd-border-solid vd-border-border-neutral-subtle  vd-white border vd-bg-surface-neutral-base vd-items-center vd-gap-16 vd-max-w-540">
      <EventRegisteredHeader />
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
