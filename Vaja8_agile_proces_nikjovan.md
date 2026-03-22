# Vaja 8 – Agile proces za DomServices (Kanban)

## 1. Izbira metodologije

### 1.1 Izbrana metodologija

Izbral sem: **Kanban**.

### 1.2 Utemeljitev izbire

Projekt DomServices razvijam individualno, ob drugih študijskih obveznostih, zato nimam stalnih 2‑tedenskih sprintov, ampak delam v neenakomernih časovnih blokih. Kanban mi omogoča **continuous flow**: vedno vidim, kaj je v stolpcih *Backlog / To Do / In Progress / Test / Done* in naloge vlečem (pull), ko končam prejšnjo.

Prioritete pri projektu se pogosto spreminjajo (Firebase integracija, AI search z xAI Grok, Stripe test plačila, Brevo emaili, deploy na Vercel), kar je lažje upravljati s Kanban boardom kot s fiksnimi sprint plani. Kanban mi daje fleksibilnost, da hitro preusmerim fokus na naloge z največjo vrednostjo za MVP.

### 1.3 Primer za DomServices projekt

Za DomServices imam pripravljen **product backlog** (user stories) iz prejšnjih vaj. Iz tega backloga izberem najpomembnejše stories za MVP in jih razbijem na manjše taske, ki jih vodim na Kanban boardu:

- **Backlog** – vse ideje in user stories (npr. “AI iskanje”, “Stripe plačilo”, “email obvestilo”).
- **To Do** – izbrani taske, ki so naslednji na vrsti.
- **In Progress** – trenutno aktivne naloge.
- **Test / Verify** – naloge, ki čakajo na preverjanje.
- **Done** – naloge, ki so implementirane, testirane in (po potrebi) deployane na Vercel.

---

## 2. Plan (Kanban board + proces)

### 2.1 Kanban board in workflow

**Stolpci na boardu:**

- Backlog  
- To Do  
- In Progress  
- Test / Verify  
- Done  

**Proces:**

1. Iz product backlog-a izberem user stories za MVP DomServices.
2. Vsak story razbijem na taske in jih postavim v **To Do**.
3. Hkrati delam na največ 1–2 taskih (WIP limit), premikam jih v **In Progress**.
4. Ko je task implementiran in ročno testiran lokalno, gre v **Test / Verify**, nato v **Done**.
5. Ko imam skupino pomembnih taskov v Done, naredim deploy na Vercel in zabeležim mini release.

### 2.2 Definition of Done (DoD)

Task je **Done**, ko:

- je koda implementirana in deluje v lokalnem okolju (`npm run dev`),
- ni znanih blocker bugov za ta task,
- je funkcionalnost povezana v UI ali API (ni mrtve kode),
- kjer je smiselno, je sprememba deployana na Vercel in preizkušena na produkcijskem URL-ju,
- kartica je v stolpcu **Done** in ima kratek opis / link na commit.

### 2.3 Ključni Kanban taski za DomServices (MVP)

**Osnovna platforma**

- Setup Git + GitHub repo za DomServices.
- Setup Vercel projekta in prvi deploy.
- Setup Firebase projekta (Auth + Firestore) in dodajanje configa v `.env.local`.
- Implementacija `firebase.ts` in Firestore helperjev za `users`, `providers`, `orders`.

**Uporabniki in ponudniki**

- UI za registracijo in prijavo uporabnikov (stranka, ponudnik).
- Ustvarjanje user dokumenta v `users` po registraciji.
- UI za ustvarjanje in urejanje provider profila.
- Shranjevanje provider profila v `providers` kolekcijo.

**Naročila**

- UI za opis problema in izbor ponudnika.
- Shranjevanje naročila v `orders` (status `requested`).

**AI search (xAI Grok)**

- Nastavitev xAI API key (Grok) in testni `curl` klic.
- API route `/api/search/ai` za klic Grok in JSON output `{ category, city, keywords }`.
- Integracija AI search v UI (zamenjava `mockAiSearch`).

**Plačila (Stripe – test mode)**

- Nastavitev Stripe test API ključev in `.env.local`.
- API route `/api/checkout/session` za ustvarjanje Stripe Checkout session.
- “Plačaj” gumb, redirect na Stripe Checkout, success/cancel strani.

**Email notifikacije (Brevo)**

- Nastavitev Brevo SMTP (SMTP host, user, key) in `EMAIL_FROM`.
- Nodemailer client (`lib/email.ts`) za pošiljanje emailov preko Brevo.
- Klic pošiljanja emaila ob uspešni rezervaciji / plačilu (npr. potrditev naročila stranki).

---

## 3. Simulacija dveh Kanban “ciklov”

### 3.1 Cikel 1 – Osnovni DomServices MVP

**Trajanje (primer):** 1.–2. teden.

**Cilj:**  
Vzpostaviti osnovno platformo, kjer se uporabnik lahko registrira, prijavi, nastavi provider profil in ustvari naročilo (brez AI in plačil).

**Naloge, ki so šle iz To Do → Done:**

- GitHub repo + inicialni commit.
- Vercel projekt in prvi deploy (osnovna Next.js stran).
- Firebase integracija (Auth, Firestore, `firebase.ts`).
- UI za registracijo/prijavo in shranjevanje v `users`.
- UI za provider profil in shranjevanje v `providers`.
- UI za ustvarjanje naročila in zapis v `orders`.

**Rezultat cikla 1:**

- Delujoč MVP na Vercel URL-ju (npr. `https://domservices-next.vercel.app`).  
- Uporabnik:
  - ustvari račun,
  - se prijavi,
  - nastavi provider profil,
  - ustvari naročilo, ki se zapiše v Firestore.

**Retrospektiva cikla 1:**

- Potreboval sem več časa za Firestore strukturo in security rules.  
- Dobro se je izkazalo, da sem najprej uredil deploy na Vercel, da sem lahko sproti testiral spremembe na “produkcijskem” URL-ju.  
- Za naprej sem si pripravil checklist za env spremenljivke (Firebase, Vercel).

### 3.2 Cikel 2 – AI search + Stripe plačilo + Brevo emaili

**Trajanje (primer):** 3.–4. teden.

**Cilj:**  
Dodati naprednejše funkcionalnosti, da aplikacija izgleda kot prava platforma: inteligentno iskanje ponudnikov, plačilo naročila in email potrdila.

**Naloge, ki so šle iz To Do → Done:**

- Integracija xAI Grok:
  - testni `curl` klic,
  - `xaiClient` helper,
  - API route `/api/search/ai` z JSON outputom `{ category, city, keywords }`.
- Integracija AI search v UI (opis problema → predlog ponudnikov).
- Stripe test Checkout:
  - nastavitev test ključev,
  - API route `/api/checkout/session`,
  - “Plačaj” gumb, success/cancel strani.
- Brevo emaili:
  - konfiguracija SMTP (`smtp-relay.brevo.com`, user, key),
  - `lib/email.ts` z nodemailerjem,
  - pošiljanje potrditvenega emaila ob rezervaciji / plačilu.
- Posodobljen deploy na Vercel z vsemi env spremenljivkami (xAI, Stripe, Brevo).

**Rezultat cikla 2:**

- Uporabnik lahko:
  - opiše problem v naravnem jeziku,
  - dobi predlog ponudnikov z AI,
  - izvede testno plačilo preko Stripe Checkout (test kartica),
  - prejme email potrditev rezervacije preko Brevo.

**Retrospektiva cikla 2:**

- Največ časa so vzeli API ključi (Perplexity → xAI Grok, Stripe, Brevo) in pravilne `.env` nastavitve lokalno + na Vercelu.
- Kanban pristop (WIP limit 1–2 taska) je pomagal, da se nisem izgubil med preveč paralelnimi integracijami.
- Za naslednje faze bi dodal osnovne avtomatske teste za ključne API route (AI search, checkout, email send) in bolj formalen changelog za releas-e.

---

## 4. Zaključek

Z uporabo **Kanban** pristopa sem pri projektu DomServices:

- organiziral delo v jasen flow (*Backlog → To Do → In Progress → Test → Done*),
- iterativno zgradil MVP v dveh glavnih ciklih (osnovna platforma, nato AI + plačila + emaili),
- povezal proces z realnimi tehnologijami (Firebase, xAI Grok, Stripe test mode, Brevo SMTP, Vercel),
- dosegel cilj vaje: razumeti realen potek razvoja in načrtovati iterativni proces z jasnimi cilji in deliverables.
