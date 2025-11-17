function getTimeInCertainFormat(time) {
  const year = time?.getFullYear();
  const month = String(time?.getMonth() + 1).padStart(2, '0');
  const day = String(time?.getDate()).padStart(2, '0');
  const hours = String(time?.getHours()).padStart(2, '0');
  const minutes = String(time?.getMinutes()).padStart(2, '0');
  const seconds = String(time?.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}


function convertToUserTimeZone(time, userTimeZone) {
  const updatedTimeZone = time?.toLocaleString('default', {
    timeZone: userTimeZone
  });

  const formattedTime = new Date(updatedTimeZone);
  return getTimeInCertainFormat(formattedTime);
}

export function addToCalendar(slug, title, userTimeZone, startTime, endTime) {
  const calendarStartTime = convertToUserTimeZone(startTime, userTimeZone);
  const calendarEndTime = convertToUserTimeZone(endTime, userTimeZone);
  const redirectUrl =
    `https://www.scaler.com/event/${slug}` +
    '?utm_source=google_calendar_event_page%26utm_medium=google_calendar';

  const calendarUrl =
    'https://calendar.google.com/calendar/u/0/r/eventedit?' +
    `location=${redirectUrl}&` +
    `text=${title}&` +
    `details=Event+Link:+${redirectUrl}&` +
    `dates=${calendarStartTime}/${calendarEndTime}&` +
    `ctz=${userTimeZone}`;

  window.open(calendarUrl, '_blank');
}
