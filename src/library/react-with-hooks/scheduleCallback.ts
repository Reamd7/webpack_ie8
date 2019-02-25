export default function scheduleCallback(callback:FrameRequestCallback) {
    const timer = requestAnimationFrame(callback);
    return () => {
      cancelAnimationFrame(timer);
    };
  }