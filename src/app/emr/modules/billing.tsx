import { CreditCard } from 'lucide-react';
import { ComingSoonPage } from './coming-soon';

export function BillingPage() {
  return (
    <ComingSoonPage
      title="Billing & Payments"
      description="Manage invoices, payments, and financial records"
      icon={CreditCard}
      actionButtons={[
        { label: 'Create Invoice', disabled: true },
        { label: 'View Payments', disabled: true },
      ]}
    />
  );
}
