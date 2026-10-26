"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newPropertySchema,
  type NewPropertyFormInput,
  type NewPropertyFormOutput,
} from "@/schemas/property";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createNewProperty } from "@/app/actions/properties";

export const NewPropertyForm = () => {
  const router = useRouter();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const form = useForm<NewPropertyFormInput, unknown, NewPropertyFormOutput>({
    resolver: zodResolver(newPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      street: "",
      city: "",
      district: "",
      postalCode: "",
      monthlyRent: 0,
      utilitiesAmount: 0,
      depositAmount: 0,
      rooms: 1,
      area: 1,
      floor: 0,
      totalFloors: 1,
      hasElevator: true,
      hasBalcony: true,
      hasCellar: true,
    },
  });

  const onSubmit = async (data: NewPropertyFormOutput) => {
    form.clearErrors("root.server");

    const result = await createNewProperty(data);

    if (!result.success) {
      form.setError("root.server", {
        message: result.error,
      });
      return;
    }

    form.reset();
    router.push("/properties");
  };

  const renderNumberField = (
    name:
      | "monthlyRent"
      | "utilitiesAmount"
      | "depositAmount"
      | "rooms"
      | "area"
      | "floor"
      | "totalFloors",
    label: string,
    options?: {
      min?: number;
      max?: number;
      step?: number;
    },
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={options?.min}
              max={options?.max}
              step={options?.step ?? 1}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={field.value == null ? "" : String(field.value)}
              onChange={(event) => field.onChange(event.target.value)}
              aria-invalid={!!form.formState.errors[name]}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderCheckboxField = (
    name: "hasElevator" | "hasBalcony" | "hasCellar",
    label: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-2 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="cursor-pointer font-normal">{label}</FormLabel>
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <Card className="w-full">
        <CardContent className="p-6 sm:p-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Názov */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Názov bytu *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="napr. 2-izbový byt, Hlavná 24"
                      maxLength={100}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ulica a mesto */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ulica a číslo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Hlavná 24" maxLength={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Košice" maxLength={60} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Mestská časť a PSČ */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mestská časť</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Staré Mesto"
                        maxLength={60}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PSČ *</FormLabel>
                    <FormControl>
                      <Input placeholder="04001" maxLength={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Financie */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Finančné údaje</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {renderNumberField("monthlyRent", "Mesačný nájom (€) *", {
                  min: 0,
                  step: 0.01,
                })}
                {renderNumberField("utilitiesAmount", "Energie (€)", {
                  min: 0,
                  step: 0.01,
                })}
                {renderNumberField("depositAmount", "Kaucia (€)", {
                  min: 0,
                  step: 0.01,
                })}
              </div>
            </div>

            {/* Parametre */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Parametre bytu</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {renderNumberField("rooms", "Počet izieb", {
                  min: 1,
                  max: 8,
                })}
                {renderNumberField("area", "Rozloha (m²)", {
                  min: 0,
                  step: 0.01,
                })}
                {renderNumberField("floor", "Poschodie", {
                  min: 0,
                })}
              </div>

              <div className="mt-4">
                {renderNumberField("totalFloors", "Počet poschodí v budove", {
                  min: 1,
                })}
              </div>
            </div>

            {/* Vlastnosti */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Vybavenie a vlastnosti
              </h3>
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {renderCheckboxField("hasElevator", "Výťah")}
                {renderCheckboxField("hasBalcony", "Balkón / Loggia")}
                {renderCheckboxField("hasCellar", "Pivnica")}
              </div>
            </div>

            {/* Popis */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Popis bytu</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Charakteristika bytu, rekonštrukcia, výhody..."
                      maxLength={1000}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Akcie */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={form.formState.isSubmitting}
              >
                Zrušiť
              </Button>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                {form.formState.isSubmitting ? "Ukladám..." : "Uložiť byt"}
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
        description="Neuložené zmeny sa stratia. Naozaj chcete prejsť späť na zoznam nehnuteľností?"
        cancelText="Pokračovať v úprave"
        confirmText="Opustiť formulár"
        onConfirm={() => router.push("/properties")}
      />
    </Form>
  );
};
