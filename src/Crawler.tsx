import { useRef, useState } from 'react'
import { useTopic } from './RosbridgeConnections'
import { Ros, Vector3 } from "roslib";

export interface CrawlerProps {
  ros: Ros;
}

function Crawler(props: CrawlerProps) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>();

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => ref.current.rotation.x += 0.01);
  // Return the view, these are regular Threejs elements expressed in JSX
  //
  const position = useTopic<Vector3>(props.ros, '/pioneer/OffsetPosition', 'geometry_msgs/Vector3', true);

  return (
    <mesh
      position={[position?.x || 0, position?.y || 0, position?.z || 0]}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default Crawler;
