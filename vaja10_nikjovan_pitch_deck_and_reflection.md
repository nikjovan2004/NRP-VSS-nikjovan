# Vaja 10 – Pitch deck in zaključna refleksija (DomServices)

---

## Pitch deck (8–10 “slide‑ov”)

### Slide 1 – DomServices 

- **DomServices**: AI‑podprta platforma za povezovanje uporabnikov in ponudnikov lokalnih storitev  
- Hitro iskanje → termin → plačilo → izvedba storitve → ocena  
- Avtor: Nik Jovan • (šola) • (datum)


---

### Slide – Problem

- Trg je razdrobljen: Facebook skupine, kontakti, priporočila, zastarele strani  
- Dogovarjanje je počasno (klici, čakanje na odgovor, nejasna razpoložljivost)  
- Nizko zaupanje: nepreverjeni izvajalci, nejasne ocene, nejasna cena  
- Plačila pogosto ročna (gotovina/nakazila), brez zaščite uporabnika
  

---

### Slide – Rešitev: DomServices MVP

- AI‑podprto iskanje (xAI Grok): opis problema → kategorija/mesto/intent  
- Profili ponudnikov: storitve, lokacija, cena, ocene, status “preverjen”  
- Rezervacija termina + razpoložljivost (provider calendar + sloti)  
- Plačilo (Stripe test mode) + email potrditev (Brevo)


---

### Slide 4 – Uporabnik / trg

- **Stranke:** lastniki stanovanj/hiš (25–65), najemniki, mali poslovni uporabniki  
- **Ponudniki:** lokalni obrtniki in storitveni ponudniki (1–20 naročil/mesec)  
- Slovenija: lokalni “on‑demand services” trg je velik in raste (digitalizacija storitev)  
- Start fokus: 1 regija (npr. Velenje + okolica) → postopna širitev


---

### Slide-i  – MVP:

- Ključne funkcije (MVP): AI iskanje, profili, booking, plačilo (test), obvestila, chat, ocene  
- “Verified” po prvi uspešni storitvi + oddani oceni (povečanje zaupanja)  
- Namen MVP-ja: dokazati **jedrno vrednost**, ne zgraditi vsega (analitike, naprednih payoutov ipd.)


---

### Slide  – Poslovni model

- Naročniški paketi za ponudnike: **Free / Pro / Business** (mesečna naročnina)  
- Dodatno (kasneje): provizija na transakcijo, premium pozicioniranje, B2B paketi  
- Monetizacija je usmerjena v ponudnike, ker jim platforma prinaša lead‑e in manj administracije


---

### Slide  – Tehnična izvedljivost

- Stack: **Next.js**, **Firebase Auth + Firestore**, **xAI Grok**, **Stripe (test)**, **Brevo (SMTP)**  
- API routes v Next.js: AI (`/api/search/ai`), Stripe (`/api/checkout/*`), email (`/api/email/*`)  
- Prototip je end‑to‑end preizkušen: iskanje → booking → Stripe test checkout → email potrditev


---


### Konkurenca in diferenciacija

- Alternativa danes: Facebook/WhatsApp, telefonski klici, splošni imeniki, “directory” portali  
- Slabosti alternativ: ni real‑time razpoložljivosti, ni end‑to‑end toka, ni zaščitenih plačil  
- DomServices diferenciatorji: AI matching + booking + integrirano plačilo + verificirane ocene (vezane na naročila)


---

### Naslednji koraki

- Beta pilot: 10–20 ponudnikov v eni regiji (npr. Velenje) + 30–50 uporabnikov  
- Izboljšave UX: jasnejši statusi, boljši onboarding ponudnikov, boljši copy za zaupanje  
- Prehod na produkcijo: granularna Firestore pravila, monitoring, stabilnejši “real‑time”  
- Plačila: prehod iz test mode → live + (kasneje) escrow z **Stripe Connect + webhooks**


---

### Zaključek

- Vizija: “go‑to” platforma za lokalne storitve v Sloveniji  
- Vrednost: manj časa, več zaupanja, več transparentnosti  
- Prosim za feedback: kaj je najbolj uporabno, kaj manjka, bi to uporabljali?


---

## Refleksija

Na začetku sem imel širšo vizijo platforme (AI iskanje, razpoložljivost, plačila, escrow, obvestila, chat, verifikacije). Med razvojem se je pokazalo, da je za realen produkt treba disciplinirati obseg: najprej zgraditi **end‑to‑end prototip**, ki daje občutek “delujočega sistema” in omogoča validacijo ključnih hipotez. Tudi pri integracijah so bile spremembe: namesto prvotno načrtovanega ponudnika AI sem uporabil **xAI Grok**, pri obvestilih sem poleg in‑app dodal še **Brevo email**, pri plačilih pa sem najprej implementiral **Stripe Checkout v test mode**, ker je to najhitrejši način za verodostojen payment flow brez realnega denarja.

Z današnjim znanjem bi nekatere stvari naredil drugače. Prvič, prej bi se fokusiral na **varnost in pravila dostopa** (Firestore rules) ter bolj jasno definiral, kdo sme brati/pisati katere dokumente, ker je to ključni del produkcijske priprave. Drugič, več testiranja z uporabniki bi naredil **pred** implementacijo vseh funkcij – že 2–3 kratki usability testi bi mi prej pokazali, katere stvari so nejasne (terminologija, statusi naročila, pomen “verified”). Tretjič, pri plačilih bi prej sprejel odločitev o strategiji: MVP checkout vs. pravi escrow – in to jasno ločil kot “zdaj” in “kasneje”.

Ključne lekcije so bile tako tehnične kot produktne: tehnično sem se naučil integrirati več zunanjih sistemov (AI, plačila, email) in jih povezati v en tok, produktno pa, kako pomembno je definirati MVP tako, da omogoča učenje in validacijo, ne pa perfekcije. V procesu razvoja sem tudi bolje razumel, da zaupanje (verifikacija, ocene, transparentna cena, jasni statusi) ni “bonus”, ampak jedro izkušnje pri naročanju lokalnih storitev.

