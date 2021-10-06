export function add(count: number = 1): (target: number) => number {
  return (target) => count + target;
}

export function lt(b: number): (b: number) => boolean {
  return (a) => a < b;
}

export function le(b: number): (a: number) => boolean {
  return (a) => a <= b;
}