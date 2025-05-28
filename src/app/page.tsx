"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import TicketOverview from "@/components/dashboard/TicketOverview";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Dashboard() {
  const [theme, setTheme] = React.useState("light");
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  React.useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://api.sheetbest.com/sheets/53d1c70b-ebb2-4a25-8afd-32ffb7da9065"
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets by status with case-insensitive string compare
  const totalTickets = tickets.length;
  const newTickets = tickets.filter(
    (t) => t.Status?.toLowerCase() === "new"
  ).length;
  const inProgressTickets = tickets.filter(
    (t) => t.Status?.toLowerCase() === "in progress"
  ).length;
  const resolvedTickets = tickets.filter(
    (t) => t.Status?.toLowerCase() === "resolved"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Citimax IT Ticketing System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="w-[200px] sm:w-[300px] pl-8"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <NotificationsPanel />
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Manage and track IT support requests.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : totalTickets}</div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : newTickets}</div>
              <p className="text-xs text-muted-foreground">+2 in the last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : inProgressTickets}</div>
              <p className="text-xs text-muted-foreground">15 high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : resolvedTickets}</div>
              <p className="text-xs text-muted-foreground">Avg resolution: 3.2 hours</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TicketOverview filter="all" tickets={tickets} loading={loading} />
          </TabsContent>
          <TabsContent value="new">
            <TicketOverview filter="new" tickets={tickets} loading={loading} />
          </TabsContent>
          <TabsContent value="in-progress">
            <TicketOverview filter="in-progress" tickets={tickets} loading={loading} />
          </TabsContent>
          <TabsContent value="resolved">
            <TicketOverview filter="resolved" tickets={tickets} loading={loading} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
