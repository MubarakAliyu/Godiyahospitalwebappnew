import { NursePatients } from './patients';

// OPD patients view - reusing the main patients component
// The patients component already handles OPD filtering
export function NurseOPDPatients() {
  return <NursePatients />;
}
