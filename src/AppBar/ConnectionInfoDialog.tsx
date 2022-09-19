import { CircularProgress, Link, List, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { Param, Service } from 'roslib';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import For from '../For';
import { useConnection } from '../RosbridgeConnections';
import Show from '../Show';
import Dialog from './Dialog';

export interface ConnectionInfoDialogProps {
  connection: string;
  open?: boolean;
  close: () => void;
}

interface Topic {
  name: string;
  type: string;
}

const ConnectionInfoDialog = (props: ConnectionInfoDialogProps) => {
  const getMessageTypeURL = (type: string, rosdistro: string|null) => {
    const [pkg, message] = type.split("/");
    return `http://docs.ros.org/en/${rosdistro || "melodic"}/api/${pkg}/html/msg/${message}.html`;
  };

  // const connectionConfig = useAppSelector(state => state.config.connections[props.connection]);
  const connection = useConnection(props.connection);
  const [rosdistro, setRosdistro] = useState<string|null>(null);
  const [topics, setTopics] = useState<undefined|null|Topic[]>(undefined);
  const [services, setServices] = useState<undefined|null|Topic[]>(undefined);

  useEffect(() => {
    if (props.open && connection) {
      const rosdistro = new Param({ ros: connection, name: '/rosdistro' });
      rosdistro.get(rosdistro => setRosdistro(rosdistro));

      connection.getTopics(
        topics => {
          const topicsArray: Topic[] = [];
          for (let i = 0; i < topics.topics.length; ++i) {
            topicsArray.push({
              name: topics.topics[i],
              type: topics.types[i],
            });
          }
          setTopics(topicsArray);
        },
        () => {
          setTopics(null);
        }
      );
   }
  }, [props.open, connection]);

  return (
    <Dialog
      open={props.open || false}
      title={props.connection}
      close={props.close}
    >
      <h2>ROS distribution</h2>
      <Show
        when={rosdistro}
        fallback={<CircularProgress />}
      >
        <p>{rosdistro}</p>
      </Show>
      <h2>Topics</h2>
      <Show
        when={topics}
        fallback={ typeof topics === 'undefined' ? <CircularProgress /> : <p>An error occured while querying the topics.</p>}
      >
      {
      topics =>
        <List>
          <For each={topics}>
          {
          topic =>
            <ListItem sx={{ whiteSpace: "nowrap" }} key={topic.name}>
              {
                topic.name
              }
              :&emsp;
              <Link
                href={getMessageTypeURL(topic.type, rosdistro)}
                target="_blank"
              >
              {
                topic.type
              }
              </Link>
            </ListItem>
          }
          </For>
        </List>
      }
      </Show>
    </Dialog>
  );
};

export default ConnectionInfoDialog;
