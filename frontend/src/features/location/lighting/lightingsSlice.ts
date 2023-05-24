import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createLighting, deleteLighting, getLightingsList } from './lightingsThunks';
import { LightingList, GlobalError, ValidationError } from '../../../types';
import { RootState } from '../../../app/store';

interface LightingState {
  listLighting: LightingList[];
  getAllLightingsLoading: boolean;
  createLightingLoading: boolean;
  lightingError: null | ValidationError;
  deleteLightingLoading: boolean;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: LightingState = {
  listLighting: [],
  getAllLightingsLoading: false,
  createLightingLoading: false,
  lightingError: null,
  deleteLightingLoading: false,
  errorRemove: null,
  modal: false,
};

const lightingsSlice = createSlice({
  name: 'lightings',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLightingsList.pending, (state) => {
      state.getAllLightingsLoading = true;
    });
    builder.addCase(getLightingsList.fulfilled, (state, { payload: lighting }) => {
      state.getAllLightingsLoading = false;
      state.listLighting = lighting;
    });
    builder.addCase(getLightingsList.rejected, (state) => {
      state.getAllLightingsLoading = false;
    });

    builder.addCase(createLighting.pending, (state) => {
      state.createLightingLoading = true;
    });
    builder.addCase(createLighting.fulfilled, (state) => {
      state.createLightingLoading = false;
    });
    builder.addCase(createLighting.rejected, (state, { payload: error }) => {
      state.createLightingLoading = false;
      state.lightingError = error || null;
    });

    builder.addCase(deleteLighting.pending, (state) => {
      state.deleteLightingLoading = true;
    });
    builder.addCase(deleteLighting.fulfilled, (state) => {
      state.deleteLightingLoading = false;
    });
    builder.addCase(deleteLighting.rejected, (state, { payload: error }) => {
      state.deleteLightingLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});

export const lightingReducer = lightingsSlice.reducer;
export const { controlModal } = lightingsSlice.actions;
export const selectLightings = (state: RootState) => state.lighting.listLighting;
export const selectLightingsLoading = (state: RootState) => state.lighting.getAllLightingsLoading;
export const selectLightingCreateLoading = (state: RootState) => state.lighting.createLightingLoading;
export const selectLightingError = (state: RootState) => state.lighting.lightingError;
export const selectLightingDeleteLoading = (state: RootState) => state.lighting.deleteLightingLoading;
export const selectErrorRemove = (state: RootState) => state.lighting.errorRemove;
export const selectModal = (state: RootState) => state.lighting.modal;
