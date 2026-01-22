import { useState } from 'react';

export default function AddHistoryLog({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    company_name: '',
    domain: '',
    agent: '',
    disposition: '',
    remarks: '',
    headquarters: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('Log added!');
        setForm({ company_name: '', domain: '', agent: '', disposition: '', remarks: '', headquarters: '' });
        if (onSuccess) onSuccess();
      } else {
        setStatus('Failed to add log.');
      }
    } catch {
      setStatus('Failed to connect to backend.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Add History Log</h2>
      <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company Name" className="block w-full mb-2 p-2 border rounded" required />
      <input name="domain" value={form.domain} onChange={handleChange} placeholder="Domain" className="block w-full mb-2 p-2 border rounded" required />
      <input name="agent" value={form.agent} onChange={handleChange} placeholder="Agent" className="block w-full mb-2 p-2 border rounded" required />
      <input name="disposition" value={form.disposition} onChange={handleChange} placeholder="Disposition" className="block w-full mb-2 p-2 border rounded" required />
      <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="Remarks" className="block w-full mb-2 p-2 border rounded" />
      <input name="headquarters" value={form.headquarters} onChange={handleChange} placeholder="Headquarters" className="block w-full mb-2 p-2 border rounded" />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Add Log</button>
      {status && <div className="mt-2 text-sm">{status}</div>}
    </form>
  );
}
