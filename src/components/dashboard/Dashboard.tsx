"use client";

import { useTranslations } from "next-intl";
import { 
  BarChart3, 
  FileText, 
  Upload, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Bell
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Dummy Data
const STATS = [
  {
    label: "Total Invoices",
    value: "1,248",
    change: "+12%",
    trend: "up",
    icon: FileText,
  },
  {
    label: "Processing",
    value: "24",
    change: "-5%",
    trend: "down",
    icon: Upload,
  },
  {
    label: "Success Rate",
    value: "99.8%",
    change: "+0.2%",
    trend: "up",
    icon: BarChart3,
  },
  {
    label: "Total Volume",
    value: "€4.2M",
    change: "+18%",
    trend: "up",
    icon: ArrowUpRight,
  },
];

const INVOICES = [
  {
    id: "INV-2024-001",
    client: "Acme Corp GmbH",
    amount: "€12,500.00",
    date: "2024-01-15",
    status: "completed",
    type: "ZUGFeRD",
  },
  {
    id: "INV-2024-002",
    client: "Berlin Tech Solutions",
    amount: "€3,250.50",
    date: "2024-01-14",
    status: "processing",
    type: "XRechnung",
  },
  {
    id: "INV-2024-003",
    client: "Hamburg Logistics",
    amount: "€8,900.00",
    date: "2024-01-14",
    status: "completed",
    type: "ZUGFeRD",
  },
  {
    id: "INV-2024-004",
    client: "Munich Automotive",
    amount: "€45,000.00",
    date: "2024-01-13",
    status: "failed",
    type: "XRechnung",
  },
  {
    id: "INV-2024-005",
    client: "Stuttgart Engineering",
    amount: "€2,100.00",
    date: "2024-01-12",
    status: "completed",
    type: "ZUGFeRD",
  },
];

export default function Dashboard() {
  // t() placeholders would go here
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-muted/20 pb-12 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your invoicing activities</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background"></span>
             </button>
             <button className="p-2 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Settings className="w-5 h-5" />
             </button>
             <Link
               href="/dashboard/new" 
               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm"
             >
                <Plus className="w-4 h-4" />
                New Invoice
             </Link>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={cn(
                  "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                  stat.trend === "up" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* RECENT INVOICES SECTION */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Invoices</h2>
              <p className="text-sm text-muted-foreground">Manage your latest conversions and exports</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search invoice..." 
                  className="pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Format</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INVOICES.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{invoice.id}</td>
                    <td className="px-6 py-4">{invoice.client}</td>
                    <td className="px-6 py-4 font-medium">{invoice.amount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{invoice.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {invoice.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                        invoice.status === "completed" && "bg-green-50 text-green-700 border-green-100",
                        invoice.status === "processing" && "bg-yellow-50 text-yellow-700 border-yellow-100",
                        invoice.status === "failed" && "bg-red-50 text-red-700 border-red-100",
                      )}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
             <span>Showing 5 of 128 results</span>
             <div className="flex gap-1">
                <button className="px-3 py-1 rounded border border-border bg-background hover:bg-muted disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 rounded border border-border bg-background hover:bg-muted">Next</button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
