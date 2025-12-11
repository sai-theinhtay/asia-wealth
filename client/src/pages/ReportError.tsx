import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ReportError() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message || res.statusText || 'Failed to submit report');
      }
      toast({ title: 'Report submitted', description: 'Thank you — the team will review the report.' });
      setLocation('/member-portal');
    } catch (err: any) {
      toast({ title: 'Submit failed', description: err?.message || String(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" className="w-full rounded-md border p-2" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Report'}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
