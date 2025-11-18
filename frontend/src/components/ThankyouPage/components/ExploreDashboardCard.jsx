import React, { useEffect, useState } from 'react';
import { Text, Button, View } from '@vectord/ui';

const ExploreDashboardCard = ({ onRedirect }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRedirect]);

  return (
    <View className="vd-flex vd-flex-col vd-gap-4 vd-border vd-border-border-neutral-subtle vd-w-full vd-p-16 vd-items-center">
      <img
        src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/098/875/original/explore-dashboard.webp?1733389064"
        alt="Explore Dashboard"
        className="vd-w-full"
      />
      <View className="vd-flex-col vd-gap-8 vd-items-center vd-justify-center vd-my-32">
        <Text className="vd-text-center">
          You have unlocked access to free learning dashboard
        </Text>
        <img
          src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/098/877/original/expore-dash-feat.webp?1733389115"
          alt="Explore Dashboard"
          className="vd-w-full"
        />
      </View>
      <Button
        title={`Explore Dashboard (${countdown}s)`}
        variants="brand"
        upperCase={false}
        buttonType="solid"
        iconRight={'arrow-right'}
        size="l"
        onClick={onRedirect}
      />
      <Text
        className="vd-text-center"
        color="text-neutral-secondary"
        fontStyle="italic"
        fontSize="caption"
      >
        Get unfair advantage for FREE{' '}
      </Text>
    </View>
  );
};

export default ExploreDashboardCard;
