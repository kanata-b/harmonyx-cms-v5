"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ContentTableProps {
  type: "posts" | "pages";
}

export function ContentTable({ type }: ContentTableProps) {
  const [search, setSearch] = useState("");

  const mockPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js 15",
      status: "published",
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
    },
    {
      id: 2,
      title: "Building a Modern CMS",
      status: "draft",
      created_at: "2024-01-14",
      updated_at: "2024-01-14",
    },
    {
      id: 3,
      title: "TypeScript Best Practices",
      status: "published",
      created_at: "2024-01-13",
      updated_at: "2024-01-13",
    },
  ];

  const mockPages = [
    {
      id: 1,
      title: "About Us",
      status: "published",
      created_at: "2024-01-12",
      updated_at: "2024-01-12",
    },
    {
      id: 2,
      title: "Contact",
      status: "published",
      created_at: "2024-01-11",
      updated_at: "2024-01-11",
    },
    {
      id: 3,
      title: "Privacy Policy",
      status: "draft",
      created_at: "2024-01-10",
      updated_at: "2024-01-10",
    },
  ];

  const data = type === "posts" ? mockPosts : mockPages;
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={`Search ${type}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No {type} found. Create your first {type.slice(0, -1)} to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.created_at}</TableCell>
                  <TableCell>{item.updated_at}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
