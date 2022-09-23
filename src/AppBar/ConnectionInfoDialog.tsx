import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Link, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
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
  searchQuery?: string,
}

const TopicInfo = (props: TopicInfoProps) => {
  const getMessageTypeURL = () => {
    const [pkg, message] = props.topic.type.split("/");
    return `http://docs.ros.org/en/${props.rosDistro || "melodic"}/api/${pkg}/html/msg/${message}.html`;
  };
  
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const message = useTopic(props.ros, props.topic.name, props.topic.type, shouldSubscribe);

  return (
    <Show
      when={
        !props.searchQuery ||
        props.topic.name.indexOf(props.searchQuery) !== -1 ||
        props.topic.type.indexOf(props.searchQuery) !== -1
      }
    >
      <Accordion
        onChange={(_, expanded) => setShouldSubscribe(expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
        >
          {props.topic.name}
          &emsp;
          <Link
            href={getMessageTypeURL()}
            target="_blank"
            sx={{ whiteSpace: "nowrap" }}
          >
            { props.topic.type }
          </Link>
        </AccordionSummary>
        <AccordionDetails>
          <Show when={message} fallback={<CircularProgress />}>
            <pre style={{ margin: 0 }}>{ JSON.stringify(message, undefined, 2) }</pre>
          </Show>
        </AccordionDetails>
      </Accordion>
    </Show>
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
  const [topicSearchQuery, setTopicSearchQuery] = useState<string|undefined>();

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
      width="80%"
      height="80%"
    >
      <h2>ROS distribution</h2>
      <Show
        when={rosdistro}
        fallback={<CircularProgress />}
      >
        <p>{rosdistro}</p>
      </Show>
      <h2 style={{ display: 'flex' }}>
        <span style={{ flexGrow: 1 }}>Topics</span>
        <TextField
          variant="outlined"
          value={topicSearchQuery}
          onChange={x => setTopicSearchQuery(x.currentTarget.value)}
          margin="dense"
          placeholder="Search topics"
          sx={{
            margin: 0,
          }}
          inputProps={{
            style: {
              padding: '0.2em',
            }
          }}
        />
      </h2>
      <Show
        when={topics}
        fallback={ typeof topics === 'undefined' ? <CircularProgress /> : <p>An error occured while querying the topics.</p>}
      >
      {
      topics =>
        <For each={topics}>
        {
        topic =>
          <TopicInfo
            key={`${props.connection}${topic.name}`}
            topic={topic}
            rosDistro={rosdistro}
            ros={connection}
            searchQuery={topicSearchQuery}
          />
        }
        </For>
      }
      </Show>
    </Dialog>
  );
};

export default ConnectionInfoDialog;
