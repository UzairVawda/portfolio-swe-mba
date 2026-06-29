// Pick a particle count that stays smooth on the target device. Coarse pointer
// (touch) always gets the smallest budget to protect battery and frame rate.
export function particleBudget(width: number, coarsePointer: boolean): number {
  if (coarsePointer || width < 768) return 900;
  if (width < 1280) return 2000;
  return 6500;
}
