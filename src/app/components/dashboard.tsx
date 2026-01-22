import { TrendingUp, Users, CheckCircle2, XCircle, Play } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import type { HistoryLog } from "../../types/history-log";

function RunAutomationButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/automation', { method: 'POST' });
      const data = await res.json();
      setResult(data.message || data.error);
    } catch (err) {
      setResult('Error running automation');
    }
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <button onClick={handleRun} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Running...' : 'Run Playwright Automation'}
      </button>
      {result && <div className="mt-2 text-sm text-gray-700">{result}</div>}
    </div>
  );
}


export default function Dashboard() {
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history logs");
        return res.json();
      })
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Example metrics based on logs
  const totalLeads = logs.length;
  const enrichedLeads = logs.filter(l => l.disposition === "Enriched").length;
  const failedEnrichments = logs.filter(l => l.disposition === "Failed").length;
  const activeCampaigns = 18; // Placeholder

  const metricsData = [
    {
      title: "Total Leads Imported",
      value: totalLeads,
      change: "+0%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Enriched Leads",
      value: enrichedLeads,
      change: "+0%",
      trend: "up",
      icon: CheckCircle2,
    },
    {
      title: "Failed Enrichments",
      value: failedEnrichments,
      change: "-0%",
      trend: "down",
      icon: XCircle,
    },
    {
      title: "Active Campaigns",
      value: activeCampaigns,
      change: "+0",
      trend: "up",
      icon: Play,
    },
  ];

  // Example chart data
  const enrichmentTimeData = logs.slice(0, 7).map((log, idx) => ({
    date: new Date(log.created_at).toLocaleDateString(),
    count: idx + 1,
  }));

  const successFailData = [
    { source: "Enriched", success: enrichedLeads, failed: failedEnrichments },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Monitor your lead enrichment performance and activity
        </p>
      </div>

      {/* Automation Button */}
      <RunAutomationButton />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricsData.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
              <p className="font-semibold text-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart - Enrichments Over Time */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-gray-900">Enrichments Over Time</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={enrichmentTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Success vs Failed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-gray-900 mb-6">Success vs Failed Lookups</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={successFailData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="source"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="success" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
