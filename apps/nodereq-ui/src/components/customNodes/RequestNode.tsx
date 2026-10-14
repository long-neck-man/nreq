import type { Node, NodeProps } from '@xyflow/react';

type RequestNode = Node<{ ff: number }, 'requestNode'>;

export const RequestNode = ({ data }: NodeProps<RequestNode>) => {
  return <div>Hello : {data.ff}</div>
}
