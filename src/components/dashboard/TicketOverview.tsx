"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Clock, Filter, Search } from "lucide-react";
import TicketDetail from "@/components/tickets/TicketDetail";

const SHEET_BEST_URL =
  "https://api.sheetbest.com/sheets/53d1c70b-ebb2-4a25-8afd-32ffb7da9065";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
  company?: string;
}

const COMPANY_ORDER = [
  "CITIMAX",
  "DND ORE",
  "DND ETON",
  "DND Rallos",
  "DND Vertis",
  "DND Cebu",
  "DND Tanay",
  "Monte",
  "Compounding",
  "Laboratory",
  "Oriental",
  "Alishan",
  "Citinickel",
];

export default function TicketOverview() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const response = await fetch(SHEET_BEST_URL);
      const data = await response.json();
      const mapped = data.map((row: any, idx: number) => ({
        id: `T-${1000 + idx}`,
        title: row.Subject || "No subject",
        description: row.Description || "No description",
        status: row.Status.toLowerCase(),
        priority: mapPriority(row.Priority),
        createdAt: row.Timestamp || new Date().toISOString(),
        assignedTo: row.Name || "",
        company: row.Company || "Unknown",
      }));
      setTickets(mapped);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }

  function mapPriority(p: string): "low" | "medium" | "high" {
    if (!p) return "low";
    const normalized = p.toLowerCase();
    if (normalized.includes("low")) return "low";
    if (normalized.includes("med")) return "medium";
    return "high";
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  function handleTicketClick(ticketId: string) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsDetailModalOpen(true);
    }
  }

  function renderTicketList(tickets: Ticket[]) {
    if (tickets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-muted-foreground mb-4">
            No tickets found matching your criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setActiveTab("all");
              setPriorityFilter("all");
              setCompanyFilter("all");
              setSearchQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={() => handleTicketClick(ticket.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(ticket.status)}
                  <h3 className="font-medium">{ticket.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {ticket.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>ID: {ticket.id}</span>
                  <span>•</span>
                  <span>
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  {ticket.assignedTo && (
                    <>
                      <span>•</span>
                      <span>Assigned to: {ticket.assignedTo}</span>
                    </>
                  )}
                  {ticket.company && (
                    <>
                      <span>•</span>
                      <span>Company: {ticket.company}</span>
                    </>
                  )}
                </div>
              </div>
              <div>{getPriorityBadge(ticket.priority)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const uniqueCompanies = Array.from(new Set(tickets.map((t) => t.company))).sort(
    (a, b) => COMPANY_ORDER.indexOf(a) - COMPANY_ORDER.indexOf(b)
  );

  const applyFilters = (status: string) =>
    tickets.filter((ticket) => {
      if (status !== "all" && ticket.status !== status) return false;
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter) return false;
      if (companyFilter !== "all" && ticket.company !== companyFilter) return false;
      if (
        searchQuery &&
        !ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

  return (
    <div className="w-full bg-background p-4">
      {selectedTicket && (
        <TicketDetail
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          ticketId={selectedTicket.id}
          title={selectedTicket.title}
          description={selectedTicket.description}
          status={selectedTicket.status}
          priority={selectedTicket.priority}
          createdAt={selectedTicket.createdAt}
          assignedTo={
            selectedTicket.assignedTo
              ? {
                  name: selectedTicket.assignedTo,
                  initials: selectedTicket.assignedTo
                    .split(" ")
                    .map((n) => n[0])
                    .join(""),
                }
              : undefined
          }
        />
      )}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold">Ticket Overview</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent portal={false}>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent portal={false}>
                    <SelectItem value="all">All Companies</SelectItem>
                    {uniqueCompanies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value="all">{renderTicketList(applyFilters("all"))}</TabsContent>
            <TabsContent value="new">{renderTicketList(applyFilters("new"))}</TabsContent>
            <TabsContent value="in-progress">{renderTicketList(applyFilters("in-progress"))}</TabsContent>
            <TabsContent value="resolved">{renderTicketList(applyFilters("resolved"))}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
