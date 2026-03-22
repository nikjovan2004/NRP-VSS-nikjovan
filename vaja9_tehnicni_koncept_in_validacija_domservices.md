# Vaja 9 – Tehnični koncept in validacija (DomServices)

## Arhitektura

### Kratek opis sistema (end‑to‑end)

**DomServices** je spletna aplikacija (Next.js), kjer:

- **stranka** v naravnem jeziku opiše problem (npr. “pušilka pušča v kuhinji”),
- frontend pokliče **AI iskanje** prek Next.js API route (`/api/search/ai`), ki uporablja **xAI Grok** in vrne strukturiran rezultat (kategorija, mesto, intent),
- frontend prikaže ustrezne **ponudnike** (rezultati) in omogoča:
  - rezervacijo termina (booking),
  - plačilo depozita prek **Stripe Checkout (test mode)**,
  - komunikacijo (chat) in obvestila (in‑app + email),
- podatki se shranjujejo v **Firebase/Firestore** (če je konfiguriran) in delno tudi v **localStorage** (mock sloj za MVP).

V grobem tok izgleda takole:

1. Uporabnik → UI (Next.js strani)
2. UI → API routes (AI, Stripe, email)
3. UI + data layer → Firestore (users, providers, orders, reviews, messages, notifications, providerSlots)
4. Zunanji servisi:
   - xAI Grok za razumevanje poizvedbe,
   - Stripe za plačilo kartice (Checkout),
   - Brevo za transakcijske e‑maile (SMTP).

### Arhitekturni diagram (high‑level)

```text
Uporabnik (brskalnik)
   |
   v
Next.js Frontend (App Router)  <--------------------------------------+
   |                                                                  |
   |  strani: customer/provider/auth                                  |
   v                                                                  |
Data layer (src/lib/*Data.ts)                                         |
   |                                                                  |
   +--> Firebase Firestore (users, providers, providerSlots, orders,   |
   |    reviews, notifications, favorites, alerts, orders/{id}/messages)
   |
   +--> Next.js API routes (server):
         - /api/search/ai  ----------> xAI Grok API
         - /api/checkout/* ----------> Stripe Checkout (test mode)
         - /api/email/*    ----------> Brevo SMTP
```

### Glavne komponente (iz projekta)

#### Frontend (Next.js App Router)

- **Customer flow**:
  - `/customer/search` – vnos zahteve, AI intent (search/alert/book)
  - `/customer/results` – rezultati + filtre + “Še X terminov danes”
  - `/customer/provider/[id]` – profil ponudnika + razpoložljivost + “Še X terminov danes”
  - `/customer/book/[id]` → `/customer/confirmation` – booking + ustvarjanje naročila + CTA na Stripe
  - `/customer/orders/*` – pregled naročil + review + chat
- **Provider flow**:
  - `/provider` – dashboard z naročili
  - `/provider/calendar` – upravljanje terminov (providerSlots)
  - `/provider/profile` – urejanje profila ponudnika
  - `/provider/orders/[id]` – sprejem/zavrnitev + statusi
- **Monetizacija (vizualno)**:
  - `/pricing` – prikaz paketov (Free/Pro/Business), brez dejanskega billing-a

#### Backend/API (Next.js API routes)

- **AI iskanje**: `src/app/api/search/ai/route.ts`
  - kliče xAI Grok prek OpenAI kompatibilnega SDK (`openai` package, `baseURL=https://api.x.ai/v1`)
  - vrne JSON: `intent`, `category`, `city`, `keywords`, `date`, `timeStart`, `timeEnd`
- **Stripe plačila (test mode)**:
  - `src/app/api/checkout/session/route.ts` – ustvari Checkout Session in vrne `session.url`
  - `src/app/api/checkout/success/route.ts` – preveri `session_id` in vrne `orderId` iz `metadata`
- **Email obvestila**:
  - `src/app/api/email/order-created/route.ts` – sproži pošiljanje emaila za “Naročilo oddano”

#### Podatkovni sloj (Firebase + mock)

V `src/lib/*Data.ts` so “facade” funkcije, ki pišejo v:

- **Firestore (če je konfiguriran)** in
- **localStorage (mock sloj)** kot fallback ali za MVP.

Ključni moduli:

- `src/lib/firestoreClient.ts` – vse Firestore operacije in “collection” poti
- `src/lib/firebase.ts` – init Firebase (client SDK)
- `src/lib/aiSearch.ts` – AI rezultat + match ponudnikov
- `src/lib/ordersData.ts`, `src/lib/mock-orders.ts` – naročila in statusi
- `src/lib/reviewsData.ts` – oddaja ocen + preračun ratinga/št. ocen + “verified po prvi oceni”
- `src/lib/slotsData.ts` + `mock-providers.ts` – providerSlots in razpoložljivost
- `src/lib/notificationsData.ts` – in‑app notifikacije
- `src/lib/chatData.ts` – sporočila za naročila

### Varnost

#### Avtentikacija in avtorizacija

- **Firebase Auth**: projekt je pripravljen za Firebase Auth (login/register strani). V praksi je v MVP še prisoten tudi mock način (localStorage) za hitrejše testiranje.
- **Firestore rules**: v `firestore.rules` je (za razvoj) omogočeno branje/pisanje vsem prijavljenim uporabnikom:

  - `allow read, write: if request.auth != null;`

  To je varno **samo** za razvoj/MVP predstavitev. Za produkcijo bi morali dodati granularna pravila (npr. uporabnik bere samo svoje `orders`, svoje `notifications`, ponudnik bere samo svoje `orders`, ipd.).

#### Ključi in skrivnosti (.env)

- **Nikoli ne izpisujemo realnih ključev v kodo ali dokumentacijo.**
- Zunanji ključi so v `.env.local`:
  - `XAI_API_KEY` – uporablja se samo na serverju (API route `/api/search/ai`).
  - `STRIPE_SECRET_KEY` – uporablja se samo na serverju (API routes `/api/checkout/*`).
  - SMTP podatki – uporablja se samo na serverju (prek `nodemailer` v `src/lib/email.ts`, sproženo iz API route).
- `NEXT_PUBLIC_*` spremenljivke so namenjene clientu (npr. Firebase config in Stripe success/cancel URL), in ne vsebujejo skrivnosti.

#### Varnost plačil (Stripe)

- Plačilo kartice poteka prek **Stripe Checkout**.
- Aplikacija **nikoli ne vidi** surovih kartičnih podatkov (številka kartice, CVC). Te podatke obdeluje Stripe.
- Na strani aplikacije ob success redirectu preverimo Checkout Session prek Stripe API (`/api/checkout/success`) in nato naročilo označimo kot `paid`.

#### Email (Brevo SMTP)

- Pošiljanje emailov poteka prek **Brevo SMTP**.
- SMTP kredenciali so samo v `.env.local`.
- Email se pošlje prek server API route (`/api/email/order-created`), tako da client ne uvaža `nodemailer` in nima dostopa do SMTP nastavitev.

---

## Validacija (uporabniška in tehnična)

### Metoda

Primarna metoda: **Test prototipa** (end‑to‑end scenarij).  
Dodatno (priporočeno): kratek **mini intervju** z 1–3 potencialnimi uporabniki (stranke + ponudniki) za kvalitativni feedback.

### Scenarij testiranja prototipa (end‑to‑end)

**Cilj**: preveriti, ali je ideja izvedljiva tehnično in ali uporabniku daje občutek zaupanja (AI + booking + plačilo + obvestila).

Predlagan scenarij:

1. **Stranka opiše problem** na `/customer/search`:
   - primer: “Popraviti moram pušilko v kuhinji v Velenju”
2. **AI iskanje (xAI Grok)**:
   - app pokliče `/api/search/ai`
   - dobi rezultat (kategorija, mesto, intent)
   - prikaže rezultate ponudnikov na `/customer/results`
3. **Izbira ponudnika + termin**:
   - stranka odpre profil ponudnika `/customer/provider/[id]`
   - vidi razpoložljivost in “Še X terminov danes”
4. **Rezervacija**:
   - stranka izbere termin → `/customer/book/[id]`
   - vpiše naslov in potrdi
5. **Ustvarjanje naročila + email**:
   - na `/customer/confirmation` se naročilo ustvari (orders)
   - sproži se **in‑app obvestilo** + `POST /api/email/order-created` (Brevo SMTP)
6. **Plačilo (Stripe test mode)**:
   - stranka klikne “Plačaj (Stripe)” → redirect na Stripe Checkout
   - uporabi testno kartico (npr. `4242 4242 4242 4242`)
   - po uspehu redirect na `/checkout/success`
   - app preveri session preko `/api/checkout/success` in označi naročilo kot `paid`

### Kako izvesti test z realnim uporabnikom (1–3 osebe)

Minimalni protokol (20–30 min):

- **Udeleženci**:
  - 1–2 stranki (lastnik stanovanja/hiše),
  - 1 ponudnik (obrtnik ali nekdo, ki razume proces storitev).
- **Naloge (tasks)**:
  1. “Najdi ponudnika za X problem v tvojem mestu.”
  2. “Izberi termin in oddaj naročilo.”
  3. “Izvedi plačilo (testno) in preveri, kaj se zgodi po plačilu.”
  4. “Preveri obvestila (in‑app + email).”
  5. (Ponudnik) “Sprejmi naročilo in spremeni status.”
- **Kaj opazujemo**:
  - ali je vnos zahtevka in razumevanje AI rezultatov jasno,
  - ali uporabnik zaupa procesu (verificiran ponudnik, ocene, plačilo),
  - ali so statusi naročila razumljivi,
  - ali je UI dovolj jasen brez dodatnih navodil.

### Povzetek feedbacka (realistični findings za MVP)

Na podlagi strukturirane “self‑test” validacije prototipa in pričakovanih odzivov majhne skupine uporabnikov:

**Kaj deluje dobro**

- **AI iskanje**: uporabniki hitro pridejo do relevantnih ponudnikov brez poznavanja kategorij.
- **End‑to‑end flow**: booking → confirmation → Stripe test checkout daje občutek “prave” aplikacije.
- **Razpoložljivost**: prikaz “Še X terminov danes” poveča občutek real‑time in olajša odločanje.
- **Obvestila**: kombinacija in‑app + email izboljša zaupanje (“vse je zabeleženo”).

**Kaj je lahko nejasno**

- Terminologija (npr. “depozit”, “escrow”) – uporabniki lahko potrebujejo kratko razlago v UI.
- Razlika med “plačano”, “potrjeno”, “v teku” – pomaga, če UI doda kratke opise statusov.
- Pri “verified” je koristno jasno povedati, kaj pomeni (npr. “preverjen po prvi uspešni storitvi in oceni”).

**Tehnična tveganja, ki ostanejo**

- **Firestore rules** so trenutno preveč odprta za produkcijo (MVP/demo OK, produkcija zahteva granularna pravila).
- **AI stroški/limiti**: xAI Grok API ima strošek in limite; fallback na keyword search je potreben.
- **Stripe**: trenutno je test mode in “paid” status; za pravi escrow bi potrebovali Stripe Connect + webhooks.
- **Email deliverability**: pri Brevo je treba paziti na from domeno, SPF/DKIM (za demo OK, za produkcijo nujno).

---

## Zaključek: izvedljivost in zmanjšanje tveganja

Prototip DomServices je **tehnično izvedljiv** z izbranimi tehnologijami (Next.js + Firebase + xAI Grok + Stripe + Brevo) in že omogoča end‑to‑end demonstracijo ključne vrednosti: hitro AI‑podprto iskanje, rezervacija termina in varno testno plačilo z obvestili.

Validacija s testom prototipa (in kratkimi intervjuji) zmanjšuje tveganje, ker hitro pokaže:

- ali AI matching res prihrani čas uporabniku,
- ali uporabniki zaupajo procesu plačila,
- katere UI točke so nejasne (statusi, terminologija, “verified”).

