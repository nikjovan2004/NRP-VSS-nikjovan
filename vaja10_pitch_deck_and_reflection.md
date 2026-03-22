# Vaja 10 – Pitch deck in zaključna refleksija (DomServices)

## Reference (na katere se opiram)

- `docs/Vaja6_defineMVP_nikjovan.md` – definicija MVP in izbrane user stories  
- `docs/Vaja5_usr_story_prio_nikjovan/product-backlog.md` – product backlog in prioritete  
- `docs/vaja9_tehnicni_koncept_in_validacija_domservices.md` – arhitektura, integracije in validacijski scenarij  

---

## Pitch deck (8–10 “slide‑ov”) + govor

### Slide 1 – DomServices (intro)

- **DomServices**: AI‑podprta platforma za povezovanje uporabnikov in ponudnikov lokalnih storitev  
- Hitro iskanje → termin → plačilo → izvedba storitve → ocena  
- Avtor: Nik Jovan • (šola) • (datum)

**Govor:**  
Živjo, danes predstavljam DomServices – idejo “Wolt/Uber za lokalne storitve”, kot so vodovodarji, električarji, čistilci ali vrtnarji. Fokus je na tem, da uporabnik v par minutah najde zaupanja vrednega izvajalca, vidi razpoložljivost, rezervira termin in opravi plačilo. Pokazal bom problem, rešitev, MVP, tehnično izvedljivost in kam bi šel projekt naprej.

---

### Slide 2 – Problem

- Trg je razdrobljen: Facebook skupine, kontakti, priporočila, zastarele strani  
- Dogovarjanje je počasno (klici, čakanje na odgovor, nejasna razpoložljivost)  
- Nizko zaupanje: nepreverjeni izvajalci, nejasne ocene, nejasna cena  
- Plačila pogosto ročna (gotovina/nakazila), brez zaščite uporabnika

**Govor:**  
Danes, ko nekdo rabi lokalno storitev, je proces presenetljivo neefektiven: najprej sploh ne veš, koga poklicati, potem čakaš na odgovor in ne veš, ali je izvajalec res prost. Poleg tega je zaupanje problem – ocene niso vedno verificirane in cena pogosto ni jasna vnaprej. Na koncu se dogaja še ročno plačevanje, kjer uporabnik nima nobene zaščite, če gre kaj narobe.

---

### Slide 3 – Rešitev: DomServices MVP

- AI‑podprto iskanje (xAI Grok): opis problema → kategorija/mesto/intent  
- Profili ponudnikov: storitve, lokacija, cena, ocene, status “preverjen”  
- Rezervacija termina + razpoložljivost (provider calendar + sloti)  
- Plačilo (Stripe test mode) + email potrditev (Brevo)

**Govor:**  
DomServices je enotna platforma, kjer uporabnik začne z naravnim opisom problema – AI prevede opis v kategorijo in lokacijo ter predlaga najbolj relevantne ponudnike. V profilu vidiš storitve, ceno in ocene, hkrati pa lahko takoj izbereš termin. Plačilo poteka prek Stripe Checkout v testnem načinu in po naročilu dobiš potrditev tudi po e‑mailu prek Brevo. Namen MVP-ja je dokazati, da ta end‑to‑end tok res zmanjša trenje.

---

### Slide 4 – Uporabnik / trg

- **Stranke:** lastniki stanovanj/hiš (25–65), najemniki, mali poslovni uporabniki  
- **Ponudniki:** lokalni obrtniki in storitveni ponudniki (1–20 naročil/mesec)  
- Slovenija: lokalni “on‑demand services” trg je velik in raste (digitalizacija storitev)  
- Start fokus: 1 regija (npr. Velenje + okolica) → postopna širitev

**Govor:**  
Ciljni uporabniki so predvsem lastniki domov in stanovanj, ki želijo hitro in zanesljivo rešitev, brez dolgega dogovarjanja. Na drugi strani so ponudniki – samostojni obrtniki ali manjša podjetja, ki danes termine in stranke pogosto urejajo ročno. Trg lokalnih storitev je velik, a slabo digitaliziran. Zato ima smisel začeti lokalno – z eno regijo – in nato širiti model na druga mesta.

---

### Slide 5 – MVP: kaj je vključeno in kaj ne

- Ključne funkcije (MVP): AI iskanje, profili, booking, plačilo (test), obvestila, chat, ocene  
- “Verified” po prvi uspešni storitvi + oddani oceni (povečanje zaupanja)  
- Namen MVP-ja: dokazati **jedrno vrednost**, ne zgraditi vsega (analitike, naprednih payoutov ipd.)

**Govor:**  
MVP pokriva osnovni življenjski cikel: uporabnik najde ponudnika, rezervira termin, plača, spremlja status in komunicira prek chata. Dodan je tudi mehanizem ocen, ki hkrati služi kot osnova za “verifikacijo” – ponudnik postane preverjen šele po prvi uspešno zaključeni storitvi in oceni. Namen MVP-ja je hitro testirati hipoteze o zaupanju, hitrosti in uporabnosti AI matchinga; napredne funkcije, kot so analitika ali pravi escrow payout, so zavestno preložene.

---

### Slide 6 – Poslovni model

- Naročniški paketi za ponudnike: **Free / Pro / Business** (mesečna naročnina)  
- Dodatno (kasneje): provizija na transakcijo, premium pozicioniranje, B2B paketi  
- Monetizacija je usmerjena v ponudnike, ker jim platforma prinaša lead‑e in manj administracije

**Govor:**  
Glavni poslovni model so naročnine za ponudnike, ker je njim najlažje dokazati ROI: več povpraševanj, manj časa za dogovarjanje in boljša organizacija terminov. V MVP je to zaenkrat prikazano vizualno s pricing stranjo. V prihodnosti bi lahko dodal še provizijo na transakcijo ali premium pozicioniranje v iskanju, predvsem ko je dovolj ponudnikov in povpraševanja.

---

### Slide 7 – Konkurenca in diferenciacija

- Alternativa danes: Facebook/WhatsApp, telefonski klici, splošni imeniki, “directory” portali  
- Slabosti alternativ: ni real‑time razpoložljivosti, ni end‑to‑end toka, ni zaščitenih plačil  
- DomServices diferenciatorji: AI matching + booking + integrirano plačilo + verificirane ocene (vezane na naročila)

**Govor:**  
Večina konkurence je v resnici “neformalna”: skupine, priporočila in klici. Obstajajo tudi imeniki, ampak so v praksi le seznam kontaktov – še vedno moraš ročno dogovarjati termin in ceno. DomServices se razlikuje v tem, da želi dati uporabniku celoten tok v eni aplikaciji: AI razume zahtevo, prikaže ustrezne ponudnike, pokaže razpoložljivost, omogoči rezervacijo in plačilo, ter podpre komunikacijo in ocene, ki so vezane na realna naročila.

---

### Slide 8 – Tehnična izvedljivost (proof)

- Stack: **Next.js**, **Firebase Auth + Firestore**, **xAI Grok**, **Stripe (test)**, **Brevo (SMTP)**  
- API routes v Next.js: AI (`/api/search/ai`), Stripe (`/api/checkout/*`), email (`/api/email/*`)  
- Prototip je end‑to‑end preizkušen: iskanje → booking → Stripe test checkout → email potrditev

**Govor:**  
Tehnična izvedljivost je dokazana z delujočim prototipom. Next.js App Router pokriva frontend in server API routes, Firestore pa služi kot podatkovna baza. AI komponenta je integrirana prek xAI Grok API in vrača strukturirane rezultate, ki jih nato uporabimo za ujemanje ponudnikov. Plačilo je narejeno prek Stripe Checkout v testnem načinu, kar pomeni, da kartičnih podatkov nikoli ne obdelujemo mi. Za obvestila smo dodali še e‑mail prek Brevo SMTP.

---

### Slide 9 – Naslednji koraki

- Beta pilot: 10–20 ponudnikov v eni regiji (npr. Velenje) + 30–50 uporabnikov  
- Izboljšave UX: jasnejši statusi, boljši onboarding ponudnikov, boljši copy za zaupanje  
- Prehod na produkcijo: granularna Firestore pravila, monitoring, stabilnejši “real‑time”  
- Plačila: prehod iz test mode → live + (kasneje) escrow z **Stripe Connect + webhooks**

**Govor:**  
Naslednji korak bi bil majhen pilot: pridobiti nekaj realnih ponudnikov in uporabnikov, da dobimo realne podatke o uporabi. Hkrati bi izboljšal UX – predvsem komunikacijo statusov in onboarding. Tehnično bi bilo treba pripraviti produkcijska pravila v Firestore in dodati osnovni monitoring. Pri plačilih je jasna pot: začeti z enostavnim checkoutom, potem pa postopoma nadgraditi na escrow model s Stripe Connect in webhooki.

---

### Slide 10 – Zaključek / Call to action

- Vizija: “go‑to” platforma za lokalne storitve v Sloveniji  
- Vrednost: manj časa, več zaupanja, več transparentnosti  
- Prosim za feedback: kaj je najbolj uporabno, kaj manjka, bi to uporabljali?

**Govor:**  
Za konec: DomServices želi biti enostaven in zaupanja vreden način za naročanje lokalnih storitev – brez klicanja in čakanja. MVP že pokaže ključni tok od iskanja do plačila in obvestil, zato je naslednji korak validacija z realnimi uporabniki. Z veseljem sprejmem feedback: kaj je v aplikaciji najbolj prepričljivo, kaj je zmedeno in katere funkcije bi bile za vas “must have”.

---

## Refleksija

Na začetku sem imel širšo vizijo platforme (AI iskanje, razpoložljivost, plačila, escrow, obvestila, chat, verifikacije). Med razvojem se je pokazalo, da je za realen produkt treba disciplinirati obseg: najprej zgraditi **end‑to‑end prototip**, ki daje občutek “delujočega sistema” in omogoča validacijo ključnih hipotez. Tudi pri integracijah so bile spremembe: namesto prvotno načrtovanega ponudnika AI sem uporabil **xAI Grok**, pri obvestilih sem poleg in‑app dodal še **Brevo email**, pri plačilih pa sem najprej implementiral **Stripe Checkout v test mode**, ker je to najhitrejši način za verodostojen payment flow brez realnega denarja.

Z današnjim znanjem bi nekatere stvari naredil drugače. Prvič, prej bi se fokusiral na **varnost in pravila dostopa** (Firestore rules) ter bolj jasno definiral, kdo sme brati/pisati katere dokumente, ker je to ključni del produkcijske priprave. Drugič, več testiranja z uporabniki bi naredil **pred** implementacijo vseh funkcij – že 2–3 kratki usability testi bi mi prej pokazali, katere stvari so nejasne (terminologija, statusi naročila, pomen “verified”). Tretjič, pri plačilih bi prej sprejel odločitev o strategiji: MVP checkout vs. pravi escrow – in to jasno ločil kot “zdaj” in “kasneje”.

Ključne lekcije so bile tako tehnične kot produktne: tehnično sem se naučil integrirati več zunanjih sistemov (AI, plačila, email) in jih povezati v en tok, produktno pa, kako pomembno je definirati MVP tako, da omogoča učenje in validacijo, ne pa perfekcije. V procesu razvoja sem tudi bolje razumel, da zaupanje (verifikacija, ocene, transparentna cena, jasni statusi) ni “bonus”, ampak jedro izkušnje pri naročanju lokalnih storitev.

