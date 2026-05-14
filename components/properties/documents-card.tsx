import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Upload, LucideIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface DocumentInfo {
  id: string;
  title: string;
  date: string;
  size: string;
  icon: LucideIcon;
}

interface DocumentsCardProps {
  documents: DocumentInfo[];
}

export default function DocumentsCard({ documents }: DocumentsCardProps) {
  return (
    <Card className="h-full flex flex-col">
      {/**Title */}
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold m-0">Dokumenty</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      {/**List of documents */}
      <CardContent className="flex flex-col gap-6 flex-1">
        <ul className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Žiadne dokumenty</p>
          ) : (
            documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between group p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex gap-3">
                  {/** Document icon */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <doc.icon className="h-5 w-5" />
                  </div>

                  {/** Document info */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none mb-1">
                      {doc.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.date} • {doc.size}
                    </span>
                  </div>
                </div>

                {/** Download button */}
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Download className="h-4 w-4" />
                </Button>
              </li>
            ))
          )}
        </ul>

        {/**Upload area */}
        <div className="mt-auto">
          <label className="relative flex min-h-25 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 px-4 transition-all hover:bg-muted/50 hover:border-muted-foreground/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Nahrať nový dokument</p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG alebo PNG do 10MB
              </p>
            </div>
            <Input type="file" className="hidden" />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
