import { useEffect, useState } from "react";
import { Ros, Vector3 } from "roslib";
import { DoubleSide } from "three";
import { useTopic } from "./RosbridgeConnections";
import Show from "./Show";

export interface MeshTriangleIndices {
  vertex_indices: [number, number, number];
}

export interface MeshGeometry {
  vertices: Vector3[];
  vertex_normals: Vector3[];
  faces: MeshTriangleIndices[];
}

export interface MeshGeometryStamped {
  uuid: string;
  mesh_geometry: MeshGeometry;
}
export interface MeshProps {
  ros: Ros;
  topic: string;
}

const Mesh = (props: MeshProps) => {
  const mesh = useTopic<MeshGeometryStamped>(props.ros, props.topic, 'mesh_msgs/MeshGeometryStamped', true);
  // const [vertices, setVertices] = useState<Float32Array|undefined>(new Float32Array([
  //   -1, 1, 0,
  //   1, 1, 0,
  //   -1, -1, 0,
  // ]));
  // const [indices, setIndices] = useState<Uint32Array|undefined>(new Uint32Array([
  //   0, 1, 2
  // ]));
  const [vertices, setVertices] = useState<Float32Array|undefined>();
  const [indices, setIndices] = useState<Uint32Array|undefined>();

  useEffect(() => {
    if (mesh) {
      const newVertices = new Float32Array(mesh.mesh_geometry.vertices.length * 3);
      const newIndices = new Uint32Array(mesh.mesh_geometry.faces.length * 3);

      mesh.mesh_geometry.vertices.forEach((vertex, index) => {
        newVertices[index * 3 + 0] = -vertex.x;
        newVertices[index * 3 + 2] = vertex.y;
        newVertices[index * 3 + 1] = vertex.z;
      });
      
      mesh.mesh_geometry.faces.forEach((face, index) => {
        newIndices[index * 3 + 0] = face.vertex_indices[0];
        newIndices[index * 3 + 1] = face.vertex_indices[1];
        newIndices[index * 3 + 2] = face.vertex_indices[2];
      });
      // console.log(newVertices.slice(0, 500));
      // setVertices(newVertices.slice(0, 500));
      // setIndices(newIndices.slice(0, 3));
      // console.log(newIndices.slice(0, 3));
      // setVertices(new Float32Array([
      //   -2.0, -2.0, 0.0,
      //   2.0, -2.0, 0.0,
      //   2.0, 2.0, 0.0,
      //   -2.0, 2.0, 2.0,
      // ]));
      // setIndices(new Uint32Array([
      //   2, 3, 1
      // ]));
      setVertices(newVertices);
      setIndices(newIndices);

      // geometry.setIndex(indices);
      // geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
      // // geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
      // geometry.computeVertexNormals();

      // const material = new MeshPhongMaterial({
      //   side: DoubleSide,
      //   color: 0xffffffff,
      // });
    }
  }, [mesh]);

  if (!indices || !vertices) {
    return null;
  }

  return (
    <mesh
      onClick={event => console.log(event.point)}
    >
      <bufferGeometry
        attach="geometry"
        onUpdate={self => self.computeVertexNormals()}
      >
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          itemSize={3}
          count={vertices.length / 3}
        />
        <bufferAttribute
          attach="index"
          array={indices}
          itemSize={1}
          count={indices.length}
        />
      </bufferGeometry>
      <meshPhongMaterial side={DoubleSide} />
    </mesh>
  );
}

export default Mesh
