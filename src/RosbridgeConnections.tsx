import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Message, Ros, Topic } from "roslib";
import { useAppSelector } from './app/hooks';

type RosbridgeConnectionMap = {[key: string]: Ros};
const RosbridgeConnectionsContext = createContext<RosbridgeConnectionMap>({});

const RosbridgeConnections = (props: PropsWithChildren) => {
  const connectionConfigs = useAppSelector(state => state.config.connections);
  const [connections, setConnections] = useState<RosbridgeConnectionMap>({});

  useEffect(() => {
    const newConnections: RosbridgeConnectionMap = {};
    for (const connectionName of Object.keys(connectionConfigs)) {
      if (connectionName in connections) {
        // Check if URL changed
        newConnections[connectionName] = connections[connectionName];
      } else {
        newConnections[connectionName] = new Ros({ url: connectionConfigs[connectionName].url });
      }
    }
    for (const oldConnection of Object.keys(connections)) {
      if (!(oldConnection in newConnections)) {
        connections[oldConnection].close();
      }
    }
    setConnections(newConnections);
  }, [connectionConfigs]);

  return (
    <RosbridgeConnectionsContext.Provider value={connections}>
      {
      props.children
      }
    </RosbridgeConnectionsContext.Provider>
  );
}

const useConnection = (name: string) => {
  const connections = useContext(RosbridgeConnectionsContext);
  return connections[name] || null;
};

export function useTopic<T = Message>(ros: Ros, topicName: string, topicType: string, subscribe?: boolean) {
  const [topic, setTopic] = useState<Topic<T>|null>(null);
  const [message, setMessage] = useState<T|undefined>();

  useEffect(() => {
    if (ros) {
      setTopic(new Topic<T>({ ros, name: topicName, messageType: topicType }));
    }
    return () => setTopic(null);
  }, [ros, topicName, topicType]);
  useEffect(() => {
    if (topic && subscribe) {
      const theTopic = topic;
      theTopic.subscribe(setMessage);
      return () => theTopic.unsubscribe();
    }
  }, [topic, subscribe]);

  return message;
}

export default RosbridgeConnections;
export { RosbridgeConnectionsContext, useConnection };
