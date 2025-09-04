// utils/momoAuth.ts
import axios from 'axios';
import qs from 'qs';

export const getMoMoToken = async () => {
  const user = 'YOUR_USER_ID';
  const apiKey = 'YOUR_API_KEY';

  const basicAuth = Buffer.from(`${user}:${apiKey}`).toString('base64');

  const response = await axios.post(
    'https://sandbox.momodeveloper.mtn.com/collection/token/',
    null,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Ocp-Apim-Subscription-Key': '95752155dcfa4ecfabff17ede089ebe3',
      },
    }
  );

  return response.data.access_token;
};
