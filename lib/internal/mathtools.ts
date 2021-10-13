export function add(count: number = 1): (target: number) => number {
  return (target) => count + target;
}

export function eq(b: number): (b: number) => boolean {
  return (a) => a === b;
}

export function lt(b: number): (b: number) => boolean {
  return (a) => a < b;
}

export function le(b: number): (a: number) => boolean {
  return (a) => a <= b;
}

export function gt(b: number): (b: number) => boolean {
  return (a) => a > b;
}

export function ge(b: number): (a: number) => boolean {
  return (a) => a >= b;
}
