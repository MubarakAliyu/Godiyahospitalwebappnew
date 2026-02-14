import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { 
  FileText,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Pill,
  FlaskConical,
  Stethoscope,
  Bed,
  Filter,
  BarChart3,
  PieChart,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

// Report Type
type ReportType = 
  | 'daily-summary'
  | 'payment-breakdown'
  | 'revenue-analysis'
  | 'patient-payments'
  | 'service-wise'
  | 'payment-methods';

interface ReportTemplate {
  id: ReportType;
  title: string;
  description: string;
  icon: typeof FileText;
  color: string;
  bgColor: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'daily-summary',
    title: 'Daily Payment Summary',
    description: 'Overview of all payments collected today',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'payment-breakdown',
    title: 'Payment Breakdown',
    description: 'Detailed breakdown by payment categories',
    icon: PieChart,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'revenue-analysis',
    title: 'Revenue Analysis',
    description: 'Revenue trends and analysis over time',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 'patient-payments',
    title: 'Patient Payment History',
    description: 'Complete payment history by patient',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'service-wise',
    title: 'Service-wise Report',
    description: 'Payments grouped by service type',
    icon: Activity,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    id: 'payment-methods',
    title: 'Payment Methods Report',
    description: 'Analysis of payment methods used',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  }
];

export function CashierReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  // Mock data for reports
  const todayStats = {
    totalRevenue: 487350,
    totalTransactions: 23,
    filePayments: 45000,
    consultations: 98000,
    laboratory: 156500,
    pharmacy: 112850,
    bedAdmission: 43000,
    admissionCharges: 32000,
    cashPayments: 15,
    cardPayments: 6,
    transferPayments: 2
  };

  const serviceWiseData = [
    { service: 'File Registration', count: 9, amount: 45000, icon: FileText },
    { service: 'Consultations', count: 14, amount: 98000, icon: Stethoscope },
    { service: 'Laboratory', count: 22, amount: 156500, icon: FlaskConical },
    { service: 'Pharmacy', count: 18, amount: 112850, icon: Pill },
    { service: 'Bed Admission', count: 4, amount: 43000, icon: Bed },
    { service: 'Admission Charges', count: 8, amount: 32000, icon: Activity }
  ];

  const paymentMethodsData = [
    { method: 'Cash', count: 15, amount: 298450, percentage: 61.2 },
    { method: 'Card', count: 6, amount: 145900, percentage: 29.9 },
    { method: 'Transfer', count: 2, amount: 43000, percentage: 8.8 }
  ];

  const recentTransactions = [
    { id: '1', time: '14:35', type: 'Pharmacy', patient: 'Aisha Mohammed', amount: 5650, method: 'Cash' },
    { id: '2', time: '14:22', type: 'Laboratory', patient: 'Ibrahim Suleiman', amount: 8500, method: 'Card' },
    { id: '3', time: '14:10', type: 'Consultation', patient: 'Fatima Abdullahi', amount: 7000, method: 'Cash' },
    { id: '4', time: '13:55', type: 'Bed Admission', patient: 'Musa Garba', amount: 40000, method: 'Transfer' },
    { id: '5', time: '13:40', type: 'File Registration', patient: 'Zainab Usman', amount: 5000, method: 'Cash' },
  ];

  const handleGenerateReport = (reportType: ReportType) => {
    setSelectedReport(reportType);
    toast.success('Report Generated', {
      description: `${reportTemplates.find(r => r.id === reportType)?.title} has been generated successfully`,
    });
  };

  const handlePrintReport = () => {
    if (!selectedReport) {
      toast.error('No Report Selected', {
        description: 'Please select a report to print',
      });
      return;
    }
    toast.success('Printing Report', {
      description: 'Report has been sent to the printer',
    });
  };

  const handleExportPDF = () => {
    if (!selectedReport) {
      toast.error('No Report Selected', {
        description: 'Please select a report to export',
      });
      return;
    }
    toast.success('Exporting PDF', {
      description: 'Report is being exported as PDF',
    });
  };

  const handleExportExcel = () => {
    if (!selectedReport) {
      toast.error('No Report Selected', {
        description: 'Please select a report to export',
      });
      return;
    }
    toast.success('Exporting Excel', {
      description: 'Report is being exported as Excel file',
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Reports</h1>
          <p className="text-muted-foreground">
            Generate and view comprehensive payment reports
          </p>
        </div>
        {selectedReport && (
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={handlePrintReport}>
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold">₦{todayStats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{todayStats.totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Service</p>
                  <p className="text-lg font-bold">Laboratory</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Transaction</p>
                  <p className="text-lg font-bold">₦{Math.round(todayStats.totalRevenue / todayStats.totalTransactions).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Date Range
          </CardTitle>
          <CardDescription>Select date range for reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div>
        <h2 className="text-xl font-bold mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTemplates.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedReport === report.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleGenerateReport(report.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${report.bgColor}`}>
                      <report.icon className={`w-6 h-6 ${report.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <Button 
                        size="sm" 
                        variant={selectedReport === report.id ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(report.id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Report Display Area */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {reportTemplates.find(r => r.id === selectedReport)?.title}
                  </CardTitle>
                  <CardDescription>
                    Report Period: {new Date(dateFrom).toLocaleDateString()} - {new Date(dateTo).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Generated: {new Date().toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {selectedReport === 'daily-summary' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Revenue Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Total Revenue</span>
                            <span className="font-bold text-xl text-primary">₦{todayStats.totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Total Transactions</span>
                            <span className="font-semibold">{todayStats.totalTransactions}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Average per Transaction</span>
                            <span className="font-semibold">₦{Math.round(todayStats.totalRevenue / todayStats.totalTransactions).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Payment Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Cash Payments</span>
                            <span className="font-semibold">{todayStats.cashPayments} transactions</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Card Payments</span>
                            <span className="font-semibold">{todayStats.cardPayments} transactions</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Bank Transfers</span>
                            <span className="font-semibold">{todayStats.transferPayments} transactions</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentTransactions.map((txn) => (
                            <TableRow key={txn.id}>
                              <TableCell className="font-medium">{txn.time}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{txn.type}</Badge>
                              </TableCell>
                              <TableCell>{txn.patient}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{txn.method}</Badge>
                              </TableCell>
                              <TableCell className="text-right font-bold">₦{txn.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport === 'service-wise' && (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-center">Transactions</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceWiseData.map((service) => (
                        <TableRow key={service.service}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <service.icon className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold">{service.service}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{service.count}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-secondary">
                            ₦{service.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">
                              {((service.amount / todayStats.totalRevenue) * 100).toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-center">{todayStats.totalTransactions}</TableCell>
                        <TableCell className="text-right text-primary">₦{todayStats.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedReport === 'payment-methods' && (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-center">Transactions</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentMethodsData.map((method) => (
                        <TableRow key={method.method}>
                          <TableCell className="font-semibold">{method.method}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{method.count}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-secondary">
                            ₦{method.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">{method.percentage}%</span>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-center">{todayStats.totalTransactions}</TableCell>
                        <TableCell className="text-right text-primary">₦{todayStats.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              {(selectedReport === 'payment-breakdown' || selectedReport === 'revenue-analysis' || selectedReport === 'patient-payments') && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">Report Preview</p>
                  <p>This report type will display detailed data based on the selected date range.</p>
                  <p className="mt-2">Use the Print or Export buttons to generate the full report.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!selectedReport && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold mb-2">No Report Selected</p>
            <p>Select a report template above to generate and view reports</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
