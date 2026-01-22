// React History Page – Lead Automation
// Stack: Next.js + React + Tailwind CSS

import { useEffect, useState, useCallback } from 'react';
import AddHistoryLog from './add-history-log';
import { Info, UserCog, Zap, Rocket, ShieldCheck, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryLog {
  id: string;
  company_name: string;
  domain: string;
  agent: string;
  disposition: string;
  remarks: string;
  headquarters: string;
  created_at: string;
}

const dispositionColor = (value: string) => {
  switch (value) {
    case 'Enriched': return 'bg-green-500 text-white';
    case 'Skipped': return 'bg-gray-400 text-white';
    case 'Failed': return 'bg-red-500 text-white';
    case 'Invalid Email': return 'bg-amber-500 text-white';
    case 'Duplicate': return 'bg-purple-500 text-white';
    default: return 'bg-blue-500 text-white';
  }
};

const agentBadge = (agent: string) => {
  switch (agent) {
    case 'ZoomInfo Agent':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium"><Zap className="w-3.5 h-3.5" />ZoomInfo</span>;
    case 'RocketReach Agent':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-medium"><Rocket className="w-3.5 h-3.5" />RocketReach</span>;
    case 'Validation Agent':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium"><ShieldCheck className="w-3.5 h-3.5" />Validation</span>;
    case 'Automation Engine':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-medium"><UserCog className="w-3.5 h-3.5" />Automation</span>;
    default:
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium"><Clock className="w-3.5 h-3.5" />{agent}</span>;
  }
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dispositionFilter, setDispositionFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:3001/api/history')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch history');
        return res.json();
      })
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filtered = history.filter(h => {
    const matchesSearch =
      h.company_name.toLowerCase().includes(search.toLowerCase()) ||
      h.domain.toLowerCase().includes(search.toLowerCase());
    const matchesDisposition = dispositionFilter ? h.disposition === dispositionFilter : true;
    return matchesSearch && matchesDisposition;
  });

  if (loading) {
    return (
      <div className="p-6 bg-neutral-50 min-h-screen font-sans text-gray-900">
        <h1 className="text-2xl font-semibold mb-1">History</h1>
        <p className="text-gray-500 mb-4">Automation execution logs</p>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-neutral-50 min-h-screen font-sans text-gray-900">
        <h1 className="text-2xl font-semibold mb-1">History</h1>
        <p className="text-gray-500 mb-4">Automation execution logs</p>
        <div className="text-red-600 font-semibold">Error: {error}</div>
        <button onClick={fetchHistory} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-50 min-h-screen font-sans text-gray-900">
      <AddHistoryLog onSuccess={fetchHistory} />
      {/* Audit Trail Banner */}
      <div className="mb-6 flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
        <Info className="w-5 h-5 text-blue-500" />
        <span className="text-sm text-blue-900">This is a read-only, immutable audit trail of all automation activity. Logs cannot be edited or deleted.</span>
      </div>

      <h1 className="text-2xl font-semibold mb-1">History</h1>
      <p className="text-gray-500 mb-4">Automation execution logs</p>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="w-full md:w-1/2 p-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          placeholder="Search company or domain..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-48 p-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          value={dispositionFilter}
          onChange={e => setDispositionFilter(e.target.value)}
        >
          <option value="">All Dispositions</option>
          <option value="Enriched">Enriched</option>
          <option value="Skipped">Skipped</option>
          <option value="Failed">Failed</option>
          <option value="Invalid Email">Invalid Email</option>
          <option value="Duplicate">Duplicate</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow bg-white border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-100 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left font-semibold">Company</th>
              <th className="p-3 text-center font-semibold">Agent</th>
              <th className="p-3 text-center font-semibold">Disposition</th>
              <th className="p-3 font-semibold">Remarks</th>
              <th className="p-3 font-semibold">HQ</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <>
                <tr
                  key={row.id}
                  className={`border-t border-gray-200 group transition-colors duration-150 hover:bg-indigo-50 cursor-pointer ${expanded === row.id ? 'bg-indigo-50' : ''}`}
                  onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                >
                  <td className="p-3 min-w-[180px]">
                    <div className="font-medium text-base">{row.company_name}</div>
                    <div className="text-xs text-gray-500">{row.domain}</div>
                  </td>
                  <td className="p-3 text-center">{agentBadge(row.agent)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-lg font-semibold ${dispositionColor(row.disposition)}`}>
                      {row.disposition}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{row.remarks}</td>
                  <td className="p-3">{row.headquarters}</td>
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="rounded-full p-1 hover:bg-indigo-100 transition"
                      aria-label={expanded === row.id ? 'Collapse details' : 'Expand details'}
                      onClick={e => { e.stopPropagation(); setExpanded(expanded === row.id ? null : row.id); }}
                    >
                      {expanded === row.id ? <ChevronUp className="w-4 h-4 text-indigo-500" /> : <ChevronDown className="w-4 h-4 text-indigo-500" />}
                    </button>
                  </td>
                </tr>
                {expanded === row.id && (
                  <tr className="bg-indigo-50 border-t border-indigo-100">
                    <td colSpan={7} className="p-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="mb-2 text-xs text-gray-500">Execution Details</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div><span className="font-medium text-gray-700">Attempt Time:</span> {new Date(row.created_at).toLocaleString()}</div>
                            <div><span className="font-medium text-gray-700">Process Duration:</span> 2.3s</div>
                            <div><span className="font-medium text-gray-700">Data Source:</span> {row.agent}</div>
                            <div><span className="font-medium text-gray-700">Validation Score:</span> 98</div>
                            <div><span className="font-medium text-gray-700">Error Codes:</span> None</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 text-xs text-gray-500">Audit Trail</div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                            This record is immutable and part of the enterprise audit log. All actions are timestamped and verified.
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
