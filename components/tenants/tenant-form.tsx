"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/types/action-result";
import {
  TenantFormInput,
  TenantFormOutput,
  tenantSchema,
} from "@/schemas/tenant";

interface TenantFormProps {
  tenant?: TenantFormInput;
  cancelHref?: string;
  action: (data: TenantFormOutput) => Promise<ActionResult<{ id: string }>>;
}

export const TenantForm = ({
  tenant,
  cancelHref = "/tenants",
  action,
}: TenantFormProps) => {
  const router = useRouter();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const form = useForm<TenantFormInput, unknown, TenantFormOutput>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: tenant?.firstName ?? "",
      lastName: tenant?.lastName ?? "",
      email: tenant?.email ?? "",
      phone: tenant?.phone ?? "+421",
      idCardNumber: tenant?.idCardNumber ?? "",
      notes: tenant?.idCardNumber ?? "",
    },
  });

  const onSubmit = async (data: TenantFormOutput) => {
    form.clearErrors("root.server");

    const result = await action(data);

    if (!result.success) {
      form.setError("root.server", {
        message: result.error,
      });
      return;
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <Card className="w-full">
        <CardContent className="p-6 sm:p-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meno *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ján"
                        autoComplete="given-name"
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
                    <FormLabel>Priezvisko *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Novák"
                        autoComplete="family-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jan.novak@gmail.com"
                      autoComplete="email"
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
                  <FormLabel>Telefón *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+421"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Číslo OP / pas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EA 123456"
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poznámka</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Dohodnuté špecifiká, preferovaný kontakt..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={form.formState.isSubmitting}
              >
                Zrušiť
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Ukladám..."
                  : "Uložiť nájomníka"}
              </Button>
            </div>
          </form>

          {form.formState.errors.root?.server?.message && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {form.formState.errors.root.server.message}
            </p>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        title="Opustiť formulár?"
        description={`Neuložené zmeny sa stratia. Naozaj chcete prejsť ${
          tenant ? "späť na detail nájomníka" : "späť na zoznam nájomníkov"
        }?`}
        cancelText="Pokračovať v úprave"
        confirmText="Opustiť formulár"
        onConfirm={() => router.push(cancelHref)}
      />
    </Form>
  );
};
