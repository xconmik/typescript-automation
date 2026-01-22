# Example Playwright logging code
await fetch('http://localhost:3000/api/history', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company_name: company,
    domain,
    agent: 'RocketReach Agent',
    disposition: 'Skipped',
    remarks: 'Proofpoint protected domain',
    headquarters: hq
  })
});
