// Pick a particle count that stays smooth on the target device. Coarse pointer
// (touch) always gets the smallest budget to protect battery and frame rate.
export function particleBudget(width: number, coarsePointer: boolean): number {
  if (coarsePointer || width < 768) return 700;
  if (width < 1280) return 1500;
  return 5000;
}
