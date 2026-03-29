import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Invoice, mockInvoices } from "../lib/mockData";

type FilterTab = "all" | "paid" | "pending" | "overdue";

const statusBadge: Record<Invoice["status"], string> = {
  paid: "bg-success/10 text-success border-success/30",
  pending: "bg-warning/10 text-warning border-warning/30",
  overdue: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function FeesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered =
    activeTab === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === activeTab);

  const totalBilled = invoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status !== "paid")
    .reduce((s, i) => s + i.amount, 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  function openPaymentDialog(invoice: Invoice) {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  }

  function confirmPayment() {
    if (!selectedInvoice) return;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              status: "paid",
              paidDate: new Date().toISOString().split("T")[0],
            }
          : inv,
      ),
    );
    toast.success(`Payment recorded for ${selectedInvoice.studentName}`, {
      description: `$${selectedInvoice.amount.toLocaleString()} – ${selectedInvoice.description}`,
    });
    setDialogOpen(false);
    setSelectedInvoice(null);
  }

  const statCards = [
    {
      label: "Total Billed",
      value: `$${totalBilled.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Collected",
      value: `$${totalCollected.toLocaleString()}`,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Outstanding",
      value: `$${outstanding.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Overdue Invoices",
      value: overdueCount,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Fees &amp; Finance
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track invoices, record payments, and manage student fees
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-card rounded-xl border border-border shadow-card p-4"
            data-ocid={`fees.${card.label
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "")}.card`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                {card.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}
              >
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Invoices Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border shadow-card p-5"
      >
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-semibold text-foreground">Invoices</h2>
            <TabsList data-ocid="fees.filter.tab">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </div>

          {(["all", "paid", "pending", "overdue"] as FilterTab[]).map((tab) => (
            <TabsContent key={tab} value={tab}>
              {filtered.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="fees.empty_state"
                >
                  <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No invoices found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="fees.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Grade
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Description
                        </TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Due Date
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((inv, i) => (
                        <TableRow key={inv.id} data-ocid={`fees.item.${i + 1}`}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {inv.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {inv.studentName}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                            {inv.grade}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {inv.description}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${inv.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                            {inv.dueDate}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize text-xs ${statusBadge[inv.status]}`}
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {inv.status !== "paid" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7"
                                onClick={() => openPaymentDialog(inv)}
                                data-ocid={`fees.open_modal_button.${i + 1}`}
                              >
                                Record Payment
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {inv.paidDate}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="fees.dialog">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Confirm payment details for this invoice.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Student Name</Label>
                <Input
                  value={selectedInvoice.studentName}
                  readOnly
                  className="bg-accent"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input
                  value={selectedInvoice.description}
                  readOnly
                  className="bg-accent"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Amount</Label>
                <Input
                  value={`$${selectedInvoice.amount.toLocaleString()}`}
                  readOnly
                  className="bg-accent font-semibold"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="fees.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={confirmPayment} data-ocid="fees.confirm_button">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
