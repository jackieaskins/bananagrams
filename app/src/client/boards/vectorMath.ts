import { Vector2d } from "konva/lib/types";

export function vectorSum(a: Vector2d, b: Vector2d): Vector2d {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vectorDiff(a: Vector2d, b: Vector2d): Vector2d {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vectorProduct(a: Vector2d, b: Vector2d): Vector2d {
  return { x: a.x * b.x, y: a.y * b.y };
}

export function vectorQuotient(a: Vector2d, b: Vector2d): Vector2d {
  return { x: a.x / b.x, y: a.y / b.y };
}

export function vectorDist(a: Vector2d, b: Vector2d): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
