import React from 'react';
import { View, Icon, Text } from '@vectord/ui';

const StepIndicator = ({ step, isCompleted }) => {
  return (
    <View
      className={`vd-flex vd-flex-row vd-self-center vd-items-center vd-gap-2 vd-border vd-rounded-r-16 vd-py-2
         vd-px-8 vd-bg-background-neutral-subtlest ${
           !isCompleted
             ? 'vd-border-border-neutral-bold'
             : 'vd-border-border-neutral-subtle'
         }`}
    >
      {isCompleted ? (
        <Icon name={'check-circle'} iconSize="xs" color="icon-neutral-disabled" />
      ) : null}
      <Text
        fontSize="caption"
        color={!isCompleted ? 'text-neutral-primary' : 'text-neutral-tertiary'}
        weight="semibold"
      >
        {`${step}`}
      </Text>
    </View>
  );
};

export default StepIndicator;
