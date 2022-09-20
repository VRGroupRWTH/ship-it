import { Canvas } from '@react-three/fiber';
import { Controllers, Hands, VRButton, XR } from '@react-three/xr';
import Crawler from './Crawler';
import SkyBox from './SkyBox';
import Water from './Water';
import OrbitControls from './OrbitControls';
// import { Controllers, Hands, XR } from '@react-three/xr';
import { useConnection } from './RosbridgeConnections';

const Viewport = () => {
  const ros = useConnection('New Connection');

  return (
    <>
      <VRButton />
      <Canvas tabIndex={0}>
        <XR>
          <Controllers />
          <Hands />
          <SkyBox baseURL="skyboxes/clouds" />
          <Water width={1000} height={1000} waterNormalsTexture="waternormals.jpg" />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Crawler ros={ros} />
        </XR>
      </Canvas>
    </>
  );
}

export default Viewport;
