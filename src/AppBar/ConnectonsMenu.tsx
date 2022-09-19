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
import ConnectionInfoDialog from "./ConnectionInfoDialog";

interface ConnectionsMenuEntryProps {
 name: string;
 config: ConnectionConfig;
}

const ConnectionsMenuEntry = (props: ConnectionsMenuEntryProps) => {
  const dispatch = useAppDispatch();
  const connection = useConnection(props.name);
  const connectionConfig = useAppSelector(state => state.config.connections[props.name]);
  const [connected, setConnected] = useState(connection ? connection.isConnected : false);
  const [connectionInfoOpen, setConnectionInfoOpen] = useState(false);

  useEffect(() => {
    const connectListener = () => setConnected(true);
    const disconnectListener = () => setConnected(false);
    if (connection) {
      connection.addListener('connection', connectListener);
      connection.addListener('close', disconnectListener);
    }

    return () => {
      if (connection) {
        connection.removeListener('connection', connectListener);
        connection.removeListener('close', disconnectListener);
      }
    }
  }, [connection]);

  return (
    <ListItem>
      <IconButton
        onClick={() => connected ? connection.close() : connection.connect(connectionConfig.url)}
        color={connected ? "success" : connection ? "error" : "warning"}
        disabled={!connection}
      >
        <ConnectionIcon />
      </IconButton>
      <ListItemButton onClick={() => setConnectionInfoOpen(true)}>
        {props.name}
      </ListItemButton>
      <IconButton
        onClick={() => dispatch(connectionRemoved(props.name))}
      >
        <Delete />
      </IconButton>
      <ConnectionInfoDialog
        connection={props.name}
        open={connectionInfoOpen}
        close={() => setConnectionInfoOpen(false)}
      />
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
