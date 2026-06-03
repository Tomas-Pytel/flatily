"use client";

import { FileText, Download } from "lucide-react";
import { Button } from "../ui/button";
import { DocumentInfo } from "./documents-card";

interface DocumentsItemProps {
  document: DocumentInfo;
}

export default function DocumentsItem({ document }: DocumentsItemProps) {
  return (
    <li
      key={document.id}
      className="flex items-center justify-between group py-2 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex gap-3">
        {/** Document icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>

        {/** Document info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none mb-1">
            {document.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {document.date} • {document.size}
          </span>
        </div>
      </div>

      {/** Download button */}
      <Button variant="ghost" size="icon" className="shrink-0" asChild>
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <Download className="h-4 w-4" />
        </a>
      </Button>
    </li>
  );
}
