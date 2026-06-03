"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import {
  addPropertyDocument,
  DocumentFormValues,
} from "@/app/actions/document-actions";
import DocumentsItem from "./documents-item";

export interface DocumentInfo {
  id: string;
  title: string;
  date: string;
  size: string;
  fileUrl: string;
}

interface DocumentsCardProps {
  documents: DocumentInfo[];
  propertyId: string;
  userId: string;
}

export default function DocumentsCard({
  documents,
  propertyId,
  userId,
}: DocumentsCardProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const originalTitle = file.name;
      const fileSize = file.size;
      const fileType = file.type;

      const fileExt = originalTitle.split(".").pop();
      const fileName = `${propertyId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-documents")
        .upload(filePath, file);

      if (uploadError) {
        toast.error("Chyba pri nahrávaní dokumentu.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-documents").getPublicUrl(filePath);

      const values: DocumentFormValues = {
        title: originalTitle,
        fileUrl: publicUrl,
        fileSize: fileSize,
        fileType: fileType,
      };
      // 3. Zápis do databázy
      const result = await addPropertyDocument(propertyId, values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Dokument bol úspešne nahratý!");
      event.target.value = "";
    } catch {
      toast.error("Nastala chyba pri nahrávaní dokumentu.");
    } finally {
      setUploading(false);
    }
  };

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
              <DocumentsItem document={doc} key={doc.id} />
            ))
          )}
        </ul>

        {/**Upload area */}
        <div className="mt-auto">
          <label
            htmlFor="doc-upload"
            className={`relative flex min-h-25 w-full cursor-pointer flex-col items-center justify-center gap-2 
              rounded-xl border-2 border-dashed border-muted-foreground/20 
              bg-muted/30 px-4 transition-all hover:bg-muted/50 hover:border-muted-foreground/40
              ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {uploading ? "Nahrávam..." : "Nahrať nový dokument"}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX do 10MB
              </p>
            </div>
            <Input
              type="file"
              id="doc-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
