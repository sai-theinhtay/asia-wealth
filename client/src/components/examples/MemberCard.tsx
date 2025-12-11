import { MemberCard } from "../MemberCard";

// todo: remove mock functionality
const mockMember = {
  id: "1",
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "(555) 123-4567",
  vehicleCount: 2,
  serviceCount: 8,
  joinDate: "Jan 2024",
};

export default function MemberCardExample() {
  return (
    <MemberCard
      member={mockMember}
      onContact={(id) => console.log("Contact member:", id)}
      onViewProfile={(id) => console.log("View profile:", id)}
    />
  );
}
