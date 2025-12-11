import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ClientHistory() {
  const { toast } = useToast();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMine(); }, []);

  async function fetchMine() {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/mine');
      if (!res.ok) throw new Error('Failed to load history');
      const data = await res.json();
      setReports(data);
    } catch (err: any) {
      toast({ title: 'Failed', description: err?.message || String(err), variant: 'destructive' });
    } finally { setLoading(false); }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Reports / History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            reports.length === 0 ? <p>No history available</p> : (
              <ul className="space-y-3">
                {reports.map(r => (
                  <li key={r.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{r.title}</h4>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                        <p className="text-xs text-muted-foreground">Status: {r.status}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
