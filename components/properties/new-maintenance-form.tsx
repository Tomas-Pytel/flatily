"use client";

import { createMaintenance } from "@/app/actions/maintenance-actions";
import { MaintenanceStatus } from "@/lib/generated/prisma/enums";
import {
  MaintenanceFormValues,
  maintenanceSchema,
} from "@/lib/validations/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewMaintenanceFormProps {
  propertyId: string;
}

export default function NewMaintenanceForm({
  propertyId,
}: NewMaintenanceFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      title: "",
      cost: 1,
      status: MaintenanceStatus.OPEN,
      description: "",
      provider: "",
      resolvedDate: new Date(),
    },
  });

  const onSubmit = (values: MaintenanceFormValues) => {
    setError("");
    startTransition(async () => {
      const result = await createMaintenance(values, propertyId);

      // if error occurs, set error state to show error message in form
      if (!result.success) {
        setError(result.error);
      } else {
        setOpen(false);
        form.reset();
        router.refresh();
        toast.success("Oprava bola úspešne pridaná");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          Pridať opravu
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Nová údržba / oprava</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Názov opravy</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="napr. Oprava kotla"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cena (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isPending}
                        {...field}
                        value={(field.value as number) || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stav</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte stav" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MaintenanceStatus.OPEN}>
                          Otvorené
                        </SelectItem>
                        <SelectItem value={MaintenanceStatus.IN_PROGRESS}>
                          V riešení
                        </SelectItem>
                        <SelectItem value={MaintenanceStatus.RESOLVED}>
                          Vyriešené
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("status") === MaintenanceStatus.RESOLVED && (
              <FormField
                control={form.control}
                name="resolvedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dátum vyriešenia *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isPending}
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dodávateľ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="napr. Vodár Ján Novák"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poznámka / Popis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailný popis poruchy..."
                      className="resize-none"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Zrušiť
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? "Ukladám..." : "Uložiť"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
