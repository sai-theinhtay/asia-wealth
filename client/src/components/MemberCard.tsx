import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, Car, Wrench } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleCount: number;
  serviceCount: number;
  joinDate: string;
}

interface MemberCardProps {
  member: Member;
  onContact?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

export function MemberCard({ member, onContact, onViewProfile }: MemberCardProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="hover-elevate" data-testid={`member-card-${member.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{member.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                {member.vehicleCount} vehicles
              </span>
              <span className="flex items-center gap-1">
                <Wrench className="h-3 w-3" />
                {member.serviceCount} services
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onContact?.(member.id)}
            data-testid={`button-contact-${member.id}`}
          >
            <Phone className="h-3 w-3 mr-2" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onContact?.(member.id)}
            data-testid={`button-email-${member.id}`}
          >
            <Mail className="h-3 w-3 mr-2" />
            Email
          </Button>
          <Button
            size="sm"
            onClick={() => onViewProfile?.(member.id)}
            data-testid={`button-profile-${member.id}`}
          >
            Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
