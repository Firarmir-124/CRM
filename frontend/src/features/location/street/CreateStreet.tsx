import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
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
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import { MainColorGreen, StyledTableCell } from '../../../constants';
import {
  controlModal,
  selectErrorRemove,
  selectGetAllStreetsLoading,
  selectModal,
  selectStreetList,
} from './streetSlice';
import { Navigate } from 'react-router-dom';
import { createStreet, fetchStreet, removeStreet } from './streetThunks';
import FormCreateStreet from './components/FormCreateStreet';
import CardStreet from './components/CardStreet';
import { StreetMutation } from '../../../types';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';

const CreateStreet = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListStreets = useAppSelector(selectStreetList);
  const fetchLoading = useAppSelector(selectGetAllStreetsLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const { confirm } = useConfirm();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    dispatch(fetchStreet());
  }, [dispatch]);

  const onSubmit = async (street: StreetMutation) => {
    await dispatch(createStreet(street)).unwrap();
    await dispatch(fetchStreet()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_street' }));
  };

  const removeCardStreet = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную улицу?')) {
      await dispatch(removeStreet(id)).unwrap();
      await dispatch(fetchStreet()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_street' }));
    } else {
      return;
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Box>
        <Container component="main" maxWidth="xs">
          <FormCreateStreet onSubmit={onSubmit} />
        </Container>
        <Container>
          {open && (
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      dispatch(controlModal(false));
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
                severity="error"
              >
                {errorRemove?.error}
              </Alert>
            </Collapse>
          )}
          <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Улица</StyledTableCell>
                    <StyledTableCell align="right">Управление</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!fetchLoading ? (
                    fetchListStreets.length !== 0 ? (
                      fetchListStreets.map((street) => (
                        <CardStreet
                          removeCardStreet={() => removeCardStreet(street._id)}
                          key={street._id}
                          street={street}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>
                          <Alert severity="info">В данный момент улиц нет</Alert>
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    <TableRow>
                      <TableCell>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
      <SnackbarCard />
    </>
  );
};

export default CreateStreet;
