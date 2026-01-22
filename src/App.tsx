
import AddHistoryLog from './app/components/add-history-log';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="card text-center mb-8">
        <h1 className="text-4xl font-poppins neon-cyan mb-4">Lead Automation Dashboard</h1>
        <p className="text-lg text-gray-300 mb-2">Your modern SaaS UI is ready!</p>
        <p className="text-sm text-gray-500">Start building your automation features here.</p>
      </div>
      <AddHistoryLog />
    </div>
  );
}
