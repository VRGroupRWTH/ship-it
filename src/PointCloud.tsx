
import { useEffect, useState } from "react";
import { Ros, Vector3 } from "roslib";
import { Color, DoubleSide } from "three";
import For from "./For";
import { useTopic } from "./RosbridgeConnections";
import Show from "./Show";


export interface MeshGeometryStamped {
  // uuid: string;
  // mesh_geometry: MeshGeometry;
  width: number;
  data: string;
}
export interface PointCloudProps {
  ros: Ros;
  topic: string;
}

interface P {
  x: number;
  y: number;
  z: number;
  intensity: number;
}

const PointCloud = (props: PointCloudProps) => {
  const pointCloud = useTopic<MeshGeometryStamped>(props.ros, props.topic, 'sensor_msgs/PointCloud2', true);
  const [points, setPoints] = useState<P[]>([]);

  useEffect(() => {
    // console.log(pointCloud?.width);
    // console.log(pointCloud?.data);
    if (pointCloud) {
      const x = Uint8Array.from(atob(pointCloud.data), c => c.charCodeAt(0));
      const floats = new Float32Array(x.buffer);
      const ps: P[] = [];
      for (let i = 0; i < pointCloud.width; ++i) {
        ps.push({
          x: floats[i * 4 + 0],
          y: floats[i * 4 + 1],
          z: floats[i * 4 + 2],
          intensity: floats[i * 4 + 3],
        });
      }
      setPoints(ps);
      // console.log(floats);
    }
  }, [pointCloud]);

  return (
    <For each={points}>
    {
      (p, i) =>
      <mesh position={[-p.x, p.z, p.y]} key={i}>
        <sphereGeometry args={[0.02]}>
        </sphereGeometry>
        <meshStandardMaterial color={new Color(p.intensity / 50, 0, 0)} />
      </mesh>
    }
    </For>
  );
}

export default PointCloud;
