# DomServices – AI Platforma za povezavo med strankami in ponudniki storitev (Wolt za lokalne storitve)

---

## 1. Delovni naslov produkta

**DomServices** – AI platforma za pametno iskanje in rezervacijo storitev za popravila doma, čiščenje in nego trate z razpoložljivostjo v realnem času

---

## 2. Opis problema

### Kaj je problem?

Uporabniki in ponudniki storitev se soočajo s **razdrobljenostjo tržišča, pomanjkanjem zaupanja in neučinkovitostjo**:

- **Raztreseni ponudniki:** Popravilci, čistilci in vzdrževalci trate so raztreseni po Facebook skupinah, WhatsApp kontaktih, stari spletni strani – ni centralne platforme
- **Brez realnega časa:** Uporabniki ne vedo, kdaj je ponudnik res dostopen – morajo klicati ali čakati na odgovore (povprečno 2-4 ure)
- **Nezaupljive ocene:** Ni preverjenih ocen – te so na Facebooku, Bolhi ali neobstoječi spletni strani
- **Ročni dogovori:** Plačilo se dogaja ročno, v gotovini ali preko bank transfer – ni zaščite kupca
- **Ponudniki izgubijo čas:** Ponudniki ročno upravljajo termine, sporočila in denar – ni avtomatizacije
- **Varnost:** Goljufije pri plačilu, lažne ocene, neverodostojne Reference – ni preverjanja identitete

### Koga problem zadeva?

- **Primarni:** Lastniki domov (25-65 let) – potrebujejo hitro, zaupljivo popravilo ali čiščenje
- **Sekundarni:** Ponudniki storitev (kleparji, elektrikarji, čistilci, vrtnarji) – želijo več naročil in transparentno plačilo
- **Terciarni:** Nepremičninski agenti in upravljavci večstanovanjskih hiš – potrebujejo zanesljive storitve za svoje klijente

### Zakaj je problem pomemben?

- **slovenski trg:** Storitve za dom so vreden **€150-200 milijonov letno** – toda ročne in neorganizirane
- **Čas:** Povprečni uporabnik **porabi 1-2 uri** za iskanje pravega ponudnika in dogovor
- **Varnost:** Brez preverjanja – primeri goljufij, slabega dela, piratskih cen so pogosti
- **Ponudniki:** 10.000+ samostojnih ponudnikov v Sloveniji – potrebujejo organizirano pot do strank
- **Okoljska dimenzija:** Boljša ponovna uporaba znanja in virov (vzdrževanje + popravila zmanjšata odpadke)

---

## 3. Ciljni uporabnik

### Kdo je tipičen uporabnik (Kupec storitve)?

- **Lastnik doma ali stanovanja** (30-55 let), ki potrebuje popravilo ali čiščenje
- Ima malo časa in ne želi se dogovarjati – potrebuje hitro dostavo
- Želi zaupljive ponudnike – preverene ocene in transparentno ceno
- Plaća kartice ali prek mobilne aplikacije – ne želi gotovine

### Kdo je tipičen ponudnik?

- **Neodvisni obrtnik ali mali podjetnik** (elektrikar, kleparj, čistilka, vzdrževalec trate)
- Ima 5-20 naročil mesečno in jih ročno upravlja
- Želi več naročil in redne stranke – potrebuje centralno platformo
- Ima osnovne IT spretnosti in pametni telefon s Chrome brskalnikom

### V kakšnem okolju deluje?

- **Uporabnik:** Ima pametni telefon ali računalnik – brska iz doma ali je na poti
- **Ponudnik:** Ima pametni telefon – prejema obvestila o novih naročilih, upravljanja termine iz auta
- Oba aktivna v Sloveniji (Velenje, Ljubljana, Maribor, Celje in okolica)

### Katere težave ima v praksi?

**Uporabnik (Kupec):**
- *»Koga naj kličem? Kdo je dostopen danes?«* – ni enega mesta za iskanje
- *»Ali je res to kvaliteta?«* – boji se slabega dela in ponarejenega
- *»Kaj je prava cena?«* – ni vedenja o tržnih cenah
- *»Kako se zaščitim, če je delo slabo?«* – ni garancije

**Ponudnik:**
- *»Kako pridobim nove stranke?«* – Facebook oglasi ne delujejo
- *»Kako upravljam termine?«* – noti, papir, SMS – kaos
- *»Kako se izognem nepoštenim strankam?«* – brez preverke, včasih ga "nastavijo"
- *»Kako prejemam denar varno?«* – gotovina je tvegana, bank transfer je počasno

---

## 4. Predlagana rešitev (osnovna ideja)

### Kako tvoj IT produkt rešuje opisan problem?

**DomServices** je **spletna aplikacija**, ki kombinira:

1. **Centralna platforma za iskanje** – Vsi lokalni popravilci, čistilci in vzdrževalci trate na enem mestu
2. **Razpoložljivost v realnem času** – Ponudnik nastavi svoj urnik, uporabnik vidi "Dostopen danes 14:00-16:00" in rezervira
3. **AI filtriranje storitev** – Perplexity PRO analiza zahteve uporabnika ("popraviti moram pušilko v kuhinji") → avtomatski predlog najprimernejših ponudnikov
4. **Preverjene ocene in reference** – Samo verificirani ponudniki, ocene morajo biti verificirane preko sistema
5. **Integrirano plačilo (Stripe)** – Uporabnik plača kartice, denar se drži v escrow do odobritve, ponudnik prejme transfer
6. **Direktna in varna komunikacija** – Notranji sistem za sporočila med uporabnikom in ponudnikom
7. **Avtomatska obvestila** – Ponudnik prejme obvestilo o novem naročilu, uporabnik prejme potrditev rezervacije

**Glavna vrednost za uporabnika:** Zamenjava 2 ur iskanja + dogovarjanja na 10 minut pametnega iskanja + rezervacije.

**Glavna vrednost za ponudnika:** Avtomatska razporeditev naročil + transparentna plačila + redne stranke na enem mestu.

### Zakaj je rešitev boljša od obstoječih alternativ?

| **Značilnost** | **Facebook/WhatsApp** | **Bolha Storitve** | **Google Ads** | **DomServices** |
|---|---|---|---|---|
| Centralna baza ponudnikov | ❌ Ni | ⚠️ Osnovno | ❌ Ni | ✅ Vsi lokalni |
| Razpoložljivost v realnem času | ❌ Ročno | ❌ Ni | ❌ Ni | ✅ Live urnik |
| AI filtriranje zahtev | ❌ Ni | ❌ Ni | ❌ Ni | ✅ Perplexity PRO |
| Preverjene ocene | ⚠️ Ni sistema | ⚠️ Ni | ❌ Ni | ✅ Preverene + verified |
| Integrirano plačilo | ❌ Gotovina | ❌ Ročno | ❌ Ni | ✅ Stripe escrow |
| Direktna komunikacija | ⚠️ Brezvrstne | ⚠️ Brezvrstne | ❌ Ni | ✅ Strukturirana |
| Automatska obvestila | ❌ Ni | ⚠️ Email | ❌ Ni | ✅ Push + email + SMS |
| Dostopnost (mobilno + web) | ⚠️ Samo FB/WA | ⚠️ Osnovno | ❌ Ni | ✅ Responsive web app |

**Unikatna prednost:** Prva slovensko-jezikovana platforma, ki kombinira **AI filtriranje + razpoložljivost v realnem času + integrirano plačilo + avto-dodeljevanje** – kot "Uber za domače storitve" brez commission overhead.

---

## 5. Primer uporabe (kratek scenarij)

### Realen primer: Marija, 42 let, lastnica stanovanja

**Brez DomServices:**
- Pušilka v kuhinji pušča – potrebuje kleparja
- Kliče 3-4 bekerjeve iz spisa prijateljev, nihče ni dostopen danes
- Piše na Facebook skupino »Velenje - popravila« – čaka 4 ure na odgovore
- Dogovor se zbije s SMS → plačilo v gotovini → ni računa
- Skupni čas: **3 ure**

**S DomServices:**

1. **Iskanje storitve (1 minuta):** Marija odpre app in vnese: *»Popraviti moram pušilko v kuhinji, potrebujem danes do 18:00«*
2. **AI filtriranje:** Perplexity PRO razume zahtevo → sistem avtomatski predlaga top 5 kleparjev v Velenju, ki so dostopni danes
3. **Rezervacija (30 sekund):** Marija vidi:
   - Ime kleparja, ocene (4.8⭐ iz 12 verificiranih naročil)
   - Cena: €45 + material
   - Razpoložljivost: "Dostopen 14:00-15:30"
   - Klikne "Rezerviraj" → Stripe plačilo kartice
4. **Potrditev:** Kleparj prejme push obvestilo + SMS → "Nova rezervacija: Velenje, pušilka, danes 14:00"
5. **Izvršitev:** Kleparj pride ob 14:10, popravila (20 min) → Marija odobri delo → denar se avtomatski transferira na račun kleparja
6. **Rezultat:** V 5 minutah je Marija našla zaupljiva popravilca in ga plačala varno – brez 3 ur čakanja in dogovarjanja.

---

## 6. Raziskava tržišča in konkurence

### Stanje na slovenskem trgu

**Obstoječe "platforme":**

| Kanal | Uporabniki (mesečno) | Jakost | Slabost |
|---|---|---|---|
| **Facebook Skupine** | 50.000+ | Lokalno, socialno | Brezvrstno, brezsistematično |
| **WhatsApp kontakti** | Milijarde | Direktno | Brez ocene, ni garancije |
| **Bolha.si (storitve)** | 20.000 | Znano ime | Slaba infrastruktura za time-based storitve |
| **Google Ads** | 30.000 | Selektiven | Drago za majhne obrtnika |
| **Posamezne spletne strani** | Različno | Neorganizirano | Zastarele, brez IT |

**Velika vrzel:** Ni nobene platforme, ki bi agregirala lokalne storitve s **real-time razpoložljivostjo + AI filtriranjen + integrirano plačilo + avtomatsko dodeljevanjem**.

### Tržna priložnost

- **Slovenija:** 2,1 milijona prebivalcev
- **Vrednost tržišča:** €150-200 milijonov letno (storitve za dom)
- **Aktivne stranke:** Ocenjujem 200.000+ letnih iskanj (popravila, čiščenje, nego trate)
- **Penetracija:** Samo 5-10% trenutno na digital platformah
- **Analiza rasti:** EU trg storitev na zahtevo raste 20-25% letno (vir: Statista)
- **Potencial za DomServices:** 15% tržnega deleža = €22,5-30M vrednosti transakcij letno

### Konkurenčna analiza

**Evropski primeri:**
- **TaskRabbit (ZDA/EU)** – splošne storitve, vendar drago za male obrtnika, kompleksno
- **MyHammer (Nemčija)** – ponudniki sami nastavijo ceno, brez real-time razpoložljivosti
- **Helpling (skandinavija)** – osredotočen na čiščenje, ne na popravila
- **Handy (ZDA)** – preprost, a brez AI filtriranja

**Zaključek:** DomServices bi bil **prvi AI-powered local services marketplace v Sloveniji** s posebnim poudarkom na **real-time razpoložljivosti in avtomatski dodelitvi**.

### Viri in viri podatkov

**Raziskave in viri, na katere se opiramo:**

1. **Slovenski Statističko Društvo (2024)**
   - Slovenija: 2,1 milijona prebivalcev
   - Penetracija spletnih storitev: 65%
   - Vir: https://www.stat.si/

2. **Statista – European On-Demand Services Market (2024)**
   - EU trg storitev na zahtevo raste 20-25% letno
   - Pričakovana vrednost tržišča do 2028: €60+ milijard v EU
   - Vir: https://www.statista.com/outlook/dmo/ecommerce/on-demand-services/europe

3. **McKinsey – Future of Work (2023)**
   - 35% gospodinjstev v razvitih državah koristi vsaj eno platformo za domače storitve mesečno
   - Povprečna poraba: €80-150 mesečno
   - Vir: https://www.mckinsey.com/

4. **Eurostat – Services Sector in EU (2024)**
   - Popravila in vzdrževanje domov: €120+ milijard letno v EU
   - Samo 15-20% je digitalizirano
   - Vir: https://ec.europa.eu/eurostat

5. **GfK Consumer Survey (2023)**
   - 78% respondentov v EU preferira spletno iskanje in rezervacijo storitev
   - 85% želi vnaprej vedeti ceno
   - 72% želi reviews in reference
   - Vir: https://www.gfk.com/

6. **Pew Research – Digital Services Adoption (2024)**
   - Gen X in Millenniali: 80%+ koristi digitalne platforme za storitve
   - Boomers: 45%+ (rastoči segment)
   - Vir: https://www.pewresearch.org/

---

## 7. Tehnološke rešitve in orodja

### 🎯 IZBRANA KOMBINACIJA (Spletna aplikacija + Perplexity AI + Real-time notifications + Stripe)

#### **Frontend (Spletna aplikacija – Desktop & Mobile Web):**
- **Next.js** – SSR, hitro nalaganje, odličen SEO, preverjeno za SPA
- **Tailwind CSS** – responsive design, en layout za vse naprave
- **TanStack Query (React Query)** – upravljanje stanja in cachinga na klientu

#### **Backend (Server logika):**
- **Node.js + Express** – isti jezik kot frontend, hitrejši razvoj, lahka integracija z API-ji
- **WebSocket (Socket.io)** – real-time komunikacija (obvestila, live urnik, sporočila)

#### **Baza podatkov:**
- **Firebase Realtime Database** – real-time sinhronizacija, brezplačen free tier (do 100 hkrati aktivnih uporabnikov)
- **Firebase Authentication** – upravljanje uporabnikov, socialna prijava (Google, Facebook)

#### **AI & analiza zahtev:**
- **Perplexity PRO API** – razumevanje zahteve uporabnika ("popraviti moram pušilko") → predlog najprimernejših ponudnikov na osnovi kategorije, lokacije, ocene

#### **Plačila (Stripe):**
- **Stripe Payment Intent** – varno plačilo kartice s poudarkom na SCA/3D Secure
- **Stripe Connect** – za avtomatski transfer denarja ponudnikom
- **Stripe Webhooks** – avtomatski trigger za potrditeve in obvestila

#### **Real-time obveščanje:**

1. **Web push notifičacije (prek brskalnika)**
   - Uporaba **Push API + Notifications API** v brskalniku
   - Ponudnik: "Nova rezervacija: Popravilo pušilke, danes 14:00"
   - Uporabnik: "Kleparj je sprejet vaš naročilo"

2. **Email obvestila**
   - Potrditev rezervacije, račun, feedback zahteva
   - Ponudnik za SMS na voljo: Sendgrid / Mailgun / Brevo

3. **SMS (za ponudnike – premium)**
   - "Novo naročilo v Velenju: Popravilo pušilke, danes 14:00 – Odgovori v app"
   - Integracija z EU SMS API (npr. GatewayAPI, Infobip)

4. **In-app obvestilni center**
   - Zvonec ikona + spustni seznam zadnjih obvestil
   - Sinhronizirano s push/email/SMS

#### **Hosting & Deployment:**
- **Vercel** – hosting Next.js frontend + backend functions
- **Firebase Hosting** – statične vsebine
- **GitHub** – verzioniranje, CI/CD pipeline
- **Cloudinary** – slike (profile, galerije del)

---

## 8. Model monetizacije (kako služiti denar)

### Freemium Model – Za Ponudnike

**Brezplačni plan:**
- Do 10 naročil mesečno
- Osnovni profil (foto, opis, ocene)
- Upravljanje razpoložljivosti (urnik)
- Email obvestila

**Premium (€6,99/mesec ali €69,99/leto):**
- Neomejenih naročil
- Prioritetna vidnost v iskanju (top 3 ponudniki)
- SMS obvestila za nova naročila
- Analitika (podatki o naročilih, stopnja odobritve)
- AI predlog cen (Perplexity analiza tržnih cen)

**Pro (€14,99/mesec ali €149,99/leto):**
- Vse od Premium
- Avtomatski odgovori (bot) na pogosta vprašanja
- Integracija s kalenami (Google Calendar, Outlook)
- API dostop za custom integracijo
- Prioritetna tehnična pomoč

### Commission Model – Transakcije

- **5% provizije od vsake uspešne transakcije** (plačane prek Stripe)
- Primer: Kleparj dobi naročilo za €100 → DomServices dobi €5
- Provizija se avtomatski odšteje pri transferju denarja

### Premium Za Uporabnike (Nepripravljene storitve)

- **Opcije** (ne obvezno):
  - **Garantija kvalitete (€2):** Če je delo nepopolno, DomServices vrne denar
  - **Priority booking (+50 centov):** Rezervacija v prvih 3 minutah – ponudnik se hitro odzove

### B2B Partnerstva

- **Nepremičninski agencije / Upravljavci hiš:** €500-1000/mesec za white-label dostop
- **Zavarovalnice:** Integracija (pri zahtevku za poškodbe → direktna rezervacija popravilca prek DomServices)
- **Banke / kreditne kartice:** Kobranding (npr. "Mastercard DomServices" – special offer)

---


## 9. Zaključek

**DomServices** rešuje realen problem na realnem tržišču s pametno kombinacijo AI, real-time razpoložljivosti in integriranega plačila. V času, ko je povpraševanje po "on-demand" storitvah eksponentno naraščajoče (20-25% letno rast), je to idealna rešitev za **slovenski in širši evropski trg**.

**Unikatnost:** Prva platforma, ki kombinira **AI filtriranje zahtev (Perplexity PRO) + live razpoložljivost + integrirano plačilo + avtomatska dodelitev** – kot "Uber za domače storitve", toda brez visoke provizije in z lokalnim fokussom.

**Konkurenčna prednost:** Enostavnost za ponudnike (študente, obrtnika) + zaupanje za uporabnike (preverjene ocene + Stripe zaščita) = "network efekt" – prvi ponudnik pride, drugi se hitro sledi.

