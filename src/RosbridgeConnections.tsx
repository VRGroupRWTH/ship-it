import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Ros } from "roslib";
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

export default RosbridgeConnections;
export { useConnection };
