import { Box, CircularProgress, Link, List, ListItem, ListItemButton, Popover } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Param, Ros } from 'roslib';
import For from '../For';
import { useConnection, useTopic } from '../RosbridgeConnections';
import Show from '../Show';
import Dialog from './Dialog';

interface Topic {
  name: string;
  type: string;
}

interface TopicInfoProps {
  topic: Topic;
  rosDistro?: string|null;
  ros: Ros,
}

const TopicInfo = (props: TopicInfoProps) => {
  const getMessageTypeURL = () => {
    const [pkg, message] = props.topic.type.split("/");
    return `http://docs.ros.org/en/${props.rosDistro || "melodic"}/api/${pkg}/html/msg/${message}.html`;
  };
  
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const message = useTopic(props.ros, props.topic.name, props.topic.type, shouldSubscribe);

  return (
    <>
      <ListItem
        sx={{ margin: 0 }}
        key={props.topic.name}
      >
        <ListItemButton
          sx={{
            whiteSpace: "nowrap",
            padding: 0,
          }}
          onClick={() => setShouldSubscribe(!shouldSubscribe)}
        > 
          { props.topic.name }
        </ListItemButton>
        &nbsp;
        <Link
          href={getMessageTypeURL()}
          target="_blank"
          sx={{ whiteSpace: "nowrap" }}
        >
          { props.topic.type }
        </Link>
      </ListItem>
      <Show when={shouldSubscribe}>
        <pre style={{ margin: 0 }}>{ JSON.stringify(message, undefined, 2) }</pre>
      </Show>
    </>
  );
}

export interface ConnectionInfoDialogProps {
  connection: string;
  open?: boolean;
  close: () => void;
}

const ConnectionInfoDialog = (props: ConnectionInfoDialogProps) => {
  const connection = useConnection(props.connection);
  const [rosdistro, setRosdistro] = useState<string|null>(null);
  const [topics, setTopics] = useState<undefined|null|Topic[]>(undefined);

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
          topic => <TopicInfo topic={topic} rosDistro={rosdistro} ros={connection} />
          }
          </For>
        </List>
      }
      </Show>
    </Dialog>
  );
};

export default ConnectionInfoDialog;
