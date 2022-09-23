import { Canvas } from '@react-three/fiber';
import { Controllers, Hands, RayGrab, VRButton, XR } from '@react-three/xr';
import Crawler from './Crawler';
import SkyBox from './SkyBox';
import Water from './Water';
import OrbitControls from './OrbitControls';
import { useConnection } from './RosbridgeConnections';
import Show from './Show';
import { useState } from 'react';
import Mesh from './Mesh';

const Viewport = () => {
  const ros = useConnection('New Connection');
  const [isInXr, setIsInXr] = useState(false);

  return (
    <>
      <VRButton />
      <Canvas tabIndex={0}>
        <Show when={isInXr} fallback={<OrbitControls />}>
          <></>
        </Show>
        <XR
          onSessionStart={() => setIsInXr(true)}
          onSessionEnd={() => setIsInXr(false)}
        >
          <Controllers />
          <Hands />
          <SkyBox baseURL="skyboxes/clouds" />
          <Water width={1000} height={1000} waterNormalsTexture="waternormals.jpg" />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Crawler ros={ros} />
          <Mesh ros={ros} topic="/leica_pts_parser/mesh" />
        </XR>
      </Canvas>
    </>
  );
}

export default Viewport;
