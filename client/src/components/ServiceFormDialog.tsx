import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ServiceFormData) => void;
}

interface ServiceFormData {
  customer: string;
  vehicle: string;
  serviceType: string;
  date: string;
  mechanic: string;
  notes: string;
  estimatedCost: string;
}

export function ServiceFormDialog({ open, onOpenChange, onSubmit }: ServiceFormDialogProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    customer: "",
    vehicle: "",
    serviceType: "",
    date: "",
    mechanic: "",
    notes: "",
    estimatedCost: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData({ customer: "", vehicle: "", serviceType: "", date: "", mechanic: "", notes: "", estimatedCost: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Service</DialogTitle>
          <DialogDescription>
            Create a new service appointment for a customer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name *</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="John Smith"
                  required
                  data-testid="input-customer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle *</Label>
                <Input
                  id="vehicle"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  placeholder="2023 Honda Accord"
                  required
                  data-testid="input-vehicle"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                >
                  <SelectTrigger data-testid="select-service-type">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil-change">Oil Change</SelectItem>
                    <SelectItem value="brake-service">Brake Service</SelectItem>
                    <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                    <SelectItem value="full-inspection">Full Inspection</SelectItem>
                    <SelectItem value="engine-repair">Engine Repair</SelectItem>
                    <SelectItem value="transmission">Transmission Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  data-testid="input-date"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mechanic">Assigned Mechanic</Label>
                <Select
                  value={formData.mechanic}
                  onValueChange={(value) => setFormData({ ...formData, mechanic: value })}
                >
                  <SelectTrigger data-testid="select-mechanic">
                    <SelectValue placeholder="Select mechanic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                    <SelectItem value="david">David Chen</SelectItem>
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  placeholder="150"
                  data-testid="input-estimated-cost"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional service notes..."
                className="resize-none"
                rows={3}
                data-testid="textarea-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-service">
              Schedule Service
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
