import { Divider, IconButton, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import PopoverListButton from "./PopoverListButton";
import { Power as ConnectionIcon, PowerOff as DisconnectIcon, Delete } from '@mui/icons-material';
import NewConnectionDialog from "./NewConnectionDialog";
import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import For from "../For";
import Show from "../Show";
import { ConnectionConfig, connectionRemoved } from "../features/config/config-slice";
import { useConnection } from "../RosbridgeConnections";

interface ConnectionsMenuEntryProps {
 name: string;
 config: ConnectionConfig;
}

const ConnectionsMenuEntry = (props: ConnectionsMenuEntryProps) => {
  const dispatch = useAppDispatch();
  const [connected, setConnected] = useState(false);
  const connection = useConnection(props.name);

  useEffect(() => {
    if (connection) {
      connection.addListener('connection', () => setConnected(true));
      connection.addListener('close', () => setConnected(false));
    }
  }, [connection]);

  return (
    <ListItem>
      <IconButton
        onClick={() => dispatch(connectionRemoved(props.name))}
        color={connected ? "success" : "error"}
      >
        <ConnectionIcon />
      </IconButton>
      <ListItemButton>{props.name}</ListItemButton>
      <IconButton
        onClick={() => dispatch(connectionRemoved(props.name))}
      >
        <Delete />
      </IconButton>
    </ListItem>
  );
};

const ConnectionsMenu = () => {
  const connections = useAppSelector(state => state.config.connections);
  const [newConnection, setNewConnection] = useState(false);

  return (
    <Fragment>
      <NewConnectionDialog
        open={newConnection}
        close={() => setNewConnection(false)}
      />
      <PopoverListButton
        icon={ConnectionIcon}
        title="Connections"
      >
        <For each={Object.keys(connections).map(name => ({ name, config: connections[name] }))}>
          {
          connection => <ConnectionsMenuEntry key={connection.name} {...connection} />
          }
        </For>
        <Show when={Object.keys(connections).length > 0}>
          <Divider />
        </Show>
        <ListItem>
          <ListItemButton onClick={() => setNewConnection(true)}>Add Connection</ListItemButton>
        </ListItem>
      </PopoverListButton>
    </Fragment>
  );
};

export default ConnectionsMenu;
