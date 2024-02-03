import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Box, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { Button, Modal } from '@/shared/ui';
import { moviesApi } from '@/store';
import type { TicketStatus, CancelTicketPayload, Seat } from '@/store';

export function TicketsPage() {
  const ticketsQuery = useQuery({
    queryKey: ['tickets'],
    queryFn: moviesApi.getTickets,
  });

  const [orderId, setOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { enqueueSnackbar } = useSnackbar();
  const cancelTicketMutation = useMutation({
    mutationFn: moviesApi.cancelTicket,
    onSuccess: () => {
      setOrderId(null);
      closeModal();
      enqueueSnackbar({ variant: 'success', message: 'Заказ отменен' });
    },
    // TODO: error typing support
    onError: (error: Error) => {
      // @ts-expect-error type issue
      const message = error.response.data.reason || ERROR_MESSAGE_API;
      enqueueSnackbar({ variant: 'error', message });
    },
  });

  // TODO: skeleton
  if (ticketsQuery.isLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  const orders = ticketsQuery.data?.data.orders;
  const normalizedOrders = orders?.map((order) => {
    const [{ seance, filmId }] = order.tickets;
    const normalizedTickets = order.tickets.reduce(
      (acc, ticket) => {
        const existedRow = acc[ticket.row];
        if (existedRow) {
          existedRow.push(ticket.column);
          return acc;
        }

        acc[ticket.row] = [ticket.column];

        return acc;
      },
      {} as { [key: Seat['row']]: Seat['column'][] },
    );

    return {
      ...order,
      seance,
      film: { id: filmId },
      tickets: normalizedTickets,
    };
  });

  const getOrderStatusProps = (status: TicketStatus) => {
    const labelMap: { [Key in TicketStatus]: Pick<ChipProps, 'label' | 'color'> } = {
      PAYED: {
        label: 'Оплачен',
        color: 'success',
      },
      CANCELED: {
        label: 'Отменен',
        color: 'warning',
      },
    };

    return labelMap[status];
  };

  const onCancelOrderClick = (orderId: string) => {
    setOrderId(orderId);
    openModal();
  };

  const onCancelTicketClick = async () => {
    const payload = {
      orderId,
    };
    await cancelTicketMutation.mutateAsync(payload as CancelTicketPayload);
  };

  return (
    <>
      <Stack direction="column" gap={3}>
        <Typography component="h2" variant="h5" fontWeight={700}>
          Билеты
        </Typography>
        <Grid container spacing={3}>
          {!normalizedOrders?.length && <Typography>У вас нет оплаченных билетов</Typography>}
          {!!normalizedOrders?.length &&
            normalizedOrders.map((order) => (
              <Grid key={order._id} item xs={12} sm={6} md={4}>
                <Stack
                  sx={{
                    borderBottom: '0.0625rem',
                    borderStyle: 'solid',
                    borderColor: 'divider',
                    borderRadius: '1rem',
                    padding: '1rem',
                    height: '100%',
                  }}
                  direction="column"
                  gap={2}
                >
                  {order.status !== 'CANCELED' && (
                    <>
                      <Stack
                        sx={{
                          typography: 'body2',
                          color: 'text.secondary',
                        }}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <span>{order.seance.date}</span>
                        <span>{order.seance.time}</span>
                      </Stack>
                      <Stack
                        sx={{
                          textAlign: 'center',
                        }}
                        direction="column"
                      >
                        <Typography component="h3" variant="h5">
                          {order.film.id}
                        </Typography>
                        {Object.entries(order.tickets).map(([row, columns]) => {
                          const columnValues = columns.join(', ');
                          return (
                            columnValues && (
                              <Typography key={row}>
                                {row} ряд - {columnValues}
                              </Typography>
                            )
                          );
                        })}
                      </Stack>
                    </>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Chip {...getOrderStatusProps(order.status)} />
                    <Typography variant="body2" color="text.secondary">
                      код билета {order.orderNumber}
                    </Typography>
                  </Stack>
                  {order.status !== 'CANCELED' && (
                    <Button variant="outlined" onClick={() => onCancelOrderClick(order._id)}>
                      Вернуть билет
                    </Button>
                  )}
                </Stack>
              </Grid>
            ))}
        </Grid>
      </Stack>
      {
        <Modal open={isModalOpen} onClose={closeModal}>
          <>
            <Stack direction="column" gap={2}>
              <Box
                sx={{
                  width: '3.5rem',
                  height: '3.5rem',
                  alignSelf: 'center',
                }}
              >
                <InfoIcon
                  sx={{
                    width: '100%',
                    height: '100%',
                    color: 'info.main',
                  }}
                />
              </Box>
              <Typography
                sx={{
                  textAlign: 'center',
                }}
                component="h3"
                variant="h5"
              >
                Вернуть билет?
              </Typography>
            </Stack>
            <Stack
              sx={{
                maxWidth: '20.5rem',
                margin: '2.5rem auto 4.5rem auto',
              }}
              direction="column"
              gap={2}
            >
              <Button
                sx={{
                  width: '100%',
                }}
                variant="contained"
                loading={cancelTicketMutation.isPending}
                onClick={onCancelTicketClick}
              >
                Вернуть
              </Button>
              <Button
                sx={{
                  width: '100%',
                }}
                variant="contained"
                loading={cancelTicketMutation.isPending}
                onClick={closeModal}
              >
                Отменить
              </Button>
            </Stack>
          </>
        </Modal>
      }
    </>
  );
}
