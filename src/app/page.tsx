"use client";

import React, { useState, useEffect, useRef } from "react";
import Login from "../login/login";
import { useAuth } from "@/AuthContext";
import { auth } from "../firebase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bell, Moon, Sun, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import TicketOverview from "@/components/dashboard/TicketOverview";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


export default function Dashboard() {
  const { user, loading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIdComponent, setShowIdComponent] = useState(false); // ✅ Toggle state

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && user) {
      const fetchTickets = async () => {
        setLoadingTickets(true);
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
          setLoadingTickets(false);
        }
      };
      fetchTickets();
    }
  }, [loading, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setProfileOpen(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const totalTickets = tickets.length;
  const newTickets = tickets.filter((t) => t.Status?.toLowerCase() === "new").length;
  const inProgressTickets = tickets.filter((t) => t.Status?.toLowerCase() === "in progress").length;
  const resolvedTickets = tickets.filter((t) => t.Status?.toLowerCase() === "resolved").length;

  if (loading) {
    return <p className="p-8 text-center">Checking authentication...</p>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Citimax IT Ticketing System</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="w-[200px] sm:w-[300px] pl-8"
              />
            </div>

            {/* Notifications */}
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

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="User profile"
              >
                <User className="h-5 w-5" />
              </Button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-background shadow-lg z-20">
                  <div className="px-4 py-2 text-sm text-muted-foreground break-words">
                    Signed in as <br />
                    <strong>{user.email}</strong>
                  </div>
                  <div className="border-t border-border"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted-foreground/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
              <div className="text-2xl font-bold">
                {loadingTickets ? "Loading..." : totalTickets}
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingTickets ? "Loading..." : newTickets}
              </div>
              <p className="text-xs text-muted-foreground">+2 in the last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingTickets ? "Loading..." : inProgressTickets}
              </div>
              <p className="text-xs text-muted-foreground">15 high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingTickets ? "Loading..." : resolvedTickets}
              </div>
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
            <TicketOverview />
          </TabsContent>
          <TabsContent value="new">
            <TicketOverview />
          </TabsContent>
          <TabsContent value="in-progress">
            <TicketOverview />
          </TabsContent>
          <TabsContent value="resolved">
            <TicketOverview />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
