import { nanoquery } from '@nanostores/query';
import { apiRequest } from '../utils/api';
import { generateJWT } from '../utils/api';

export const [createEventFetcherStore] = nanoquery({
  fetcher: async (...keys) => {
    const path = keys[0];
    const response = await apiRequest('GET', path, {
      distributor: 'scaler',
      serializer_mode: 'L2'
    });

    const { attributes = {} } = response.data || {};
    const { slug } = attributes;

    const token = await generateJWT();
    if (!token) throw new Error('Failed to load JWT');

    const qrLinkResponse = await apiRequest(
      'POST',
      `/api/v4/events/${slug}/trackable-social-link`,
      {
        provider: 'whatsapp',
        track_for: 'redirect_link',
        tracking_attributes: {
          product: 'free_product',
          sub_product: 'mentee-dashboard',
          element: 'QR Code Scan Onboarding FLC'
        }
      },
      {
        headers: {
          'X-User-Token': token
        }
      }
    );

    console.log('qrLinkResponse', qrLinkResponse);
    console.log('qrLink', qrLinkResponse.data);

    return {
      ...attributes,
      qrLink: qrLinkResponse?.data?.link
    };
  },
  onError: (error) => {
    console.error('Event fetcher error:', error);
  },
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateInterval: 0,
  onErrorRetry: null
});

export const createEventStore = (id) =>
  createEventFetcherStore(`/api/v4/events/${id}`);
