import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "@/types";
import { Label } from "@/components/ui/label";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticket }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Open");
  const [currentAssignee, setCurrentAssignee] = useState("");

  // Sync local state when `ticket` changes or modal opens
  useEffect(() => {
    if (ticket) {
      setEditedTitle(ticket.title);
      setEditedDescription(ticket.description);
      setCurrentStatus(ticket.status || "Open");
      setCurrentAssignee(ticket.assignee || "");
    } else {
      setEditedTitle("");
      setEditedDescription("");
      setCurrentStatus("Open");
      setCurrentAssignee("");
    }
  }, [ticket, isOpen]);

  // IMPORTANT: Don't return null when ticket is null,
  // so the modal structure still renders and can open/close properly.

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditingTitle ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer text-xl font-bold"
              >
                {editedTitle || "No Title"}
              </h2>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditingDescription ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={() => setIsEditingDescription(false)}
                autoFocus
              />
            ) : (
              <p
                onClick={() => setIsEditingDescription(true)}
                className="cursor-pointer text-sm text-muted-foreground"
              >
                {editedDescription || "No Description"}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Status</Label>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full border rounded-md px-2 py-1"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <Label>Assignee</Label>
            <Input
              value={currentAssignee}
              onChange={(e) => setCurrentAssignee(e.target.value)}
              placeholder="Enter assignee name"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              console.log("Saving all changes", {
                title: editedTitle,
                description: editedDescription,
                status: currentStatus,
                assignee: currentAssignee,
              });
              onClose();
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
