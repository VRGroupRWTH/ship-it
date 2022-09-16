import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { PropsWithChildren } from 'react';

export interface DialogProps extends PropsWithChildren {
  open: boolean;
  close?: () => void;
  title?: string;
  width?: number;
  height?: number;
}

const Dialog = (props: DialogProps) => {
  const theme = useTheme();
  return (
    <Modal
      open={props.open}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: props.width,
          height: props.height,
          bgcolor: theme.palette.background.paper,
          border: "2px solid #000",
          boxShadow: "24px",
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
          display: "flex",
          flexDirection: "row",
          }}
        >
          <Box
            sx={{
              flexGrow: 1
            }}
          >
            <h1>
            {
              props.title
            }
            </h1>
          </Box>
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              title="Close"
              onClick={props.close}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            overflow: "auto"
          }}
        >
        { props.children }
        </Box>
      </Box>
    </Modal>
  );
};

export default Dialog;
