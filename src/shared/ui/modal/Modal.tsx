import React from 'react';
import { Box, IconButton, Modal as MuiModal, Stack } from '@mui/material';
import type { ModalProps as MuiModalProps } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalBaseProps extends MuiModalProps {
  topHeaderSlot?: React.ReactElement;
  onClose: () => void;
}

export function Modal({ topHeaderSlot, onClose, children, ...rest }: ModalBaseProps) {
  return (
    <>
      <MuiModal onClose={onClose} {...rest}>
        <Stack
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'background.paper',
            borderRadius: '1.5rem',
            width: '34rem',
            padding: '1rem 1.5rem',
          }}
          direction="column"
        >
          <Box
            sx={{
              display: 'flex',
            }}
          >
            {topHeaderSlot}

            <IconButton
              sx={{
                marginLeft: 'auto',
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {children}
        </Stack>
      </MuiModal>
    </>
  );
}
