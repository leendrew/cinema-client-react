import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { PatternFormat } from 'react-number-format';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { Button } from '@/shared/ui';
import { profileSchema, serializeData } from '@/shared/schemas';
import type { ProfileSchema } from '@/shared/schemas';
import { userApi } from '@/store';
import type { UpdateProfilePayload, User } from '@/store';

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      middlename: user.middlename || '',
      phone: user.phone,
      email: user.email || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
  });

  const onSubmit = handleSubmit(async (data: ProfileSchema) => {
    const { phone, ...profile } = data;
    const serializedPhone = serializeData({ phone });
    const serializedProfile = serializeData(profile);
    const payload = { phone: serializedPhone, profile: serializedProfile };
    await updateProfileMutation.mutateAsync(payload as UpdateProfilePayload);
    toast.success('Профиль обновлен');
  });

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
        <Typography
          component="h2"
          variant="h5"
          fontWeight={700}
        >
          Профиль
        </Typography>
        <Stack
          direction="column"
          gap={1}
        >
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
        <Stack
          direction="column"
          gap={1}
        >
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
        <Stack
          direction="column"
          gap={1}
        >
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
        <Stack
          direction="column"
          gap={1}
        >
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
        <Stack
          direction="column"
          gap={1}
        >
          <Typography>Email</Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                type="text"
                placeholder="Введите email..."
                error={!!errors.email}
                helperText={errors?.email?.message}
                {...field}
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
            loading={updateProfileMutation.isPending}
          >
            Обновить данные
          </Button>
        </Box>
      </Stack>
    </>
  );
}
