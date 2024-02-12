import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PatternFormat } from 'react-number-format';
import { TextField, Stack, Typography, Box } from '@mui/material';
import { Button } from '@/shared/ui';
import { getOtpSchema, loginSchema, MAX_OTP_LEN, serializeData } from '@/shared/schemas';
import type { LoginSchema } from '@/shared/schemas';
import { useTimer } from '@/shared/hooks';
import { ROUTER_PATHS } from '@/shared/constants';
import { authActions, authApi } from '@/store';
import type { GetOtpPayload, LoginPayload } from '@/store';
import { envConfig } from '@/config';

const OTP_PAGE_URL = envConfig.apiUrl + '/otps';

// first time to test
let OTP_RESEND_DELAY_MS = 5000;

// TODO: refactor this shit

export function LoginPage() {
  const navigate = useNavigate();

  const getOtpMutation = useMutation({
    mutationFn: authApi.getOtp,
    onSuccess: ({ data }) => {
      OTP_RESEND_DELAY_MS = data.retryDelay;
      setIsOtpSended(true);
      timer.start();
    },
  });
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      authActions.setState({ user: data.user, token: data.token, isAuth: true });
      navigate(ROUTER_PATHS.main);
    },
  });

  const isLoading = getOtpMutation.isPending || loginMutation.isPending;

  const timer = useTimer(OTP_RESEND_DELAY_MS);
  const seconds = timer.milliseconds / 1000;

  const [isOtpSended, setIsOtpSended] = useState<boolean>(false);
  const submitButtonTitle = isOtpSended ? 'Войти' : 'Продолжить';
  const schema = isOtpSended ? loginSchema : getOtpSchema;

  const {
    trigger,
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: '',
      code: '',
    },
  });

  const getOtpCodeSubmit = async (data: Pick<LoginSchema, 'phone'>) => {
    const payload = serializeData(data);
    await getOtpMutation.mutateAsync(payload as GetOtpPayload);
    toast.success('Код отправлен');
  };

  const resendOtpCode = async () => {
    trigger('phone');
    const phone = getValues('phone');
    const payload = serializeData({ phone });
    await getOtpMutation.mutateAsync(payload as GetOtpPayload);
    timer.restart();
  };

  const loginSubmit = async (data: LoginSchema) => {
    const payload = serializeData(data);
    await loginMutation.mutateAsync(payload as LoginPayload);
  };

  const submitMethod = isOtpSended ? loginSubmit : getOtpCodeSubmit;
  const onSubmit = handleSubmit(submitMethod);

  const onOtpCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^\d.-]+/g, '');

    if (parseInt(e.target.value, 10) < 0) {
      e.target.value = '0';
    }

    if (e.target.value.length > MAX_OTP_LEN) {
      e.target.value = e.target.value.slice(0, MAX_OTP_LEN);
    }
  };

  return (
    <>
      <Stack
        component="form"
        sx={{
          maxWidth: '29rem',
        }}
        direction="column"
        gap={3}
        onSubmit={onSubmit}
      >
        <Typography component="h2" variant="h5" fontWeight={700}>
          Авторизация
        </Typography>
        <Typography variant="body1">Введите номер телефона для входа в личный кабинет</Typography>
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
        {isOtpSended && (
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                type="number"
                placeholder="Проверочный код"
                error={!!errors.code}
                helperText={errors?.code?.message}
                inputProps={{ maxLength: MAX_OTP_LEN }}
                onInput={onOtpCodeInput}
                {...field}
              />
            )}
          />
        )}
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
            loading={isLoading}
          >
            {submitButtonTitle}
          </Button>
        </Box>
        {isOtpSended && (
          <>
            <Box
              sx={{
                padding: '1rem 0',
                maxWidth: '20.5rem',
              }}
            >
              {timer.isExpired && (
                <Button
                  sx={{
                    width: '100%',
                  }}
                  variant="text"
                  loading={isLoading}
                  onClick={resendOtpCode}
                >
                  Запросить код еще раз
                </Button>
              )}
              {!timer.isExpired && `Запросить код повторно можно через ${seconds} секунд`}
            </Box>
          </>
        )}
      </Stack>
      {isOtpSended && (
        <Link to={OTP_PAGE_URL} target="_blank">
          Посмотреть код
        </Link>
      )}
    </>
  );
}
