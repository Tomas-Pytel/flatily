import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Ďakujeme za registráciu!
              </CardTitle>
              <CardDescription>Skontrolujte svoj e-mail</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ak je e-mail platný, poslali sme naň odkaz na potvrdenie účtu.
                Pred prihlásením potvrďte svoj účet kliknutím na odkaz v
                e-maile.
              </p>
              <Link
                href="/auth/login"
                className="mt-4 inline-block text-sm underline underline-offset-4"
              >
                Prejsť na prihlásenie
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
