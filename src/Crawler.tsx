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
  const position = useTopic<Vector3>(props.ros, '/pioneer/OffsetPosition', 'geometry_msgs/Vector3', true);

  // return (
  //   <mesh
  //     position={[position?.x || 0, position?.y || 0, position?.z || 0]}
  //     ref={ref}
  //     scale={clicked ? 1.5 : 1}
  //     onClick={(event) => click(!clicked)}
  //     onPointerOver={(event) => hover(true)}
  //     onPointerOut={(event) => hover(false)}>
  //     <boxGeometry args={[1, 1, 1]} />
  //     <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
  //   </mesh>
  // )
  return (
    <group
      position={[position?.x || 0, position?.y || 0, position?.z || 0]}
      scale={[10, 10, 10]}
    >
      <primitive
        object={model}
      />
    </group>
  );
}

export default Crawler;
