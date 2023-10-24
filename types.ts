type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
  offsetX: number;
  offsetY: number;
};

type Point = { x: number; y: number };

type Specification = {
  color: string;
  brushWidth: number;
};

type DrawLineProps = Partial<Draw> & Partial<Specification>;

type ShapesProps = Partial<Draw> &
  Partial<Specification> & {
    isFillColor: boolean;
  };

export { Draw, Point, DrawLineProps, ShapesProps };
