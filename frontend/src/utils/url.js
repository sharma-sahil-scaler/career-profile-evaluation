import { getCookie } from './cookie';
import { BYPASS_UTM, UTM_MEDIUM, UTM_SOURCE } from '../constants/analytics';

export function getURLWithUTMParams() {
  let pageUrl = window.location.href;
  const utmQuery = getCookie(BYPASS_UTM);
  if (
    !pageUrl.includes(UTM_MEDIUM)
    && !pageUrl.includes(UTM_SOURCE)
    && utmQuery
  ) {
    const nonUtmQuery = window.location.search;
    pageUrl += nonUtmQuery ? `&${utmQuery}` : `?${utmQuery}`;
  }
  return pageUrl;
}