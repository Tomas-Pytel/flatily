import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center px-5">
      <div className="flex flex-col gap-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          Institutional Stability for Modern Property Owners.
        </h1>
        <p className="text-lg text-center mt-4 text-muted-foreground">
          Streamline your rentals, automate payments, and manage tenants all in
          one place with our enterprise-grade management suite.
        </p>
        <div className="flex flex-col items-center">
          <Button variant="default">Get started</Button>
        </div>
      </div>
    </div>
  );
}
