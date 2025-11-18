import { Button, Icon, Text, View } from '@vectord/ui';
import React from 'react';

const HEADER = 'Free Learning Dashboard';

export const FreelearningDashboard = ({ onUnlockClick }) => {
  return (
    <View className="vd-flex vd-flex-col vd-gap-4 vd-border-[1px] vd-border-solid vd-border-border-neutral-subtle vd-w-full">
      <View className="vd-flex vd-flex-row vd-gap-4 vd-items-center vd-bg-background-neutral-disabledd  vd-p-8">
        <Icon name={'link'} />
        <Text fontSize="b1" weight="semibold">
          {HEADER}
        </Text>
      </View>
      <View className="vd-flex-col vd-gap-16 vd-py-24 vd-px-16 vd-h-432 vd-items-center vd-justify-center">
        <View className="vd-flex-col vd-gap-8 vd-items-center vd-justify-center vd-relative vd-w-full vd-h-full">
          <img
            src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/100/416/original/blurred.png?1734352607"
            className="vd-absolute vd-w-full vd-h-full"
            alt="Blurred background"
          />
          <View className="vd-absolute vd-flex-col vd-gap-y-8">
            <Text
              fontSize="b1"
              color="text-neutral-secondary"
              className="vd-text-center"
            >
              Complete step 1 and 2 to unlock
            </Text>
            <Button
              className="vd-mx-16"
              size="s"
              title="Unlock"
              variants="neutral"
              upperCase={false}
              buttonType="solid"
              iconLeft={'lock'}
              onClick={onUnlockClick}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
