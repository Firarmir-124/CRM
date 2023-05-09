import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  Grid,
  IconButton,
  Pagination,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ModalBody from '../../components/ModalBody';
import CardLocation from './components/CardLocation';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  resetFilter,
  selectLocationsColumnSettings,
  selectLocationsDeleteLoading,
  selectLocationsFilter,
  selectLocationsListData,
  selectLocationsListLoading,
  setCurrentPage,
} from './locationsSlice';
import { getLocationsList, removeLocation } from './locationsThunks';
import { MainColorGreen, StyledTableCell } from '../../constants';
import LocationDrawer from './components/LocationDrawer';
import SettingsIcon from '@mui/icons-material/Settings';
import { openSnackbar } from '../users/usersSlice';
import SnackbarCard from '../../components/SnackbarCard/SnackbarCard';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';
import TuneIcon from '@mui/icons-material/Tune';
import LocationFilter from './components/LocationsFilter';

const LocationList = () => {
  const dispatch = useAppDispatch();
  const locationsListData = useAppSelector(selectLocationsListData);
  const locationsListLoading = useAppSelector(selectLocationsListLoading);
  const columns = useAppSelector(selectLocationsColumnSettings);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const deleteLoading = useAppSelector(selectLocationsDeleteLoading);
  const filter = useAppSelector(selectLocationsFilter);
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(
      getLocationsList({
        page: locationsListData.page,
        perPage: locationsListData.perPage,
        filtered: filter.filtered,
      }),
    );
  }, [dispatch, filter.filtered, locationsListData.page, locationsListData.perPage]);

  const DeleteLocations = async (_id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную локацию?')) {
      await dispatch(removeLocation(_id)).unwrap();
      await dispatch(getLocationsList());
      dispatch(openSnackbar({ status: true, parameter: 'remove_locations' }));
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  return (
    <Box sx={{ py: 2 }}>
      <Grid container alignItems="center" mb={2}>
        <Grid item>
          <Chip
            sx={{ fontSize: '20px', p: 3, color: MainColorGreen }}
            label={(locationsListData.filtered ? `Подходящие локации: ` : `Список локаций: `) + locationsListData.count}
            variant="outlined"
            color="success"
          />
        </Grid>
        <Grid item>
          <IconButton onClick={() => setIsDrawerOpen(true)} sx={{ ml: 1 }}>
            <SettingsIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setIsFilterOpen(true)} sx={{ ml: 1 }}>
            <TuneIcon />
          </IconButton>
        </Grid>
        {locationsListData.filtered && (
          <Grid item>
            <Button onClick={() => dispatch(resetFilter())}>Сбросить фильтр</Button>
          </Grid>
        )}
      </Grid>
      <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell align="right" sx={{ bgcolor: MainColorGreen }}>
                  №
                </StyledTableCell>
                {columns
                  .filter((col) => col.show)
                  .map((col) => (
                    <StyledTableCell align="center" key={col.id}>
                      {col.prettyName}
                    </StyledTableCell>
                  ))}
                <StyledTableCell align="right">Управление</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& tr': {
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                },
                '& tr:hover:nth-of-type(even)': {
                  bgcolor: '#f1f1f1',
                  transition: 'background-color 0.2s',
                },
                '& tr:hover:nth-of-type(odd)': {
                  bgcolor: '#cfe5f5',
                  transition: 'background-color 0.2s',
                },
              }}
            >
              {locationsListData.locations.map((loc, i) => (
                <CardLocation
                  onDelete={() => DeleteLocations(loc._id)}
                  deleteLoading={deleteLoading}
                  key={loc._id}
                  loc={loc}
                  number={(locationsListData.page - 1) * locationsListData.perPage + i + 1}
                  onClose={() => setIsOpen(true)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Pagination
        size="small"
        sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
        disabled={locationsListLoading}
        count={locationsListData.pages}
        page={locationsListData.page}
        onChange={(event, page) => dispatch(setCurrentPage(page))}
      />
      <ModalBody isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Редактировать
      </ModalBody>
      <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)} fullWidth maxWidth="md">
        <LocationFilter onClose={() => setIsFilterOpen(false)} />
      </Dialog>
      <LocationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <SnackbarCard />
    </Box>
  );
};

export default LocationList;
