import { nanoquery } from '@nanostores/query';
import { apiRequest } from '../utils/api';

export const [createEventFetcherStore] = nanoquery({
  fetcher: async (...keys) => {
    const path = keys[0];
    const response = await apiRequest('GET', path, {
      distributor: 'scaler',
      serializer_mode: 'L2'
    });

    return response;
  },
  onError: (error) => {
    console.error('Event fetcher error:', error);
  }
});

export const [createQrLinkFetcherStore] = nanoquery({
  fetcher: async (...keys) => {
    const [, slug] = keys;
    const response = await apiRequest(
      'POST',
      `/api/v4/events/${slug}/trackable-social-link`,
      {
        provider: 'whatsapp',
        track_for: 'redirect_link',
        tracking_attributes: {
          product: 'free_product',
          sub_product: 'mentee-dashboard',
          element: 'mc-nudge-qr'
        }
      }
    );

    return response;
  },
  onError: (error) => {
    console.warn('QR link fetcher error (non-critical):', error);
  }
});

export const createEventStore = (id) =>
  createEventFetcherStore(`/api/v4/events/${id}`);
export const createQrLinkStore = (slug) =>
  createQrLinkFetcherStore(['qr-link', slug]);
