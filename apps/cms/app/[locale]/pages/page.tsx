import { ContentTable } from "@/components/cms/content-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PagesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Manage your static pages and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Link>
        </Button>
      </div>

      {/* Content Table */}
      <ContentTable type="pages" />
    </div>
  );
}
