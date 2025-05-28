"use client";

import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  ticketId: string;
  type: "status_change" | "assignment" | "comment";
}

interface NotificationsPanelProps {
  notifications?: Notification[];
  onNotificationClick?: (ticketId: string) => void;
  onMarkAllAsRead?: () => void;
}

export default function NotificationsPanel({
  notifications = [
    {
      id: "1",
      title: "Ticket Status Updated",
      message: "Ticket #1234 has been marked as In Progress",
      time: "5 minutes ago",
      read: false,
      ticketId: "1234",
      type: "status_change",
    },
    {
      id: "2",
      title: "New Assignment",
      message: "You have been assigned to Ticket #5678",
      time: "1 hour ago",
      read: false,
      ticketId: "5678",
      type: "assignment",
    },
    {
      id: "3",
      title: "New Comment",
      message: "John Doe commented on Ticket #9012",
      time: "3 hours ago",
      read: true,
      ticketId: "9012",
      type: "comment",
    },
    {
      id: "4",
      title: "Ticket Resolved",
      message: "Ticket #3456 has been marked as Resolved",
      time: "1 day ago",
      read: true,
      ticketId: "3456",
      type: "status_change",
    },
    {
      id: "5",
      title: "New Assignment",
      message: "You have been assigned to Ticket #7890",
      time: "2 days ago",
      read: true,
      ticketId: "7890",
      type: "assignment",
    },
  ],
  onNotificationClick = () => {},
  onMarkAllAsRead = () => {},
}: NotificationsPanelProps) {
  const [open, setOpen] = useState(false);
  const [localNotifications, setLocalNotifications] =
    useState<Notification[]>(notifications);

  const unreadCount = localNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read locally
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );

    // Call the provided handler with the ticket ID
    onNotificationClick(notification.ticketId);
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllAsRead();
  };

  return (
    <div className="bg-background">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-sm"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
            {localNotifications.length > 0 ? (
              <div className="space-y-4">
                {localNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${notification.read ? "bg-background" : "bg-accent"} cursor-pointer`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="text-xs">
                        {notification.type === "status_change" &&
                          "Status Update"}
                        {notification.type === "assignment" && "Assignment"}
                        {notification.type === "comment" && "Comment"}
                      </Badge>
                      {!notification.read && (
                        <Badge className="bg-primary text-xs">New</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
