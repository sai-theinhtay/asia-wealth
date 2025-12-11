import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function OwnerDashboard() {
  const { toast } = useToast();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      if (!res.ok) throw new Error('Failed to load reports');
      const data = await res.json();
      setReports(data);
    } catch (err: any) {
      toast({ title: 'Failed', description: err?.message || String(err), variant: 'destructive' });
    } finally { setLoading(false); }
  }

  async function markResolved(id: string) {
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'resolved' }) });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setReports((prev) => prev.map(r => r.id === updated.id ? updated : r));
      toast({ title: 'Updated', description: 'Report marked resolved' });
    } catch (err: any) {
      toast({ title: 'Failed', description: err?.message || String(err), variant: 'destructive' });
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Owner Dashboard — Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? <p>Loading...</p> : (
            reports.length === 0 ? <p>No reports yet</p> : (
              <div className="space-y-3">
                {reports.map(r => (
                  <div key={r.id} className="border rounded-md p-3 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                      <p className="text-xs text-muted-foreground">Reported by {r.reporterType} ({r.reporterId}) — {new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`mb-2 ${r.status === 'open' ? 'text-yellow-600' : 'text-green-600'}`}>{r.status}</p>
                      {r.status !== 'resolved' && <Button onClick={() => markResolved(r.id)}>Mark Resolved</Button>}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
