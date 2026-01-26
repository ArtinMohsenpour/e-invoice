"use client";

import Link from "next/link";
import {
  DollarSign,
  FileText,
  Users,
  Clock,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Dummy Data
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    title: "Invoices",
    value: "+2350",
    change: "+180.1% from last month",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    title: "Active Clients",
    value: "+12,234",
    change: "+19% from last month",
    icon: Users,
    color: "text-orange-500",
  },
  {
    title: "Pending Invoices",
    value: "7",
    change: "2 overdue",
    icon: Clock,
    color: "text-yellow-500",
  },
];

const recentInvoices = [
  {
    id: "INV001",
    client: "Acme Corp",
    amount: "$250.00",
    status: "Paid",
    date: "Today, 10:42 AM",
  },
  {
    id: "INV002",
    client: "Globex Inc",
    amount: "$1,200.50",
    status: "Pending",
    date: "Yesterday, 4:00 PM",
  },
  {
    id: "INV003",
    client: "Soylent Corp",
    amount: "$450.00",
    status: "Overdue",
    date: "Oct 23, 2025",
  },
  {
    id: "INV004",
    client: "Initech",
    amount: "$3,100.00",
    status: "Paid",
    date: "Oct 21, 2025",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Link
            href="/invoices/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card text-card-foreground shadow-sm"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                {stat.title}
              </h3>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Invoices */}
        <div className="col-span-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Recent Invoices
            </h3>
            <p className="text-sm text-muted-foreground">
              You made 265 sales this month.
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-8">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-secondary/20 flex items-center justify-center text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {invoice.client}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.id}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-foreground">
                    {invoice.amount}
                  </div>
                  <div
                    className={`ml-4 text-xs font-medium px-2 py-1 rounded-full ${
                      invoice.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : invoice.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {invoice.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions / Recent Activity Placeholder */}
        <div className="col-span-3 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Recent Activity
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest actions on your account
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-8">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="relative mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                    {i !== 2 && (
                      <div className="absolute left-1 top-3 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Invoice #INV00{5 - i} created
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/activity"
                className="flex items-center justify-center w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View All Activity
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
