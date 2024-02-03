import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Button, Modal } from '@/shared/ui';
import { authStore, moviesApi } from '@/store';
import type {
  ScheduleSeance,
  Hall,
  Place,
  Seat,
  BuyTicketPayload,
  Movie,
  BuyTicketPerson,
  DebitCard,
  BuyTicketResponse,
} from '@/store';
import { ROUTER_PATHS } from '@/shared/constants';
import { envConfig } from '@/config';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PatternFormat } from 'react-number-format';
import { useSnackbar } from 'notistack';
import { buyTicketCardSchema, buyTicketPersonSchema } from '@/shared/schemas/buy-ticket';
import type { BuyTicketCardSchema, BuyTicketPersonSchema } from '@/shared/schemas/buy-ticket';
import { ERROR_MESSAGE_API, serializeData } from '@/shared/schemas';

// TODO: refactor: extract film info, schedule and seat pick; description 3 rows, expand action

type NormalizedHall = {
  hallName: Hall['name'];
  seances: (Pick<ScheduleSeance, 'time' | 'payedTickets'> & Pick<Hall, 'places'>)[];
};

type PickedSeat = {
  seats: { [key: Seat['row']]: (Pick<Seat, 'column'> & Pick<Place, 'price'>)[] };
  hallName: Hall['name'];
  movie: Pick<Movie, 'id' | 'name'>;
} & Pick<BuyTicketPayload, 'seance'>;

const BUY_TICKET_STEPS = {
  person: 0,
  card: 1,
  paymentSuccess: 2,
};

export function MoviePage() {
  // TODO: typing issue without type cast
  const { movieId } = useParams() as { movieId: string };
  const movieQuery = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => moviesApi.getOne(movieId),
  });
  const movieScheduleQuery = useQuery({
    queryKey: ['schedule', movieId],
    queryFn: () => moviesApi.getSchedule(movieId),
  });

  const [dateTabIndex, setDateTabIndex] = useState<number | null>(0);
  const [seatIndex, setSeatIndex] = useState<{ hallIndex: number; seanceIndex: number } | null>(
    null,
  );
  const [selectedSeats, setSelectedSeats] = useState<PickedSeat | null>(null);
  useEffect(() => {
    setSeatIndex(null);
    setSelectedSeats(null);
  }, [dateTabIndex]);
  useEffect(() => {
    setSelectedSeats(null);
  }, [seatIndex]);

  // TODO: refactor: extract ModalBase, multi step abstraction
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const onModalClose = () => {
    closeModal();
    setStep(BUY_TICKET_STEPS.person);
  };

  const [step, setStep] = useState<number>(BUY_TICKET_STEPS.person);
  const nextStep = () =>
    setStep((prev) => {
      const nextStep = (prev += 1);
      if (nextStep === BUY_TICKET_STEPS.paymentSuccess) {
        return prev;
      }

      return nextStep;
    });
  const prevStep = () =>
    setStep((prev) => {
      const nextStep = (prev -= 1);
      if (nextStep === BUY_TICKET_STEPS.person || nextStep === BUY_TICKET_STEPS.paymentSuccess) {
        return prev;
      }

      return nextStep;
    });
  const canMoveToPrevStep =
    step !== BUY_TICKET_STEPS.person && step !== BUY_TICKET_STEPS.paymentSuccess;

  const [person, setPerson] = useState<BuyTicketPerson | null>(null);
  const [debitCard, setDebitCard] = useState<DebitCard | null>(null);
  const [payResponse, setPayResponse] = useState<BuyTicketResponse | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const buyTicketMutation = useMutation({
    mutationFn: moviesApi.buyTicket,
    onSuccess: ({ data }) => {
      setPayResponse(data);
      nextStep();
    },
    // TODO: error typing support
    onError: (error: Error) => {
      // @ts-expect-error type issue
      const message = error.response.data.reason || ERROR_MESSAGE_API;
      enqueueSnackbar({ variant: 'error', message });
    },
  });

  const user = authStore((state) => state.user);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BuyTicketPersonSchema>({
    resolver: zodResolver(buyTicketPersonSchema),
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      middlename: user?.middlename || '',
      phone: user?.phone || '',
    },
  });
  const {
    handleSubmit: buyTicketCardSubmit,
    control: buyTicketCardControl,
    formState: { errors: buyTicketCardErrors },
  } = useForm<BuyTicketCardSchema>({
    resolver: zodResolver(buyTicketCardSchema),
    defaultValues: {
      pan: '',
      expireDate: '',
      cvv: '',
    },
  });

  // TODO: skeleton
  if (movieQuery.isLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  const movieSchedule = movieScheduleQuery.data?.data.schedules;
  const movie = movieQuery.data?.data.film;
  const movieImageSrc = envConfig.apiUrl + movie?.img;

  // TODO: normalize dates
  const dates = movieSchedule?.map((movie) => movie.date);
  const onDateTabChange = (_: React.SyntheticEvent, tabIndex: number) => setDateTabIndex(tabIndex);

  const isMovieHasSeances = dateTabIndex !== null;
  const seances = (movieSchedule && isMovieHasSeances && movieSchedule[dateTabIndex].seances) || [];
  const normalizedSeances = seances.reduce((acc: NormalizedHall[], seance) => {
    const existingHall = acc.find((item) => item.hallName === seance.hall.name);

    if (existingHall) {
      existingHall.seances.push({
        time: seance.time,
        places: seance.hall.places,
        payedTickets: seance.payedTickets,
      });
    } else {
      acc.push({
        hallName: seance.hall.name,
        seances: [
          { time: seance.time, places: seance.hall.places, payedTickets: seance.payedTickets },
        ],
      });
    }

    return acc;
  }, []);

  const onSeanceClick = (hallIndex: number, seanceIndex: number) =>
    setSeatIndex({
      hallIndex,
      seanceIndex,
    });

  const isSeanceSelected = (hallIndex: number, seanceIndex: number) =>
    seatIndex && seatIndex.hallIndex === hallIndex && seatIndex.seanceIndex === seanceIndex;

  const seanceButtonVariant = (hallIndex: number, seanceIndex: number) =>
    isSeanceSelected(hallIndex, seanceIndex) ? 'contained' : 'outlined';

  const seats =
    (seatIndex && normalizedSeances[seatIndex.hallIndex].seances[seatIndex.seanceIndex]) || null;

  const isSeatBlocked = (col: Place) => col.type === 'BLOCKED';

  const getSeatStyles = (col: Place) => {
    const commonStyles = {
      typography: 'caption',
      color: 'secondary.contrastText',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0',
      width: '1rem',
      height: '1rem',
      borderRadius: '0.25rem',
    };

    if (isSeatBlocked(col)) {
      return {
        ...commonStyles,
        backgroundColor: 'gray',
      };
    }

    return {
      ...commonStyles,
      cursor: 'pointer',
      backgroundColor: 'primary.main',
      '&:hover': {
        backgroundColor: 'secondary.main',
        transform: 'scale(1.5)',
      },
    };
  };

  const seatTooltipTitle = (row: number, col: number, price: number) =>
    `${price} ₽, ${row} ряд, ${col} место`;

  const onSeatClick = (rowIndex: number, colIndex: number) => {
    const hall = normalizedSeances[seatIndex?.hallIndex as number];
    const hallName = hall.hallName;
    const date = (dates && dates[dateTabIndex as number]) as string;
    const time = hall.seances[seatIndex?.seanceIndex as number].time;
    const row = rowIndex + 1;
    const column = colIndex + 1;
    const price = seats?.places[rowIndex][colIndex].price as number;

    const existedRow = selectedSeats && selectedSeats.seats[row];
    const existedColumn = existedRow && existedRow.some((col) => col.column === column);
    if (existedColumn) {
      setSelectedSeats((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          seats: { ...prev?.seats, [row]: existedRow?.filter((col) => col.column !== column) },
        };
      });

      return;
    }

    const newSeats = {
      column,
      price,
    };
    const seat: PickedSeat = {
      movie: {
        id: movieId,
        name: movie?.name as string,
      },
      hallName,
      seance: {
        date,
        time,
      },
      seats: {
        [row]: [newSeats],
      },
    };

    setSelectedSeats((prev) => {
      if (!prev) {
        return {
          ...seat,
        };
      }

      if (!existedRow) {
        return {
          ...prev,
          seats: {
            ...prev.seats,
            [row]: [newSeats],
          },
        };
      }

      return {
        ...prev,
        seats: {
          ...prev.seats,
          [row]: [...existedRow, newSeats],
        },
      };
    });
  };

  const isSeatSelected = (row: number, col: number) => {
    const existedRow = selectedSeats?.seats[row];
    if (!existedRow) {
      return false;
    }

    return existedRow.some((column) => column.column === col);
  };

  const hasSelectedSeats =
    selectedSeats && Object.entries(selectedSeats.seats).some(([, column]) => !!column.length);
  const totalPrice =
    selectedSeats &&
    Object.entries(selectedSeats.seats).reduce((acc, [, column]) => {
      const rowSum = column.reduce((acc, col) => acc + col.price, 0);
      return acc + rowSum;
    }, 0);

  const onPayClick = () => {
    openModal();
  };

  const onSubmit = handleSubmit((data: BuyTicketPersonSchema) => {
    setPerson(data);
    nextStep();
  });

  const onPaySubmit = buyTicketCardSubmit(async (data: BuyTicketCardSchema) => {
    setDebitCard(data);

    const serializedPerson = serializeData({ ...person }) as BuyTicketPerson;
    const tickets = Object.entries(selectedSeats!.seats).reduce((acc, [row, columns]) => {
      const seats = columns.map((col) => [{ row: parseInt(row, 10), column: col.column }]);
      return [...acc, ...seats.flat()];
    }, [] as Seat[]);
    const payload = {
      filmId: movieId,
      person: serializedPerson,
      debitCard: data,
      tickets,
      seance: selectedSeats!.seance,
    };
    await buyTicketMutation.mutateAsync(payload as BuyTicketPayload);
  });

  return (
    <>
      <Link to={ROUTER_PATHS.main}>
        <Button variant="text" startIcon={<NavigateBeforeIcon />}>
          Назад
        </Button>
      </Link>
      <Box
        sx={{
          marginTop: '1.5rem',
        }}
      >
        {!movie && <Typography>Фильм не найден</Typography>}
        {movie && (
          <>
            {/* movie info */}
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={5} md={3}>
                  <Box
                    component="img"
                    sx={{
                      width: '100%',
                      height: '300px',
                    }}
                    src={movieImageSrc}
                    alt={movie.name}
                    loading="lazy"
                  />
                </Grid>
                <Grid item xs={12} sm={7} md={9}>
                  <Stack direction="column" gap={2}>
                    <Box>
                      <Typography component="h1" variant="h4" fontWeight={600}>
                        {movie.name}
                      </Typography>
                      <Typography
                        sx={{
                          marginTop: '0.25rem',
                        }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {movie.genres.join(', ')}
                      </Typography>
                    </Box>
                    <Box>
                      {Object.entries(movie.userRatings).map(([site, rating]) => (
                        <Typography key={site} variant="body2" color="text.secondary">
                          {site} - {rating}
                        </Typography>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        maxWidth: '600px',
                      }}
                    >
                      <Typography>{movie.description}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            {/* /movie info */}
            <Stack
              sx={{
                marginTop: '3rem',
                paddingBottom: '4rem',
              }}
              direction="column"
              gap={3}
            >
              {/* schedule */}
              <Box>
                <Typography component="h2" variant="h5" fontWeight={700}>
                  Расписание
                </Typography>
                {!isMovieHasSeances && (
                  <Typography>У данного фильма нет предстоящих сеансов</Typography>
                )}
                {isMovieHasSeances && (
                  <>
                    <Tabs
                      variant="scrollable"
                      scrollButtons="auto"
                      value={dateTabIndex}
                      onChange={onDateTabChange}
                    >
                      {!!dates?.length &&
                        dates?.map((date, index) => <Tab key={date} label={date} value={index} />)}
                    </Tabs>
                    <Stack
                      sx={{
                        marginTop: '1.5rem',
                      }}
                      direction="column"
                      gap={3}
                    >
                      {!normalizedSeances.length && (
                        <Typography>У данного сеанса нет свободных залов</Typography>
                      )}
                      {!!normalizedSeances.length &&
                        normalizedSeances.map((hall, hallIndex) => (
                          <Box key={hall.hallName}>
                            <Typography>Зал {hall.hallName}</Typography>
                            <Box
                              sx={{
                                marginTop: '1rem',
                              }}
                            >
                              {hall.seances.map((seance, seanceIndex) => (
                                <Button
                                  key={seance.time}
                                  variant={seanceButtonVariant(hallIndex, seanceIndex)}
                                  onClick={() => onSeanceClick(hallIndex, seanceIndex)}
                                >
                                  {seance.time}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        ))}
                    </Stack>
                  </>
                )}
              </Box>
              {/* /schedule */}
              {/* pick seat */}
              <Box>
                <Typography component="h2" variant="h5" fontWeight={700}>
                  Выбор места
                </Typography>
                <Grid
                  sx={{
                    marginTop: '1.5rem',
                  }}
                  container
                  spacing={4}
                >
                  {!seats && (
                    <Grid item xs={12}>
                      <Typography>Для выбора места выберите сеанс</Typography>
                    </Grid>
                  )}
                  {seats && (
                    <>
                      {/* left part */}
                      <Grid item xs={12} md={6}>
                        <Stack direction="column" gap={3}>
                          <Box>
                            <Typography
                              sx={{
                                textAlign: 'center',
                              }}
                            >
                              Экран
                            </Typography>
                            <Box
                              sx={{
                                marginTop: '0.5rem',
                                height: '0.25rem',
                                backgroundColor: 'divider',
                                borderRadius: '1rem',
                              }}
                            />
                          </Box>
                          <Typography>Ряд</Typography>
                          <Box
                            sx={{
                              display: 'grid',
                              placeItems: 'center',
                              rowGap: '1.5rem',
                              gridTemplateRows: `repeat(${seats.places.length}, 1fr)`,
                              gridTemplateColumns: `repeat(${Math.max(...seats.places.map((row) => row.length + 1))}, 1fr)`,
                            }}
                          >
                            {!!seats.places.length &&
                              seats.places.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                  <Typography variant="body2">{rowIndex + 1}</Typography>
                                  {row.map((col, colIndex) => (
                                    <Tooltip
                                      key={colIndex}
                                      componentsProps={{
                                        tooltip: {
                                          sx: {
                                            typography: 'body1',
                                            color: 'text.primary',
                                            backgroundColor: 'background.paper',
                                            boxShadow: 1,
                                          },
                                        },
                                      }}
                                      placement="top"
                                      arrow
                                      title={
                                        !isSeatBlocked(col) &&
                                        seatTooltipTitle(rowIndex + 1, colIndex + 1, col.price)
                                      }
                                    >
                                      <Box
                                        sx={{
                                          ...getSeatStyles(col),
                                          transform: isSeatSelected(rowIndex + 1, colIndex + 1)
                                            ? 'scale(1.5)'
                                            : '',
                                        }}
                                        onClick={() =>
                                          !isSeatBlocked(col) && onSeatClick(rowIndex, colIndex)
                                        }
                                      >
                                        {isSeatSelected(rowIndex + 1, colIndex + 1) && colIndex + 1}
                                      </Box>
                                    </Tooltip>
                                  ))}
                                </React.Fragment>
                              ))}
                          </Box>
                        </Stack>
                      </Grid>
                      {/* /left part */}
                      {/* right part */}
                      {hasSelectedSeats && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Stack direction="column" gap={3}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Зал
                                </Typography>
                                <Typography>{selectedSeats.hallName}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Дата и время
                                </Typography>
                                <Typography>
                                  {selectedSeats.seance.date} {selectedSeats.seance.time}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Места
                                </Typography>
                                {Object.entries(selectedSeats.seats).map(([row, column]) => {
                                  const columnValues = column.map((col) => col.column).join(', ');
                                  return (
                                    columnValues && (
                                      <Typography key={row}>
                                        {row} - {columnValues}
                                      </Typography>
                                    )
                                  );
                                })}
                              </Box>
                              <Typography variant="h5" fontWeight={700}>
                                Сумма: {totalPrice} ₽
                              </Typography>
                              <Box
                                sx={{
                                  padding: '1rem 0',
                                  maxWidth: '20.5rem',
                                }}
                              >
                                <Button
                                  sx={{
                                    width: '100%',
                                  }}
                                  variant="contained"
                                  onClick={onPayClick}
                                >
                                  Купить
                                </Button>
                              </Box>
                            </Stack>
                          </Grid>
                          {
                            <Modal
                              topHeaderSlot={
                                <>
                                  {canMoveToPrevStep && (
                                    <Button
                                      variant="text"
                                      startIcon={<NavigateBeforeIcon />}
                                      onClick={prevStep}
                                    >
                                      Назад
                                    </Button>
                                  )}
                                </>
                              }
                              open={isModalOpen}
                              onClose={onModalClose}
                            >
                              <>
                                {step === BUY_TICKET_STEPS.person && (
                                  <Stack
                                    component="form"
                                    sx={{
                                      padding: '1.5rem 3rem',
                                    }}
                                    direction="column"
                                    gap={3}
                                    onSubmit={onSubmit}
                                  >
                                    <Typography variant="h5" fontWeight={700}>
                                      Введите ваши даные
                                    </Typography>
                                    <Stack direction="column" gap={1}>
                                      <Typography>Имя*</Typography>
                                      <Controller
                                        name="firstname"
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            type="text"
                                            placeholder="Введите имя..."
                                            error={!!errors.firstname}
                                            helperText={errors?.firstname?.message}
                                            {...field}
                                          />
                                        )}
                                      />
                                    </Stack>
                                    <Stack direction="column" gap={1}>
                                      <Typography>Фамилия*</Typography>
                                      <Controller
                                        name="lastname"
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            type="text"
                                            placeholder="Введите фамилию..."
                                            error={!!errors.lastname}
                                            helperText={errors?.lastname?.message}
                                            {...field}
                                          />
                                        )}
                                      />
                                    </Stack>
                                    <Stack direction="column" gap={1}>
                                      <Typography>Отчество</Typography>
                                      <Controller
                                        name="middlename"
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            type="text"
                                            placeholder="Введите отчество..."
                                            error={!!errors.middlename}
                                            helperText={errors?.middlename?.message}
                                            {...field}
                                          />
                                        )}
                                      />
                                    </Stack>
                                    <Stack direction="column" gap={1}>
                                      <Typography>Телефон*</Typography>
                                      <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field: { ref, ...rest } }) => (
                                          <PatternFormat
                                            type="tel"
                                            placeholder="Номер телефона"
                                            format="+# ### ### ## ##"
                                            customInput={TextField}
                                            inputRef={ref}
                                            error={!!errors.phone}
                                            helperText={errors?.phone?.message}
                                            {...rest}
                                          />
                                        )}
                                      />
                                    </Stack>
                                    <Box
                                      sx={{
                                        padding: '1rem 0',
                                        maxWidth: '20.5rem',
                                      }}
                                    >
                                      <Button
                                        type="submit"
                                        sx={{
                                          width: '100%',
                                        }}
                                        variant="contained"
                                      >
                                        Продолжить
                                      </Button>
                                    </Box>
                                  </Stack>
                                )}
                                {step === BUY_TICKET_STEPS.card && (
                                  <Stack
                                    component="form"
                                    sx={{
                                      padding: '1.5rem 3rem',
                                    }}
                                    direction="column"
                                    gap={3}
                                    onSubmit={onPaySubmit}
                                  >
                                    <Typography variant="h5" fontWeight={700}>
                                      Введите данные карты для оплаты
                                    </Typography>
                                    <Stack direction="column" gap={1}>
                                      <Typography>Номер*</Typography>
                                      <Controller
                                        name="pan"
                                        control={buyTicketCardControl}
                                        render={({ field: { ref, ...rest } }) => (
                                          <PatternFormat
                                            type="tel"
                                            placeholder="0000 0000"
                                            format="#### ####"
                                            customInput={TextField}
                                            inputRef={ref}
                                            error={!!buyTicketCardErrors.pan}
                                            helperText={buyTicketCardErrors?.pan?.message}
                                            {...rest}
                                          />
                                        )}
                                      />
                                    </Stack>
                                    <Stack direction="column" gap={1}>
                                      <Typography>Срок*</Typography>
                                      <Controller
                                        name="expireDate"
                                        control={buyTicketCardControl}
                                        render={({ field: { ref, ...rest } }) => (
                                          <PatternFormat
                                            type="tel"
                                            placeholder="00/00"
                                            format="##/##"
                                            customInput={TextField}
                                            inputRef={ref}
                                            error={!!buyTicketCardErrors.expireDate}
                                            helperText={buyTicketCardErrors?.expireDate?.message}
                                            {...rest}
                                          />
                                        )}
                                      />
                                    </Stack>
                                    <Stack direction="column" gap={1}>
                                      <Typography>CVV*</Typography>
                                      <Controller
                                        name="cvv"
                                        control={buyTicketCardControl}
                                        render={({ field: { ref, ...rest } }) => (
                                          <PatternFormat
                                            type="tel"
                                            placeholder="0000"
                                            format="####"
                                            customInput={TextField}
                                            inputRef={ref}
                                            error={!!buyTicketCardErrors.cvv}
                                            helperText={buyTicketCardErrors?.cvv?.message}
                                            {...rest}
                                          />
                                        )}
                                      />
                                    </Stack>
                                    <Box
                                      sx={{
                                        padding: '1rem 0',
                                        maxWidth: '20.5rem',
                                      }}
                                    >
                                      <Button
                                        type="submit"
                                        sx={{
                                          width: '100%',
                                        }}
                                        variant="contained"
                                      >
                                        Оплатить
                                      </Button>
                                    </Box>
                                  </Stack>
                                )}
                                {step === BUY_TICKET_STEPS.paymentSuccess && (
                                  <Stack
                                    sx={{
                                      padding: '1.5rem 3rem',
                                    }}
                                    direction="column"
                                    gap={3}
                                  >
                                    <Box
                                      sx={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        alignSelf: 'center',
                                      }}
                                    >
                                      <CheckCircleIcon
                                        sx={{
                                          width: '100%',
                                          height: '100%',
                                          color: 'success.main',
                                        }}
                                      />
                                    </Box>
                                    <Typography
                                      sx={{
                                        textAlign: 'center',
                                      }}
                                      variant="h5"
                                      fontWeight={700}
                                    >
                                      Оплата прошла успешно!
                                    </Typography>
                                    <Stack direction="column">
                                      <Typography variant="caption" color="text.secondary">
                                        Номер заказа
                                      </Typography>
                                      <Typography>{payResponse?.order.orderNumber}</Typography>
                                    </Stack>
                                    <Stack direction="column">
                                      <Typography variant="caption" color="text.secondary">
                                        Фильм
                                      </Typography>
                                      <Typography>{movie.name}</Typography>
                                    </Stack>
                                    <Stack direction="column">
                                      <Typography variant="caption" color="text.secondary">
                                        Дата
                                      </Typography>
                                      <Typography>
                                        {selectedSeats.seance.date} {selectedSeats.seance.time}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="column">
                                      <Typography variant="caption" color="text.secondary">
                                        Время
                                      </Typography>
                                      <Typography>{selectedSeats.seance.time}</Typography>
                                    </Stack>
                                    <Stack direction="column">
                                      <Typography variant="caption" color="text.secondary">
                                        Места
                                      </Typography>
                                      {Object.entries(selectedSeats.seats).map(([row, column]) => {
                                        const columnValues = column
                                          .map((col) => col.column)
                                          .join(', ');
                                        return (
                                          columnValues && (
                                            <Typography key={row}>
                                              {row} - {columnValues}
                                            </Typography>
                                          )
                                        );
                                      })}
                                    </Stack>
                                    <Typography color="text.secondary">
                                      Вся информация была продублирована в SMS
                                    </Typography>
                                    <Link to={ROUTER_PATHS.profile}>
                                      <Typography
                                        sx={{
                                          textDecoration: 'underline',
                                          textAlign: 'center',
                                        }}
                                      >
                                        Перейти в личный кабинет
                                      </Typography>
                                    </Link>
                                  </Stack>
                                )}
                              </>
                            </Modal>
                          }
                        </>
                      )}
                      {/* /right part */}
                    </>
                  )}
                </Grid>
              </Box>
              {/* /pick seat */}
            </Stack>
          </>
        )}
      </Box>
    </>
  );
}
