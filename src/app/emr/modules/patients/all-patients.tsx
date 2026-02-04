import { motion } from 'motion/react';
import { Users, Plus, Search, Filter, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

export function AllPatientsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            All Patients
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all hospital patients (IPD, OPD, ER, ICU, COPD)
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Register New Patient
        </Button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, ID, phone number..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter by Type
        </Button>
      </motion.div>

      {/* Coming Soon Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              The unified all patients view is currently under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                All Patients Module
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This feature will provide a unified view of all patients across different departments
                (IPD, OPD, ER, ICU, COPD) with advanced filtering, comprehensive patient profiles,
                and quick access to patient records and history.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
