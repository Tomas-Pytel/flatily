"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  addPropertyImage,
  setPrimaryImage,
} from "@/app/actions/property-actions";
import Image from "next/image";
import { Star, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PropertyGalleryModalProps {
  propertyId: string;
  images: { id: string; url: string }[];
  currentPrimaryUrl: string | null;
  userId: string;
}

export function PropertyGalleryModal({
  propertyId,
  images,
  currentPrimaryUrl,
  userId,
}: PropertyGalleryModalProps) {
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${propertyId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(filePath);

      const result = await addPropertyImage(propertyId, publicUrl);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Obrázok bol úspešne nahratý!");
    } catch {
      toast.error("Nastala chyba pri nahrávaní obrázka.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = (url: string) => {
    startTransition(async () => {
      const result = await setPrimaryImage(propertyId, url);
      if (result.success) {
        toast.success("Hlavný obrázok bol zmenený.");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog>
      {/* Gallery trigger */}
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 cursor-pointer">
          <ImageIcon className="size-4" />
          Galéria fotiek
        </Button>
      </DialogTrigger>

      {/* Modal window */}
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Galéria nehnuteľnosti</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Button for file upload */}
          <div>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button asChild disabled={uploading}>
              <label htmlFor="imageUpload" className="cursor-pointer">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Nahrávam...
                  </>
                ) : (
                  "Pridať obrázok"
                )}
              </label>
            </Button>
          </div>

          {/* Galéria obrázkov */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.length > 0 ? (
              images.map((img: { id: string; url: string }) => (
                <div
                  key={img.id}
                  className="relative group rounded-lg overflow-hidden border bg-muted"
                >
                  <Image
                    src={img.url}
                    alt="Property"
                    width={300}
                    height={200}
                    className="object-cover w-full h-32 transition-transform group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant={
                        currentPrimaryUrl === img.url ? "default" : "secondary"
                      }
                      size="sm"
                      onClick={() => handleSetPrimary(img.url)}
                      disabled={isPending}
                      className="gap-2"
                    >
                      <Star
                        className={`size-4 ${currentPrimaryUrl === img.url ? "fill-current" : ""}`}
                      />
                      {currentPrimaryUrl === img.url ? "Hlavný" : "Nastaviť"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                Zatiaľ nemáte nahraté žiadne fotografie.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
