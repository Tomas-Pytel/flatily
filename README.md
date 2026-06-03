# 🏠 Property Management Dashboard (Správa nehnuteľností)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Moderná full-stack webová aplikácia určená pre prenajímateľov a majiteľov nehnuteľností. Umožňuje jednoducho spravovať portfólio nehnuteľností, sledovať nájomníkov, evidovať opravy a bezpečne ukladať dokumenty.

Tento projekt slúži ako ukážka mojich zručností pri vývoji moderných webových aplikácií s využitím najnovších štandardov ekosystému React a Next.js (App Router, Server Actions).

---

## ✨ Hlavné funkcionality

- **🏢 Správa portfólia:** Pridávanie, úprava a mazanie nehnuteľností v prehľadnom zobrazení.
- **👥 Manažment nájomníkov:** Evidencia aktívnych nájomníkov, zmlúv, kontaktných údajov a výšky depozitov.
- **🔧 Sledovanie údržby:** Záznamník opráv, sledovanie stavu riešenia (vyriešené/nevyriešené) a finančných nákladov.
- **📁 Správa dokumentov:** Bezpečné nahrávanie a prístup k nájomným zmluvám, faktúram a iným dôležitým súborom.
- **🖼️ Galéria:** Možnosť nahrať a spravovať fotografie pre každú nehnuteľnosť.
- **📊 KPI Ukazovatele:** Automatické výpočty mesačného nájmu, ročného výnosu (ROI) a obsadenosti.
- **🔒 Bezpečnosť:** Autentifikácia a autorizácia (majiteľ vidí a spravuje výlučne iba svoje dáta).

---

## 🛠️ Použité technológie (Tech Stack)

Aplikácia je postavená na moderných a škálovateľných technológiách:

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Jazyk:** TypeScript
- **Styling:** Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Formuláre a Validácia:** React Hook Form + Zod
- **Ikony:** Lucide React

### Backend & Databáza

- **API a Logika:** Next.js Server Actions (bezpečné volania na server priamo z komponentov)
- **Databáza:** PostgreSQL hostovaná na [Supabase](https://supabase.com/)
- **ORM:** Prisma Client
- **Autentifikácia:** Supabase Auth (SSR)

---

## 🚀 Lokálne spustenie (Getting Started)

Ak si chcete projekt spustiť lokálne, postupujte podľa týchto krokov:

### 1. Klonovanie repozitára

```bash
git clone https://github.com/Tomas-Pytel/flatily.git
cd flatily
```

### 2. Inštalácia závislostí

```bash
npm install
```

### 3. Nastavenie prostredia (Environment Variables)

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...

# Connect to Supabase
DATABASE_URL=...

# Direct connection to the database. Used for migrations
DIRECT_URL=...
```

### 4. Inicializácia databázy

```bash
npx prisma generate
npx prisma db push
```

### 5. Spustenie vývojového servera

```bash
npm run dev
```

Aplikácia bude bežať na adrese http://localhost:3000

---

## 🏗️ Architektúra kódu a best practices

V tomto projekte som dbal na čistotu kódu a moderné prístupy:

- **Server Actions:** Dátové operácie sú riešené cez Server Actions namiesto tradičných API routes, čo zrýchľuje vývoj a zaisťuje typovú bezpečnosť.
- **Validácia dát:** Všetky vstupy z formulárov (pridanie nehnuteľnosti, nájomcu, opravy) sú striktne validované pomocou knižnice Zod ešte pred odoslaním na server.
- **Komponentový prístup:** Zdieľané UI komponenty (tlačidlá, modaly, karty) sú extrahované a znovu použiteľné (UI zložka inšpirovaná shadcn/ui).
- **Bezpečnosť:** Každá Server Action kontroluje prihláseného používateľa a overuje, či daný záznam v databáze patrí výlučne jemu.

---

## 📸 Ukážky z aplikácie

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
    <img src="https://github.com/Tomas-Pytel/github-images/tree/main/flatily/Landing-page.png" width="300">
    <img src="https://github.com/Tomas-Pytel/github-images/tree/main/flatily/Dashboard.png" width="300">
</div>
---

## 👨‍💻 Autor

Tomáš Pytel

- LinkedIn: https://www.linkedin.com/in/tom%C3%A1%C5%A1-pytel-6272863a4/
- Web/Portfólio: https://tomas-pytel.github.io/portfolio-app/
