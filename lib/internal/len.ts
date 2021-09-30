export type CapacityPorter =
  | {
      length: number
    }
  | { size: number }

export default function len(source: CapacityPorter): number {
  //@ts-expect-error either has size or length
  return source.length ?? source.size
}
