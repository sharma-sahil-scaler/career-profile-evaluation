import React, { useCallback, useEffect, useState } from 'react';
import Modal from '@vectord/modal';
import SlideFlow from './views/SlideFlow';
import { cx } from '@vectord/ui';

export const ThankyouPage = ({
  wrapperClassName = '',
  visible = false,
  onClose,
  onAddtoCalendar,
  onEventGroupComplete,
  eventTitle,
  eventDate,
  eventTime,
  onRedirect,
  onJoinPc,
  whatsappQrLink
}) => {
  const [showExitIntent, setShowExitIntent] = useState(visible);

  const onCloseHandler = () => {
    setShowExitIntent(false);
    onClose?.();
  };

  useEffect(() => {
    if (showExitIntent) {
      const scrollY = window.scrollY;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        window.scrollTo(0, scrollY);
      };
    }
  }, [showExitIntent]);

  return (
    <Modal
      isOpen={showExitIntent}
      onClose={onCloseHandler}
      className={cx(
        'vd-bg-surface-neutral-base/[0.9] vd-pt-64 vd-opacity-100 vd-items-center sm:vd-p-0 vd-p-8',
        wrapperClassName
      )}
    >
      <SlideFlow
        {...{
          onAddtoCalendar,
          onEventGroupComplete,
          eventTitle,
          eventDate,
          eventTime,
          onRedirect,
          onJoinPc,
          whatsappQrLink
        }}
      />
    </Modal>
  );
};
