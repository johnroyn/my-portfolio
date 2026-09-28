import { describe, expect, it } from "vitest";
import { getIntroProgressSteps } from "./intro";

describe("getIntroProgressSteps", () => {
  it("returns a sequence that progresses to 100%", () => {
    const steps = getIntroProgressSteps();

    expect(steps).toEqual([3, 9, 18, 34, 57, 81, 100]);
    expect(steps[steps.length - 1]).toBe(100);
    expect(steps[0]).toBeLessThan(steps[1]);
  });
});
