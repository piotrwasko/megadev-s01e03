<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { findings } from '#lib/kb/investigation';
  import { tenantOf } from '#lib/kb/locales';

  const groups = findings(reports as Report[], tenantOf, notes.oneDayMove);
  const unique = uniqueById(reports as Report[]).filter((r) => r.mergedInto === 4471);
  const labels: Record<string, string> = {
    parser: 'Month-first shared parser in day-first tenants',
    hint: 'booking-v3 month-first hint contradicts tenant parsing',
    'day-shift': 'One-day shifts / premature invite (root cause unconfirmed)',
    unplaced: 'Needs manual investigation',
  };
</script>

<p>{reports.length} exported rows · {unique.length} distinct reports · {reports.length - unique.length} repeated rows. Count each report ID once.</p>
<table>
  <thead><tr><th>Finding</th><th>Reports</th><th>First received</th><th>Last received</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr><td>{labels[g.cause]}</td><td>{g.count}</td><td>{g.first}</td><td>{g.last}</td></tr>
    {/each}
  </tbody>
</table>

<h3>Evidence by finding</h3>
{#each groups as g (g.cause)}
  <details>
    <summary>{labels[g.cause]} — {g.count} report IDs</summary>
    <p>{g.reports.map((r) => r.id).join(', ')}</p>
  </details>
{/each}
