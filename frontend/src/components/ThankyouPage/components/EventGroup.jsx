import { Text, Icon, Button, View } from '@vectord/ui';
import QRCode from 'react-qr-code';
import React, { useCallback, useEffect, useRef } from 'react';

const HEADER = 'Event Group';

const EventGroup = ({ onComplete, onJoinPc, whatsappQrLink, eventTitle }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const timeoutId = setTimeout(() => {
        audioRef.current?.play();
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleComplete = useCallback(() => {
    onComplete && onComplete();
  }, [onComplete]);

  return (
    <View className="vd-flex vd-flex-col vd-gap-4 vd-w-full">
      <View className="vd-flex vd-flex-row vd-gap-8 vd-items-center vd-bg-background-neutral-disabled  vd-p-8">
        <Icon name={'link'} />
        <View className="vd-flex vd-flex-col">
          <Text fontSize="b1" weight="semibold">
            JOIN EVENT WHATSAPP GROUP
          </Text>
          <Text fontSize="b3">{eventTitle}</Text>
        </View>
      </View>
      <View className="vd-flex-col vd-gap-16 vd-py-24 vd-px-16">
        <View className="vd-flex-row vd-gap-4  sm:vd-flex vd-hidden">
          <View className="vd-flex-col vd-gap-4 vd-items-center vd-justify-center vd-p-16 vd-bg-background-neutral-disabled">
            <QRCode
              value={whatsappQrLink}
              size={120}
              className="vd-min-w-120 vd-min--h-120"
            />
            <div onClick={onJoinPc}>
              <Text
                color={'text-brand-soft'}
                weight="semibold"
                className="vd-underline vd-mt-4 vd-cursor-pointer"
              >
                Join Via PC
              </Text>
            </div>
          </View>
          <View>
            <img
              src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/099/595/original/join-community.webp?1733821069"
              alt="Event Group"
              className="vd-w-full"
            />
          </View>
        </View>
        <img
          src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/098/881/original/community-fp.webp?1733389729"
          alt="Event Group"
          className="vd-w-full vd-block sm:vd-hidden"
        />
      </View>
      <Button
        className="vd-mx-16"
        size="l"
        title="Join WhatsApp Group"
        variants="neutral"
        upperCase={false}
        buttonType="solid"
        iconLeft={'whatsapp-logo'}
        onClick={handleComplete}
      />
      <Text
        className="vd-text-center vd-my-8"
        color="text-neutral-secondary"
        fontStyle="italic"
        fontSize="caption"
      >
        Grab resources worth ₹2,000, Join Now!
      </Text>
      <audio
        ref={audioRef}
        src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/106/010/original/31adc365a36af90fe81d725697ad23fd9f05a86b.mp4?1738327183"
        preload="auto"
      />
    </View>
  );
};

export default EventGroup;
