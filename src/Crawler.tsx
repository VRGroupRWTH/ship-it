import { useEffect, useRef, useState } from 'react'
import { useTopic } from './RosbridgeConnections'
import { Ros, Vector3 } from 'roslib';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber';

export interface CrawlerProps {
  ros: Ros;
}

function Crawler(props: CrawlerProps) {
  const ref = useRef<any>();
  const group = useRef<any>();

  // const model = useLoader(ColladaLoader, 'Mobius/mobius_cedric.dae');
  // const model = useLoader(ColladaLoader, 'crawler/Altiscan2t.dae');
  const model = useLoader(OBJLoader, 'crawler/Altiscan2t.obj');

  useEffect(() => console.log(model), [model]);
  // console.log(model);

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => ref.current.rotation.x += 0.01);
  // Return the view, these are regular Threejs elements expressed in JSX
  //
  const poseStamped = useTopic<{ pose: { position: {x: number, y: number, z: number }, orientation: {w: number, x: number, y: number, z: number }}}>(props.ros, '/mesh_pf1/pose', 'geometry_msgs/PoseStamped', true);
  const position: [number, number, number] = [-(poseStamped?.pose.position.x || 0), poseStamped?.pose.position.z || 0, poseStamped?.pose.position.y || 0];
  const orientation: [number, number, number, number] = [poseStamped?.pose.orientation.x || 0, poseStamped?.pose.orientation.y || 0, poseStamped?.pose.orientation.z || 0, poseStamped?.pose.orientation.w || 1];
  const sd: [number, number, number, number] = [
    -orientation[0],
    orientation[2],
    orientation[1],
    orientation[3],
  ];

  const q = new Quaternion();
  q.setFromEuler(new Euler(0, -Math.PI / 2, Math.PI), true);

  return (
    <group
      position={position}
      quaternion={sd}
      scale={[1, 1, 1]}
    >
      <group
        position={[0, 0.1, 0]}
        quaternion={q}
      >
        <primitive
          object={model}
        />
      </group>
    </group>
  );
}

export default Crawler;
