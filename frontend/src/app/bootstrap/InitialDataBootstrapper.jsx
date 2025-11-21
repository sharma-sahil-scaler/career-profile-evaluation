import { useEffect } from 'react';
import { useStore } from '@nanostores/react';

import { $initialData } from '../../store/initial-data';
import {
  getUTMPropagationParams,
  initializeUtmPropagation
} from '../../utils/analytics';
import lazyLoadGtm, { pushServerEvents } from '../../utils/gtm';
import tracker from '../../utils/tracker';
import { getURLWithUTMParams } from '../../utils/url';
import attribution from '../../utils/attribution';

const InitialDataBootstrapper = ({
  product,
  subProduct
}) => {
  const { data, error } = useStore($initialData);
  const { isLoggedIn } = data ?? {};

  useEffect(() => {
    initializeUtmPropagation();
    lazyLoadGtm();
    pushServerEvents();
  }, []);

  useEffect(() => {
    const pageUrl = getURLWithUTMParams();
    const url = new URL(window.location.href);

    tracker.pushToPendingList = true;
    tracker.superAttributes = {
      attributes: {
        product,
        subproduct: subProduct,
        page_path: url.pathname,
        page_url: url.href,
        query_params: Object.fromEntries(url.searchParams.entries()),
        utm_propagation_params: getUTMPropagationParams()
      }
    };

    attribution.setPlatform();
    attribution.setProduct(product);
    tracker.pageview({
      page_url: pageUrl
    });
  }, [product, subProduct]);

  useEffect(() => {
    if (isLoggedIn || error) {
      tracker.isLoggedIn = !!isLoggedIn;
      tracker.pushToPendingList = false;
    }
  }, [isLoggedIn, error]);

  return null;
};

export default InitialDataBootstrapper;
