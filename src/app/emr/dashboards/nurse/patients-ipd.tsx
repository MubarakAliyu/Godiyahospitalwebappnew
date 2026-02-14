import { NursePatients } from './patients';

// IPD patients view - reusing the main patients component
// The patients component already handles IPD filtering
export function NurseIPDPatients() {
  return <NursePatients />;
}
