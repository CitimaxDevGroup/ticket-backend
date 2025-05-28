"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Paperclip, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TicketCreationFormProps {
  onSubmit?: (ticketData: TicketData) => void;
  onCancel?: () => void;
}

interface TicketData {
  issueType: string;
  description: string;
  priority: string;
  attachments: File[];
}

interface FilePreview {
  file: File;
  preview: string;
}

export default function TicketCreationForm({
  onSubmit = () => {},
  onCancel = () => {},
}: TicketCreationFormProps) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<FilePreview[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);

      // Create previews for the files
      const newPreviews = newFiles.map((file) => {
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      });

      setFilePreview([...filePreview, ...newPreviews]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setAttachments(attachments.filter((file) => file !== fileToRemove));
    setFilePreview(filePreview.filter((item) => item.file !== fileToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!issueType) {
      setError("Please select an issue type");
      return;
    }

    if (!description) {
      setError("Please provide a description");
      return;
    }

    if (!priority) {
      setError("Please select a priority level");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const ticketData: TicketData = {
        issueType,
        description,
        priority,
        attachments,
      };

      onSubmit(ticketData);
      setIsSubmitting(false);

      // Reset form
      setIssueType("");
      setDescription("");
      setPriority("");
      setAttachments([]);
      setFilePreview([]);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-2xl bg-background">
      <CardHeader>
        <CardTitle>Create New Support Ticket</CardTitle>
        <CardDescription>
          Fill out the form below to submit a new IT support request.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="issueType">Issue Type</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger id="issueType">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hardware">Hardware Problem</SelectItem>
                <SelectItem value="software">Software Issue</SelectItem>
                <SelectItem value="network">Network Connectivity</SelectItem>
                <SelectItem value="access">Access Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please describe your issue in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
              >
                <Paperclip className="h-4 w-4" />
                <span>Add Files</span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {filePreview.length > 0 && (
              <div className="mt-2 space-y-2">
                {filePreview.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <span className="text-sm truncate max-w-[80%]">
                      {item.file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(item.file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
