import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Download, Upload } from "lucide-react";
import { Input } from "../ui/input";

export interface DocumentInfo {
  id: string;
  title: string;
  date: string;
  size: string;
  icon: React.ElementType;
}

interface DocumentsCardProps {
  documents: DocumentInfo[];
}

export default function DocumentsCard({ documents }: DocumentsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <h3 className="text-lg font-medium m-0">Dokumenty</h3>
        <FileText className="h-4 w-4" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="space-y-2">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Žiadne dokumenty</p>
          ) : (
            documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between">
                <div className="flex gap-4">
                  {/** Document icon */}
                  <div className="flex items-center space-x-2">
                    <doc.icon className="h-4 w-4" />
                  </div>

                  {/** Document info */}
                  <div className="flex flex-col">
                    <span className="text-sm">{doc.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {doc.date} • {doc.size}
                    </span>
                  </div>
                </div>

                {/** Download button */}
                <button className="size-8 bg-muted rounded-md flex items-center justify-center">
                  <Download className="h-4 w-4" />
                </button>
              </li>
            ))
          )}
        </ul>

        {/**Upload area */}
        <label className="flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 transition hover:bg-gray-100">
          <Upload className="h-5 w-5" />

          <span className="text-sm font-medium">Nahrať nový dokument</span>

          <Input type="file" className="hidden" />
        </label>
      </CardContent>
    </Card>
  );
}
