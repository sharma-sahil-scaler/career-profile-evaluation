import React, { useState } from 'react';
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
  if (!visible) return null;

  const onCloseHandler = () => {
    setShowExitIntent(false);
    onClose && onClose();
  };

  return (
    <Modal
      isOpen={showExitIntent}
      onClose={onCloseHandler}
      closeBtnClassName={'!vd-hidden'}
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
