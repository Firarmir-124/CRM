import { createAsyncThunk } from '@reduxjs/toolkit';
import { StreetList, StreetMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';

export const fetchStreet = createAsyncThunk<StreetList[]>('street/fetch_streets', async () => {
  const response = await axiosApi.get<StreetList[]>('/streets');
  return response.data;
});

export const createStreet = createAsyncThunk<void, StreetMutation, { rejectValue: ValidationError }>(
  'street/create_street',
  async (streetMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/streets', streetMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeStreet = createAsyncThunk<void, string>('street/remove_street', async (id) => {
  await axiosApi.delete('/streets/' + id);
});
