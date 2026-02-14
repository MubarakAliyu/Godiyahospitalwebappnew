import { useEMRStore } from '@/app/emr/store/emr-store';
import type { Patient } from '@/app/emr/store/types';
import { useNavigate } from 'react-router';
import { differenceInYears } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { UsersRound, X, Phone, MapPin, User, Eye } from 'lucide-react';

interface FamilySubfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyFile: Patient | null;
}

export function FamilySubfilesModal({ isOpen, onClose, familyFile }: FamilySubfilesModalProps) {
  const navigate = useNavigate();
  const { patients } = useEMRStore();

  if (!familyFile) return null;

  // Get all subfiles for this family - using parentFileId NOT familyFileId
  const subfiles = patients.filter(
    (p) => p.fileType === 'Individual' && p.parentFileId === familyFile.id
  );

  const handleViewFile = (patient: Patient) => {
    navigate(`/emr/dashboard/patients/${patient.id}`);
    onClose();
  };

  const getAge = (dateOfBirth: string) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };

  const getStatusBadge = (patient: Patient) => {
    if (patient.isDeceased) {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">Deceased</Badge>;
    }

    const variants: Record<string, any> = {
      Active: { className: 'bg-green-100 text-green-700 hover:bg-green-100 text-xs' },
      Admitted: { className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs' },
      ICU: { className: 'bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs' },
      Discharged: { className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs' },
    };

    return <Badge {...(variants[patient.status] || variants.Active)}>{patient.status}</Badge>;
  };

  const getRelationshipBadge = (relationship?: string) => {
    if (!relationship) return <span className="text-muted-foreground text-xs">-</span>;
    
    const colors: Record<string, string> = {
      'Self': 'bg-purple-100 text-purple-700',
      'Spouse': 'bg-pink-100 text-pink-700',
      'Child': 'bg-blue-100 text-blue-700',
      'Parent': 'bg-green-100 text-green-700',
      'Sibling': 'bg-yellow-100 text-yellow-700',
      'Other': 'bg-gray-100 text-gray-700',
    };

    const colorClass = colors[relationship] || colors['Other'];
    return <Badge className={`${colorClass} hover:${colorClass} text-xs`}>{relationship}</Badge>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-border px-6 py-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <UsersRound className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">Family Subfiles</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {familyFile.fullName} ({familyFile.id})
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Family Summary Info */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <UsersRound className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Members</p>
                      <p className="text-lg font-semibold text-purple-900">{subfiles.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="text-sm font-medium text-blue-900">{familyFile.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium text-green-900 truncate">{familyFile.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-300px)]">
                {subfiles.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <User className="w-16 h-16 text-muted-foreground" />
                      <p className="text-lg font-medium">No Family Members Found</p>
                      <p className="text-sm text-muted-foreground">
                        This family file doesn't have any individual subfiles yet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">S/N</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">File No</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Full Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Relationship</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Gender</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Age</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {subfiles.map((patient, index) => (
                            <motion.tr
                              key={patient.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm">{index + 1}</td>
                              <td className="px-4 py-3 text-sm font-medium text-blue-600">{patient.id}</td>
                              <td className="px-4 py-3 text-sm font-medium">{patient.fullName}</td>
                              <td className="px-4 py-3">{getRelationshipBadge(patient.relationshipToHead)}</td>
                              <td className="px-4 py-3 text-sm">{patient.gender}</td>
                              <td className="px-4 py-3 text-sm">{getAge(patient.dateOfBirth)} years</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{patient.phoneNumber}</td>
                              <td className="px-4 py-3">{getStatusBadge(patient)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewFile(patient)}
                                    className="text-xs"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View File
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-muted/50 px-6 py-4 flex items-center justify-between gap-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {subfiles.length} family member{subfiles.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}