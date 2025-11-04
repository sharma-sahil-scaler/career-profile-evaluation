import { nanoquery } from '@nanostores/query';
import { apiRequest, generateJWT } from '../utils/api';
import { addMeta } from '../utils/dom';

export const [createFetcherStore, , { mutateCache }] = nanoquery({
  fetcher: async () => {
    const { csrf_token: csrfToken } =
      (await apiRequest(
        'GET',
        '/csrf-token'
      )) || {};

    if (csrfToken) addMeta('csrf-token', csrfToken);

    const token = await generateJWT();
    if (!token) throw new Error('Failed to load JWT');

    const {
      data: { attributes }
    } = await apiRequest(
      'GET',
      '/api/v3/users',
      null,
      {
        headers: {
          'X-User-Token': token
        }
      }
    );

    const result = {
      isLoggedIn: true,
      isPhoneVerified: Boolean(attributes?.phone_verified),
      userData: attributes ?? null
    };
    return result;
  },

  onError: (error) => {
    console.error('Error fetching initial data:', error);
  },
  dedupeTime: Infinity,
  cacheLifetime: Infinity,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateInterval: 0,
  onErrorRetry: null
});

const defaultInitialData = {
  isLoggedIn: false,
  isPhoneVerified: false,
  userData: null
};

export const $initialData = createFetcherStore(['/auth']);
mutateCache('/auth', defaultInitialData);
