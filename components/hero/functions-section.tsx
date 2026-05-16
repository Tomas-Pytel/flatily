import { Check } from "lucide-react";
import Image from "next/image";

export default function FunctionsSection() {
  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Všetko, čo potrebujete na jednom mieste
          </h2>
          <p className="text-lg text-muted-foreground">
            Zabudnite na excelovské tabuľky a e-maily. Rentio vám poskytne
            prehľadný dashboard, kde vidíte stav každej nehnuteľnosti v reálnom
            čase.
          </p>
          <ul className="space-y-4">
            {[
              "Automatické párovanie platieb",
              "Prehľadné reporty pre vlastníkov",
              "Legislatívny súlad a zmluvy",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Check className="size-4 text-blue-500" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative w-full rounded-2xl border bg-slate-900 shadow-2xl overflow-hidden">
          {/* Browser imitation */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-red-500" />
              <div className="size-2.5 rounded-full bg-yellow-500" />
              <div className="size-2.5 rounded-full bg-green-500" />
            </div>
          </div>

          {/* Samotný dashboard */}
          <div className="p-4">
            <Image
              src="/dashboard.png"
              alt="Rentio Dashboard"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
