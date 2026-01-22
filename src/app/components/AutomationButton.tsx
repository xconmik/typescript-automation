export default function AutomationButton() {
  return (
    <button
      className="bg-cyan-600 px-4 py-2 rounded"
      onClick={() => window.electronAPI.runAutomation()}
    >
      Start Automation
    </button>
  );
}
