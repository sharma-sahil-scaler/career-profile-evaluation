import React from 'react';

import { Icon, Text, View } from '@vectord/ui';

const TITLE = 'Event Registered';
const SUBTITLE = 'Unlock Your Full Career Potential!';
const SUBTITLE_DESCRIPTION =
  'Complete these essential steps to unlock your full learning experience.';

const EventRegisteredHeader = () => {
  return (
    <div className="vd-flex vd-flex-col vd-gap-4 vd-items-center vd-my-24">
      <Icon
        type="fill"
        name="circle-wavy-check"
        iconSize="xl"
        color="icon-alert-success-soft"
      />
      <Text fontSize="h2" color={'text-alert-success-soft'} weight="bold">
        {TITLE}
      </Text>
      <View className="vd-flex-col vd-gap-4 vd-items-center vd-max-w-288">
        <Text weight="light" fontSize="b3" className="vd-text-center">
          {SUBTITLE}
        </Text>
        <Text weight="light" fontSize="b3" className="vd-text-center">
          {SUBTITLE_DESCRIPTION}
        </Text>
      </View>
    </div>
  );
};

export default EventRegisteredHeader;
