"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, File } from "lucide-react";

export function ExportDropdown() {
  const { exportAll, content } = useAppStore();
  const hasContent = content.some((c) => c?.trim());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!hasContent}>
          <Download className="size-4" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportAll("md")}>
          <FileText className="mr-2 size-4" />
          Exportar como Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAll("txt")}>
          <File className="mr-2 size-4" />
          Exportar como Texto Plano (.txt)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}