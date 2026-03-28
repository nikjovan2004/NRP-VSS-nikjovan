# Načrt: Stripe Checkout (testni način) – pregled in implementacijski plan

## 1. Ocena predloga

**Predlog je dober in izvedljiv.** Koraki zunaj Cursorja so jasni; Cursor-del je minimalen in ustreza obstoječemu flowu v DomServices.

### Ujemanje s trenutno kodo

- **Kje se “potrdi” naročilo:** stran **`/customer/confirmation`** (po rezervaciji iz `/customer/book/[id]`). Naročilo se ustvari ob nalaganju confirmation strani (klic `createOrder`), trenutno pa se prikaže sporočilo, da je “plačilo simulirano”.
- **Kje dodati “Plačaj”:** na confirmation strani – namesto (ali poleg) trenutnega besedila o simulaciji dodamo gumb **Plačaj**, ki kliče API za Checkout Session in naredi redirect na Stripe.
- **Podatki za Stripe:** naročilo že obstaja (ima `id`), imamo dostop do `provider` (iz URL `providerId`) in lahko izpeljemo znesek iz `provider.priceRange` ali uporabimo fiksni depozit v centih.

### Opombe

1. **Znesek (amount):** Naročila trenutno nimate polja `amount`/`total`. Ponudnik ima `priceRange` (npr. `"45 €/h"`). Za Checkout Session lahko:
   - iz `priceRange` izluščite številko in uporabite npr. 1h = 45 € → 4500 centov, ali
   - za šolski projekt uporabite fiksni depozit (npr. 20 € = 2000 centov).
2. **Status “paid”:** Tip `OrderStatus` trenutno nima vrednosti `"paid"`. V načrtu je vključeno: bodisi dodate `"paid"` v `OrderStatus` in ga prikažete v UI, bodisi po uspešnem plačilu nastavite npr. `"confirmed"` (minimalno).
3. **Id naročila:** `createOrder` v `ordersData` vrne naročilo z `id` iz mock layerja (`ord-${Date.now()}`). Firestore `createFirestoreOrder` uporablja `addDoc` in tako dobi svoj id. Za enostavno posodobitev po plačilu je priporočilo: pri ustvarjanju naročila naj se v Firestore zapiše isto `id` kot v mocku (npr. z `setDoc(doc(db, ORDERS_COLL, order.id), ...)`), da lahko z enim `orderId` posodabljate oba.

---

## 2. Koraki zunaj Cursorja (ti jih narediš)

To je vse, kar moraš narediti ročno. Ostalo lahko naredi Cursor.

1. **Ustvari Stripe račun in preklopi na Test mode**
   - Prijava na https://dashboard.stripe.com
   - Zgoraj levo preklopi na **Test mode** (ne Live).

2. **Kopiraj test API ključe**
   - Meni: **Developers → API keys**
   - **Publishable key** (za frontend): `pk_test_...`
   - **Secret key** (za backend): `sk_test_...`

3. **Dodaj spremenljivke v `.env.local`**
   ```env
   STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_STRIPE_SUCCESS_URL=http://localhost:3000/checkout/success
   NEXT_PUBLIC_STRIPE_CANCEL_URL=http://localhost:3000/checkout/cancel
   ```
   - `STRIPE_SECRET_KEY` **nikoli** na client (samo v API route).
   - `NEXT_PUBLIC_...` se sme uporabljati v React.

4. **Restart dev serverja**
   - Po spremembi `.env.local`: ustaviti in znova zagnati `npm run dev`.

Ko je to narejeno, lahko Cursor implementira spodaj opisane korake.

---

## 3. Implementacijski plan (kaj naj naredi Cursor)

### 3.1 Odvisnost

- V projekt dodati paket: **`stripe`** (za Node/API route).  
  Npr. `npm install stripe`.  
  Za samo redirect na Checkout **ni** potrebe po `@stripe/stripe-js` na frontendu (dovolj je `window.location.href = session.url`).

### 3.2 Backend: API za Checkout Session

**Nova datoteka:** `src/app/api/checkout/session/route.ts` (POST)

- Import Stripe z `STRIPE_SECRET_KEY` iz `process.env`.
- Sprejme JSON body, npr. `{ orderId: string, amount: number, currency?: string }`.
  - `amount` = znesek v **centih** (npr. 2000 = 20 €).
  - `currency` opcijsko, privzeto `"eur"`.
- Klic `stripe.checkout.sessions.create` z:
  - `mode: "payment"`
  - `success_url`: iz `process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL` (lahko z `?session_id={CHECKOUT_SESSION_ID}`)
  - `cancel_url`: iz `process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL`
  - `line_items`: en element, npr. `price_data` z `currency`, `unit_amount`, `product_data.name` (npr. "DomServices naročilo" ali "Depozit – naročilo #orderId")
  - `metadata`: `{ orderId }` (da na success strani vemo, katero naročilo označiti kot plačano)
- Vrniti JSON: `{ url: session.url }`.
- Če `STRIPE_SECRET_KEY` manjka, vrniti 500 ali 400 z jasnim odgovorom.

**Pomembno:** samo testni ključi, brez live logike.

### 3.3 Frontend: Confirmation stran in gumb “Plačaj”

**Spremenjena datoteka:** `src/app/customer/confirmation/page.tsx`

- Trenutno: ob loadu se iz sessionStorage prebere “pending order”, kliče `createOrder(...)` in se prikaže “Plačilo simulirano”.
- Prilagoditve:
  - Shraniti ustvarjeno naročilo v state (npr. `createdOrder` z `id` in ostalimi podatki), da imamo `orderId` za Stripe.
  - Prikazati podrobnosti naročila (že obstaja).
  - Dodati gumb **“Plačaj”** (ali “Plačaj s Stripe”), ki:
    1. Kliče `POST /api/checkout/session` z `{ orderId: createdOrder.id, amount: amountInCents, currency: "eur" }`.
       - Znesek: iz `provider.priceRange` (npr. parse “45” iz “45 €/h” in uporabi 45 * 100 centov) ali fiksno 2000 (20 €).
    2. Iz odziva vzame `url` in naredi `window.location.href = url`.
  - Ob kliku na “Plačaj” prikazati loading (onemogočen gumb / “Preusmerjanje na Stripe…”).
- Opcijsko: če želimo, da je plačilo obvezno, lahko skrijemo “Moja naročila” dokler ni plačano (za minimalni MVP lahko pustimo oba gumba).

### 3.4 Strani Success in Cancel

**Nova datoteka:** `src/app/checkout/success/page.tsx`

- Prebere `session_id` iz `searchParams` (Stripe ga doda v success_url, če ga vključimo).
- Po želji:
  - **Minimalno:** samo prikaže “Plačilo uspešno” in povezavo “Moja naročila” (`/customer/orders`).
  - **Z oznako plačanega naročila:** kliče API (npr. `POST /api/checkout/success` z `{ session_id }`). Ta API na serverju z Stripe SDK preveri session, iz `metadata.orderId` dobi id naročila in posodobi naročilo na status `"paid"` (ali `"confirmed"`). Success stran nato prikaže uspeh in link na naročila.

**Nova datoteka:** `src/app/checkout/cancel/page.tsx`

- Preprosta stran: “Plačilo preklicano” in povezava nazaj (npr. na `/customer/orders` ali `/customer/confirmation` če želiš).

### 3.5 Oznaka naročila kot plačano (po želji za “izgleda kot da deluje”)

- **Tip:** V `src/types/order.ts` dodati v `OrderStatus` vrednost `"paid"` (ali uporabiti obstoječ `"confirmed"` po plačilu).
- **Backend endpoint:** npr. `src/app/api/checkout/success/route.ts` (POST):
  - Vhod: `{ session_id: string }`.
  - S `STRIPE_SECRET_KEY` klicati `stripe.checkout.sessions.retrieve(session_id)`.
  - Iz session `metadata.orderId` vzeti id naročila.
  - Posodobiti naročilo na status `"paid"` (ali `"confirmed"`): v projektu že obstajata `updateOrderStatus` (mock) in `updateFirestoreOrderStatus` (Firestore). V `ordersData` lahko dodamo funkcijo `updateOrderStatus(orderId, status)` in jo kličemo iz API route (samo Firestore na serverju; mock posodobiš na clientu, če kličeš iz success strani).
- **Success stran:** ob loadu (če je `session_id` v URL) pokliče `POST /api/checkout/success` z `session_id`; API posodobi status. Nato prikaže “Plačilo uspešno” in link na “Moja naročila”.

**Pomembno:** Na serverju imaš dostop le do Firestore, ne do localStorage. Torej:
- Če uporabljate samo mock: success stran lahko na clientu kliče `updateOrderStatus(orderId, "paid")` za mock in (po želji) API za Firestore, če ga boste kasneje vključili.
- Če uporabljate Firestore: API route naj posodobi le Firestore; id naročila naj bo enak v mocku in Firestoreu (en id iz `createOrder`), kot opisano v odstavku o id-jih zgoraj.

### 3.6 Enoten orderId (priporočilo)

Da lahko po plačilu posodabljate isto naročilo v mocku in Firestoreu:

- V `ordersData.createOrder`: najprej ustvari naročilo v mocku (`mockCreateOrder`), da dobiš `order.id`.
- Pri pisanju v Firestore klicati funkcijo, ki v Firestore zapiše naročilo z **tem istim** `order.id` (npr. `setDoc(doc(db, ORDERS_COLL, order.id), { ... })`), namesto `addDoc`. To zahteva manjšo prilagoditev `createFirestoreOrder` (sprejme `orderId` ali celoten `order` in uporabi `setDoc` z danim id). To naj Cursor uredi ob implementaciji.

---

## 4. Povzetek datotek

| Akcija | Datoteka |
|--------|----------|
| Nova | `src/app/api/checkout/session/route.ts` |
| Nova (opcijsko) | `src/app/api/checkout/success/route.ts` |
| Nova | `src/app/checkout/success/page.tsx` |
| Nova | `src/app/checkout/cancel/page.tsx` |
| Spremenjena | `src/app/customer/confirmation/page.tsx` |
| Spremenjena (minimalno) | `src/types/order.ts` – dodati `"paid"` v `OrderStatus` (ali brez, če uporabite “confirmed”) |
| Spremenjena (po želji) | `src/lib/ordersData.ts` – eksport `updateOrderStatus` in/ali klic Firestore z istim id |
| Spremenjena (po želji) | `src/lib/firestoreClient.ts` – `createFirestoreOrder` z uporabo danega `orderId` (setDoc) |
| Spremenjena (prikaz statusa) | `src/app/customer/orders/page.tsx` in `[id]/page.tsx` – prikaz statusa “Plačano” če dodate `"paid"` |

---

## 5. Varnost in testni način

- Zagnati **samo** s testnimi ključi (`pk_test_...`, `sk_test_...`).
- V kodi **ne** vključevati live ključev niti pogojev za live.
- Za testno kartico uporabi npr. `4242 4242 4242 4242`, poljuben datum v prihodnosti, poljuben CVC.

Ko boš zunaj Cursorja naredil korake iz razdelka 2, lahko v Cursorju odpreš ta načrt in rečeš: “Implementiraj Stripe Checkout po docs/PLAN-stripe-checkout.md” ali prilepiš svoj originalni prompt; načrt je z njim skladen in ga le dopolnjuje s konkretnimi datotekami in prilagoditvami za tvoj projekt.
