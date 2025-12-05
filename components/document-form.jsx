"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_TYPES } from "@/lib/document-types";

const CATEGORIES = [
  "Personal",
  "Professional",
  "Travel",
  "Financial",
  "Vehicle",
  "Health",
  "Legal",
  "Other",
];

export default function DocumentForm({
  initialData = null,
  onSubmit,
  submitLabel = "Save Document",
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    number: "",
    issueDate: "",
    expiryDate: "",
    category: "",
    notes: "",
    //add reminders and emails
    reminder1Days: "",
    reminder1Emails: "",
    reminder2Days: "",
    reminder2Emails: "",
    reminder3Days: "",
    reminder3Emails: "",
  });

  const [types, setTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [newType, setNewType] = useState("");

  // Load types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoadingTypes(true);
        const res = await fetch("/api/document-types");
        if (!res.ok) throw new Error("Failed to load types");

        const data = await res.json();
        const names = Array.isArray(data) ? data.map((t) => t.name) : [];
        setTypes(names.length ? names : DEFAULT_TYPES);
      } catch (err) {
        console.error(err);
        setTypes(DEFAULT_TYPES);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, []);

  // Populate when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        number: initialData.number || "",
        issueDate: initialData.issueDate
          ? initialData.issueDate.slice(0, 10)
          : "",
        expiryDate: initialData.expiryDate
          ? initialData.expiryDate.slice(0, 10)
          : "",
        category: initialData.category || "",
        notes: initialData.notes || "",
        reminder1Days: initialData.reminder1Days || "",
        reminder1Emails: Array.isArray(initialData.reminder1Emails)
          ? initialData.reminder1Emails.join(", ")
          : "",
        reminder2Days: initialData.reminder2Days || "",
        reminder2Emails: Array.isArray(initialData.reminder2Emails)
          ? initialData.reminder2Emails.join(", ")
          : "",
        reminder3Days: initialData.reminder3Days || "",
        reminder3Emails: Array.isArray(initialData.reminder3Emails)
          ? initialData.reminder3Emails.join(", ")
          : "",
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddType = async () => {
    const value = newType.trim();
    if (!value) return;

    try {
      const res = await fetch("/api/document-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      });

      if (!res.ok) {
        console.error("Failed to add type");
        return;
      }

      const saved = await res.json();
      const typeName = saved.name || value;

      setTypes((prev) =>
        prev.includes(typeName) ? prev : [...prev, typeName]
      );

      setFormData((prev) => ({
        ...prev,
        type: typeName,
      }));

      setNewType("");
    } catch (err) {
      console.error("Error adding type:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.type &&
      formData.number &&
      formData.issueDate &&
      formData.expiryDate &&
      formData.category
    ) {
      onSubmit(formData);
    }
  };

  return (
    <>
    
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {/* Name + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Document Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Passport"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Number */}
        <div className="space-y-2">
          <Label htmlFor="number">Document Number *</Label>
          <Input
            id="number"
            name="number"
            placeholder="e.g., P123456789"
            value={formData.number}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date *</Label>
          <Input
            id="issueDate"
            name="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-4">
  {/* Category */}
  <div className="space-y-2">
    <Label htmlFor="category">Category *</Label>
    <Select 
      value={formData.category}
      onValueChange={(value) => handleSelectChange("category", value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Document Type */}
  <div className="space-y-2">
    <Label htmlFor="type">Document Type *</Label>
    <Select
      value={formData.type}
      onValueChange={(value) => handleSelectChange("type", value)}
      disabled={loadingTypes}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={loadingTypes ? "Loading..." : "Select type"}
        />
      </SelectTrigger>
      <SelectContent>
        {types.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Add New Type */}
  <div className="space-y-2">
    <Label>Add New Type</Label>
    <div className="flex gap-2">
      <Input
        placeholder="Add new type (e.g., PAN Card)"
        value={newType}
        onChange={(e) => setNewType(e.target.value)}
      />
      <Button
        type="button"
        variant="outline"
        className="whitespace-nowrap cursor-pointer"
        onClick={handleAddType}
      >
        Add
      </Button>
    </div>
  </div>
</div>


      {/* Reminders */}
      <div className="space-y-4 border rounded-lg p-4">
        <p className="font-medium text-sm">Reminder Settings (optional)</p>
        <p className="text-xs text-muted-foreground">
          Set how many days before expiry you want to be reminded (e.g. 60, 15,
          5) and which email(s) should receive the reminder.
        </p>

        {/* 1st Reminder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <Label htmlFor="reminder1Days">1st Reminder – Days before</Label>
            <Input
              id="reminder1Days"
              name="reminder1Days"
              type="number"
              placeholder="e.g. 60"
              value={formData.reminder1Days}
              onChange={handleInputChange}
              min={1}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label htmlFor="reminder1Emails">1st Reminder – Emails</Label>
            <Input
              id="reminder1Emails"
              name="reminder1Emails"
              placeholder="e.g. user1@mail.com, user2@mail.com"
              value={formData.reminder1Emails}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 2nd Reminder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <Label htmlFor="reminder2Days">2nd Reminder – Days before</Label>
            <Input
              id="reminder2Days"
              name="reminder2Days"
              type="number"
              placeholder="e.g. 15"
              value={formData.reminder2Days}
              onChange={handleInputChange}
              min={1}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label htmlFor="reminder2Emails">2nd Reminder – Emails</Label>
            <Input
              id="reminder2Emails"
              name="reminder2Emails"
              placeholder="e.g. owner@mail.com"
              value={formData.reminder2Emails}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 3rd Reminder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <Label htmlFor="reminder3Days">3rd Reminder – Days before</Label>
            <Input
              id="reminder3Days"
              name="reminder3Days"
              type="number"
              placeholder="e.g. 5"
              value={formData.reminder3Days}
              onChange={handleInputChange}
              min={1}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label htmlFor="reminder3Emails">3rd Reminder – Emails</Label>
            <Input
              id="reminder3Emails"
              name="reminder3Emails"
              placeholder="e.g. me@mail.com"
              value={formData.reminder3Emails}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add any additional notes..."
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => history.back()}
        >
          Cancel
        </Button>
        <Button className="cursor-pointer" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
    </>
  );
}
