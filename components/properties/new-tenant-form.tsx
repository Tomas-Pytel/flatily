"use client";

import { createTenantAndLease } from "@/app/actions/tenant-actions";
import { TenantFormValues, tenantSchema } from "@/lib/validations/tenant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";

interface NewTenantFormProps {
  propertyId: string;
}

export default function NewTenantForm({ propertyId }: NewTenantFormProps) {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      startDate: new Date(),
      endDate: new Date(),
      rentAmount: 0,
      depositAmount: 0,
    },
  });

  const onSubmit = (values: TenantFormValues) => {
    setError("");

    startTransition(async () => {
      const result = await createTenantAndLease(values, propertyId);
      if (!result.success) {
        setError(result.error);
      }
      toast.success("Nájomca bol úspešne pridaný");
    });
  };

  return (
    <div className="w-full max-w-2xl bg-card border rounded-xl shadow-sm p-6 sm:p-8">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* SEKICA 1: Osobné údaje */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight border-b pb-2">
              1. Osobné údaje nájomcu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meno</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ján"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priezvisko</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Novák"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jan.novak@gmail.com"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefón (voliteľné)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+421 900 123 456"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* SEKCIA 2: Údaje o zmluve */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight border-b pb-2">
              2. Nájomná zmluva
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dátum začiatku</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isPending}
                        {...field}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : null,
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
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dátum konca</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isPending}
                        {...field}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : null,
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
                name="rentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesačný nájom (€)</FormLabel>
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
                name="depositAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Výška kaucie (€)</FormLabel>
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
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ukladá sa...
              </>
            ) : (
              "Pridať nájomcu a vytvoriť zmluvu"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
