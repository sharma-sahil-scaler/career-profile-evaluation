export function fetchWhatsappData(allSocialProfiles) {
  return (
    allSocialProfiles?.filter((profile) => profile.platform === 'whatsapp') ||
    null
  );
}

function retrieveTwelveHourFormat(isoString) {
  const date = new Date(isoString);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const timeString = date.toLocaleTimeString('en-US', options);

  return timeString;
}

export function fetchEventTime(startTime, endTime) {
  return `${retrieveTwelveHourFormat(startTime)} - ${retrieveTwelveHourFormat(
    endTime
  )}`;
}
