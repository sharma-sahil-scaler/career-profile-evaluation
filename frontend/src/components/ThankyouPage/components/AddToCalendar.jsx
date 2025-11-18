import { Text, Icon, Button, View } from '@vectord/ui';
import React, { useCallback, useState } from 'react';

const HEADER = 'Event Joining Link';

const AddToCalendar = ({ onAdd, eventTitle, eventDate, eventTime }) => {
  const [showDelayComp, setShowDelayComp] = useState(false);
  const [redirectionCount, setRedirectionCount] = useState(6);

  const triggerRedirectionCount = useCallback(() => {
    setRedirectionCount((prev) => {
      if (prev === 0) {
        onAdd();
        return prev;
      }

      setTimeout(triggerRedirectionCount, 1000);
      return prev - 1;
    });
  }, [onAdd]);

  const handleAddToCalendar = useCallback(() => {
    setShowDelayComp(true);
    triggerRedirectionCount();
  }, [triggerRedirectionCount]);

  if (showDelayComp) {
    return (
      <View className="vd-flex-col vd-shadow-r-32l">
        <View className="vd-flex-col vd-gap-y-24 sm:vd-h-[318px] vd-p-[24px] sm:vd-py-[46px] sm:vd-px-[66px] vd-justify-between vd-items-center">
          <Text
            weight="semibold"
            color="text-neutral-secondary"
            fontSize="b2"
            className="vd-text-center"
          >
            <Text color="text-neutral-secondary" fontSize="b2">
              Come back to this tab
            </Text>{' '}
            once you've added the session to your calendar.
          </Text>
          <img
            src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/105/866/original/image_2321.png?1738244513"
            alt="calendar-delay"
          />
        </View>
        <View className="vd-px-[16px] vd-pb-[16px] vd-justify-center vd-w-full">
          <Text
            className="vd-text-center"
            color="text-neutral-secondary"
            fontSize="caption"
            fontStyle="italic"
          >
            Redirecting in {redirectionCount} ➡️
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View className="vd-flex vd-flex-col vd-gap-4 vd-border-[1px] vd-border-solid vd-border-border-neutral-subtle">
        <View className="vd-flex vd-flex-row vd-gap-4 vd-items-center vd-bg-background-neutral-disabled  vd-p-8">
          <Icon name={'link'} />
          <Text fontSize="b1" weight="semibold">
            {HEADER}
          </Text>
        </View>
        <View className="vd-flex-col vd-gap-16 vd-py-24 vd-px-16">
          <View className="vd-shadow-sm vd-self-center vd-shadow-4h vd-rounded-r-4">
            <View className="vd-py-8 vd-px-20 vd-bg-surface-neutral-disabled vd-items-center">
              <View className="vd-flex vd-flex-col vd-gap-2 vd-w-48 vd-max-h-72 vd-justify-between vd-bg-surface-neutral-sunken">
                <View className="vd-bg-background-brand-bold vd-p-2 vd-justify-center">
                  <Text color="text-neutral-inverse-primary" fontSize="b1">
                    {new Date(eventDate).toLocaleString('default', {
                      month: 'short'
                    })}
                  </Text>
                </View>
                <Text
                  color="text-neutral-primary"
                  className="vd-text-center"
                  weight="bold"
                >
                  {new Date(eventDate).getDate()}
                </Text>
                <Text
                  color="text-neutral-secondary"
                  fontSize="caption"
                  className="vd-text-center"
                >
                  {new Date(eventDate).toLocaleString('default', {
                    weekday: 'short'
                  })}
                </Text>
              </View>
            </View>
            <View className="vd-flex-col vd-gap-8 vd-bg-surface-neutral-sunken vd-p-16">
              <Text>{eventTitle}</Text>
              <Text>{eventTime}</Text>
            </View>
          </View>
        </View>
        <Button
          className="vd-mx-16"
          size="l"
          title="Add  to Calendar"
          variants="neutral"
          upperCase={false}
          buttonType="solid"
          iconLeft={'google-logo'}
          onClick={handleAddToCalendar}
        />
        <Text
          className="vd-text-center vd-my-8"
          color="text-neutral-secondary"
          fontStyle="italic"
          fontSize="caption"
        >
          Increase attendance probability by 70% 📈
        </Text>
      </View>
    );
  }
};

export default AddToCalendar;
