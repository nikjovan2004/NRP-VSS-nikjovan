# Načrt: Intent (search / alert / book) v AI iskanju

## Cilj

- **Search (trenutno):** "Vodovodar v Velenju" → prikaže rezultate.
- **Alert:** "Obvesti me, ko se pojavi vodovodarstvo v Kopru" → shrani željo, ob novem ponudniku pošlje obvestilo.
- **Book:** "Rezerviraj mi termin za vodovodarstvo v Velenju v ponedeljek, 16. marca med 14.00 in 18.00" → prikaže ustrezne ponudnike s predizpolnjenim datumom/časom in vodi v rezervacijo.

---

## 1. API route `/api/search/ai` – razširjen odgovor (intent + book polja)

### 1.1 Spremembe v `src/app/api/search/ai/route.ts`

- **Tip `AiSearchResult`** razširiti z:
  - `intent: "search" | "alert" | "book"` (privzeto `"search"`).
  - Za `intent: "book"`: `date: string | null` (YYYY-MM-DD), `timeStart: string | null` (HH:mm), `timeEnd: string | null` (HH:mm).

- **System prompt** dopolniti:
  - Če uporabnik želi **obvestilo**, ko se pojavi ponudnik (npr. "obvesti me ko se pojavi vodovodarstvo v Kopru") → `intent: "alert"`, `category`, `city`.
  - Če uporabnik želi **rezervirati termin** (npr. "rezerviraj mi termin za vodovodarstvo v Velenju v ponedeljek, 16. marca med 14.00 in 18.00") → `intent: "book"`, `category`, `city`, `date` (2026-03-16), `timeStart` (14:00), `timeEnd` (18:00).
  - Sicer → `intent: "search"`.

- **Parsiranje** v `parseJsonFromResponse`: prebrati `intent`, `date`, `timeStart`, `timeEnd` in jih validirati (intent enum; datum in časi opcijsko).

---

## 2. Firestore – kolekcija `alerts`

### 2.1 Struktura

- **Kolekcija:** `alerts` (ali `alertSubscriptions`).
- **Dokument:** avto-ID ali `userId_category_city` za enkratnost.
- **Polja:** `userId` (string), `category` (string: plumber | electrician | cleaner | gardener | other), `city` (string), `createdAt` (timestamp ali ISO string).

### 2.2 Firestore client – `src/lib/firestoreClient.ts`

- `addFirestoreAlert(userId, category, city): Promise<void>` – ustvari dokument (npr. z `userId` + `category` + `city` za enkratno željo po uporabniku/kategoriji/mestu).
- `getFirestoreAlertsByCategoryAndCity(category, city): Promise<{ userId: string }[]>` – poizvedba `where("category", "==", category).where("city", "==", city)`.

### 2.3 Data layer – `src/lib/alertsData.ts` (nov)

- `addAlert(userId, category, city): Promise<void>` – pri Firebase vklopljenem kliče `addFirestoreAlert`, sicer mock (npr. localStorage).
- `getAlertsByCategoryAndCity(category, city): Promise<{ userId: string }[]>` – za interno uporabo pri obvestilih (Firestore ali mock).

### 2.4 Pravila in indeksi

- **firestore.rules:** za `alerts`: branje/pisanje samo lastnik (create: `request.auth.uid == request.resource.data.userId`; read: lastnik svojih). Za "notify on new provider" bo klient (ponudnik) bral vse alerts za category+city – zato lahko za MVP pustimo obstoječa pravila (auth != null) ali dodamo pravilo, da prijavljeni lahko berejo alerts (samo za ta poizvedbi).
- **firestore.indexes.json:** sestavljen indeks za `alerts`: `category` (ASC), `city` (ASC).

---

## 3. Obvestila ob novem ponudniku

### 3.1 Preslikava ponudnik → kategorija

- V `src/lib/aiSearch.ts` (ali v `src/lib/alertsData.ts`) funkcija **`providerToCategory(provider): AiSearchResult["category"] | null`**: glede na `provider.services` in `bio` (npr. vsebuje "vodovod" → plumber, "elektrik" → electrician, "čiščenje" → cleaner, "vrt"/"trava"/"kosenje" → gardener) vrne kategorijo ali null.

### 3.2 Kje klicati "obvesti naročnike"

- **Klic po shranjenem profilu ponudnika:** v `src/lib/providersData.ts` v `upsertProvider` po uspešnem `setFirestoreProvider` (in po `upsertDynamicProvider`) klicati helper **`notifyAlertsForNewProvider(provider)`**.

### 3.3 Helper `notifyAlertsForNewProvider`

- **Lokacija:** npr. `src/lib/alertsData.ts` ali `src/lib/notificationsData.ts`.
- **Logika:**
  1. Izračunaj `category = providerToCategory(provider)`; če null, končaj.
  2. `alerts = await getAlertsByCategoryAndCity(category, provider.location)` (Firestore/mock).
  3. Za vsak `alert.userId`: klicati `addNotification(userId, "Nov ponudnik", "V vaši lokaciji je na voljo …", link na rezultate/iskanje za to kategorijo in mesto)`.
  4. (Opcijno) po pošiljanju obvestil odstraniti ali označiti te alerts, da ne spammamo ob vsaki posodobitvi – za MVP lahko obvestimo ob vsaki ujemanju (ali dodamo "notifiedAt" in obveščamo samo enkrat na alert).

---

## 4. Stranka – iskanje in intent

### 4.1 Kje se kliče AI

- Trenutno: uporabnik na **Search** vnese poizvedbo in klikne Išči → preusmeritev na **Results** z `?q=...`; na Results se kliče `runAiSearch(q)` in prikažejo rezultati.
- Sprememba: **najprej na Search strani** poklicati AI (pred preusmeritvijo), da dobimo `intent`.

### 4.2 Spremembe na Search strani – `src/app/customer/search/page.tsx`

- Ob submitu **ne** takoj `router.push(/customer/results?q=...)`.
- Poklicati **`runAiSearch(query)`** (ali direktno fetch na `/api/search/ai`).
- Glede na odgovor:
  - **`intent: "alert"`:**  
    - Klicati `addAlert(user.id, category, city)` (alertsData).  
    - Prikazati sporočilo: "Obvestilo nastavljeno. Ko se v [city] pojavi [kategorija], vas bomo obvestili."  
    - Ne preusmeriti na results (ali povezava "Nazaj na iskanje").
  - **`intent: "book"`** ali **`intent: "search"`:**  
    - Shraniti celoten AI odgovor v **sessionStorage** (npr. ključ `domservices-last-ai-result`) z `intent`, `category`, `city`, `keywords`, `date`, `timeStart`, `timeEnd`.  
    - Preusmeriti na `/customer/results?q=${encodedQuery}`.

### 4.3 Spremembe na Results strani – `src/app/customer/results/page.tsx`

- Ob nalaganju prebrati **sessionStorage** `domservices-last-ai-result`.
- Če je **`intent: "book"`** in so prisotni `date`, `timeStart`, `timeEnd`:
  - Prikazati samo ponudnike, ki ustrezajo kategoriji in mestu **in** imajo vsaj en prost termin v intervalu `[date, timeStart–timeEnd]` (uporaba `mockGetAvailability` / podatkov o zasedenosti).
  - V povezavah "Rezerviraj" (na karticah ponudnikov) uporabiti že izbrani termin: npr. `href={/customer/book/${id}?date=${date}&start=${timeStart}&end=${timeEnd}}` (če ima ponudnik tak termin; sicer lahko prikažeš prvi prosti v tem oknu).
- Če je **`intent: "search"`** ali ni intenta: obstoječe obnašanje (samo category + city + keywords).
- Po uporabi lahko sessionStorage za last-ai-result počistiš (npr. po prikazu rezultatov), da naslednje iskanje ne uporabi starega intenta.

### 4.4 Povezava "Rezerviraj" na Results

- Trenutno: na Results so kartice s povezavo na `/customer/provider/[id]` (profil), ne direktno na book.
- Za intent "book": na karticah prikazati gumb **"Rezerviraj"**, ki vodi na `/customer/book/[id]?date=...&start=...&end=...` (če imamo predizbrani termin). Če termin ni natančno določen (npr. samo datum), lahko `start`/`end` pustimo prazna in na book strani prikažeš razpoložljive termine za ta dan.

---

## 5. Razširitve v `src/lib/aiSearch.ts`

- **Tip `AiSearchResult`** razširiti z `intent`, `date`, `timeStart`, `timeEnd` (skladno z API).
- **`runAiSearch`:** že vrača odgovor API-ja; client ga samo posreduje naprej. Preveriti, da API vrača te nove atribute in jih tipiziraš.
- **Funkcija `providerToCategory(provider)`:** eksportirana, uporabljena v alertsData (ali kjer kličeš `notifyAlertsForNewProvider`). Preslikanje storitev/bio na eno od kategorij (plumber, electrician, cleaner, gardener, other).

---

## 6. Book stran – predizpolnjen datum/čas

- **`src/app/customer/book/[id]/page.tsx`** že prebira `date`, `start`, `end` iz `searchParams`. Če prihajamo z Results z intent=book in predizbranim terminom, te parametre že podamo v URL. Ni nujno spreminjati book strani, razen če želiš pri praznih params prikazati drugačen tekst (npr. "Izberite termin").

---

## 7. Moja opozorila (opcijsko za MVP)

- Stran **`/customer/alerts`** (ali podsekcija v nastavitvah): seznam shranjenih alertov (userId iz auth), možnost brisanja. Za MVP lahko preskočiš in dodaš kasneje; shranjevanje in pošiljanje obvestil delata že z alerts kolekcijo in `notifyAlertsForNewProvider`.

---

## 8. Vrstni red implementacije

1. **API + tipi** – razširitev `/api/search/ai` z intent, date, timeStart, timeEnd; posodobitev tipov v route in v `aiSearch.ts`.
2. **Firestore + alertsData** – kolekcija `alerts`, `addFirestoreAlert`, `getFirestoreAlertsByCategoryAndCity`, `alertsData.ts` (addAlert, getAlertsByCategoryAndCity), indeks in pravila.
3. **providerToCategory + notifyAlertsForNewProvider** – preslikava ponudnik→kategorija in klic po `upsertProvider`; uporaba `addNotification` za ustrezne userId.
4. **Search stran** – klic AI ob submitu; ob intent=alert shraniti alert in prikazati sporočilo; ob search/book shraniti AI rezultat v sessionStorage in preusmeriti na results.
5. **Results stran** – branje sessionStorage; za intent=book filtriranje po razpoložljivosti in predizpolnjeni povezavi na book z date/start/end; za book prikaz gumba "Rezerviraj" s pravilnimi query params.

---

## 9. Datoteke – povzetek

| Datoteka | Akcija |
|----------|--------|
| `src/app/api/search/ai/route.ts` | Razširiti prompt in parsiranje (intent, date, timeStart, timeEnd). |
| `src/lib/aiSearch.ts` | Razširiti AiSearchResult, dodati providerToCategory. |
| `src/lib/firestoreClient.ts` | addFirestoreAlert, getFirestoreAlertsByCategoryAndCity. |
| `src/lib/alertsData.ts` | Nova: addAlert, getAlertsByCategoryAndCity, notifyAlertsForNewProvider. |
| `src/lib/providersData.ts` | Po uspešnem upsertProvider klicati notifyAlertsForNewProvider(provider). |
| `src/app/customer/search/page.tsx` | Submit → runAiSearch → ob alert shraniti in sporočilo; ob search/book sessionStorage + redirect na results. |
| `src/app/customer/results/page.tsx` | Branje last-ai-result; za intent=book filtrirati po availability in predizpolniti link na book. |
| `firestore.rules` | Pravila za `alerts` (branje/pisanje po potrebi). |
| `firestore.indexes.json` | Sestavljen indeks za alerts (category, city). |
| `docs/PLAN-intent-alert-book.md` | Ta načrt (že ustvarjen). |

---

## 10. Testni primeri

- "Obvesti me, ko se pojavi vodovodarstvo v Kopru" → alert shranjen, sporočilo; ustvariš ponudnika (Vodovod, Koper) in shraniš profil → stranka prejme obvestilo.
- "Rezerviraj mi termin za vodovodarstvo v Velenju v ponedeljek, 16. marca med 14.00 in 18.00" → results prikažejo vodovodarje v Velenju z razpoložljivostjo v tem oknu; "Rezerviraj" vodi na book z date=2026-03-16&start=14:00&end=18:00 (ali prvim prostim terminom v tem intervalu).
