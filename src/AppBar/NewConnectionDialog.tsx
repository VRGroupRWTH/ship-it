import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { connectionAdded } from '../features/config/config-slice';
import Dialog from './Dialog';

export interface NewConnectionDialogProps {
  open?: boolean;
  close: () => void;
}

const NewConnectionDialog = (props: NewConnectionDialogProps) => {
  const connections = useAppSelector(state => state.config.connections);
  const dispatch = useAppDispatch();
  const [name, setName] = useState("New Connection");
  const [url, setURL] = useState("wss://localhost:9090");

  return (
    <Dialog
      open={props.open || false}
      title="Connection Details"
      close={props.close}
    >
      <FormControl>
        <TextField
          label="Name"
          variant="standard"
          value={name}
          error={name in connections}
          onChange={event => setName(event.target.value)}
        />
        <TextField
          label="URL"
          variant="standard"
          value={url}
          onChange={event => setURL(event.target.value)}
        />
        <Button
          variant="text"
          disabled={name in connections}
          onClick={() => {
            dispatch(connectionAdded({ name, config: { url } }));
            props.close();
          }}
        >
          Connect
        </Button>
      </FormControl>
    </Dialog>
  );
};

export default NewConnectionDialog;
