import { Bell } from 'lucide-react';
import { ComingSoonPage } from './coming-soon';

export function NotificationsPage() {
  return (
    <ComingSoonPage
      title="Notifications Center"
      description="View and manage all system notifications"
      icon={Bell}
      actionButtons={[
        { label: 'Mark All Read', disabled: true },
        { label: 'Notification Settings', disabled: true },
      ]}
    />
  );
}
