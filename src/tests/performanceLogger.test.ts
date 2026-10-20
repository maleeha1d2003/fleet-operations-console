
import {
  startPerformanceLogger,
  recordUpdatePerformance,
} from "../utils/performanceLogger";

describe("performanceLogger", () => {
  let animationCallback: FrameRequestCallback | undefined;
  let nextAnimationFrameId = 1;

  beforeEach(() => {
    jest.spyOn(console, "info").mockImplementation(() => {});

    animationCallback = undefined;
    nextAnimationFrameId = 1;

    jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationCallback = callback;
      return nextAnimationFrameId++;
    });

    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    jest.spyOn(performance, "now").mockReturnValue(1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns zero metrics when there are no frame samples", () => {
    const stop = startPerformanceLogger();
    stop();

    const stats = recordUpdatePerformance();

    expect(stats).toEqual({
      lastFrameMs: 0,
      maxFrameMs: 0,
      averageFrameMs: 0,
      samples: 0,
    });
    expect(console.info).toHaveBeenCalledWith(
      "[Performance] live update frame metrics",
      stats,
    );
  });

  it("calculates the last, maximum, and average frame times", () => {
    startPerformanceLogger();

    expect(animationCallback).toBeDefined();

    animationCallback!(1016);
    animationCallback!(1040);
    animationCallback!(1056);

    const stats = recordUpdatePerformance();

    expect(stats.lastFrameMs).toBe(16);
    expect(stats.maxFrameMs).toBe(24);
    expect(stats.averageFrameMs).toBeCloseTo(56 / 3);
    expect(stats.samples).toBe(3);
  });

  it("ignores zero, negative, and 1000ms-or-longer frame durations", () => {
    startPerformanceLogger();

    expect(animationCallback).toBeDefined();

    animationCallback!(1000);
    animationCallback!(999);
    animationCallback!(2000);

    const stats = recordUpdatePerformance();

    expect(stats.samples).toBe(0);
    expect(stats.lastFrameMs).toBe(0);
  });


it("keeps no more than 120 frame samples", () => {
  startPerformanceLogger();

  expect(animationCallback).toBeDefined();

  for (let time = 1010; time <= 1130; time += 1) {
    animationCallback!(time);
  }

  const stats = recordUpdatePerformance();

  expect(stats.samples).toBe(120);
  expect(stats.lastFrameMs).toBe(1);
});


  it("cancels the scheduled animation frame when stopped", () => {
    const stop = startPerformanceLogger();

    expect(window.requestAnimationFrame).toHaveBeenCalled();
    stop();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it("does not cancel another frame when stopped a second time", () => {
    const stop = startPerformanceLogger();

    stop();
    stop();

    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
