declare interface Window {
  electronAPI: {
    runAutomation: () => void;
    onRunAutomation: (cb: (...args: any[]) => void) => void;
  };
}
