import axios from 'axios';
import { env } from '../config/env';

const API = 'https://api.paystack.co';

export const paystack = {
  async initialize(email: string, amount: number, reference: string) {
    const { data } = await axios.post(
      `${API}/transaction/initialize`,
      { email, amount, reference },
      { headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` } }
    );
    return data;
  },

  async verify(reference: string) {
    const { data } = await axios.get(`${API}/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });
    return data;
  },
};