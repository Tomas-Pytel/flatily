"use client";

import { PropertyFormValues, propertySchema } from "@/lib/validations/property";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProperty } from "@/app/actions/property-actions";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function NewPropertyForm() {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      city: "",
      street: "",
      postalCode: "",
      monthlyRent: 0,
      description: "",
    },
  });

  const onSubmit = (values: PropertyFormValues) => {
    setError("");
    startTransition(async () => {
      const result = await createProperty(values);
      if (result?.error) {
        setError(result.error);
      }
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Názov (napr. 2-izbový byt v centre)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zadajte názov"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ulica a číslo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Šancová 12"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bratislava"
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
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PSČ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="811 05"
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

          <FormField
            control={form.control}
            name="monthlyRent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Očakávaný mesačný nájom (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isPending}
                    {...field}
                    value={(field.value as number) || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? 0 : Number(val));
                    }}
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
                <FormLabel>Popis nehnuteľnosti (nepovinné)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Zadajte krátky popis..."
                    className="resize-none h-24"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ukladá sa...
              </>
            ) : (
              "Pridať nehnuteľnosť"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
