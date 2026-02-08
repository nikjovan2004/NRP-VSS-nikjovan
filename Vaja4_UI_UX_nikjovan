# 🧪 Vaja 4 – UX/UI zasnova aplikacije DomServices

## 🎯 Namen vaje

Cilj vaje je oblikovati **UX in UI zasnovo** za DomServices – AI platformo za povezavo med strankami (lastniki domov/stanovanj) in ponudniki lokalnih storitev (popravila, čiščenje, vzdrževanje).  
Osredotoči se na to:

- kako uporabnik **potuje** skozi aplikacijo (flow),
- kakšen je **namen vsakega zaslona**,
- kateri **UI elementi** so na posamezni strani,
- kako **navigacija** povezuje zaslone med seboj.

Na koncu lahko na podlagi tega opisa izdelaš skice ali končni UI (Figma, Canva, Google Stitch …).

---

## 1️⃣ Seznam vseh zaslonov aplikacije

### A) Kupec (lastnik doma / najemnik)

1. Onboarding / Welcome
2. Prijava (Login)
3. Registracija (Sign up)
4. Pozabljeno geslo (Forgot password)
5. Domov (Customer Home / Dashboard)
6. Izbira lokacije (Location picker)
7. Iskanje storitve (AI + kategorije)
8. Rezultati ponudnikov (Search results)
9. Filter & sort (modal)
10. Profil ponudnika (Provider profile)
11. Izbira termina (Time selection)
12. Povzetek naročila & plačilo (Order summary & payment)
13. Potrditev naročila (Booking confirmation)
14. Moja naročila (Bookings list)
15. Podrobnosti naročila (Booking detail / tracking)
16. Chat s ponudnikom (Customer chat)
17. Ocena in mnenje (Rating & review)
18. Račun / Invoice (view invoice)
19. Obvestila (Notifications – customer)
20. Profil in nastavitve (Customer profile & settings)
21. Shranjeni naslovi (Saved addresses)
22. Priljubljeni ponudniki (Favourites)
23. Pomoč & FAQ (Help & FAQ)
24. Pravna obvestila (Terms & Privacy)
25. Napaka / prazno stanje (Error & empty state zasloni)

### B) Ponudnik (obrtnik, čistilec, vrtnar)

26. Prijava ponudnika (isti login, druga vloga)
27. Onboarding ponudnika (Onboarding checklist)
28. Nastavitev profila ponudnika (Provider profile setup)
29. Verifikacija / KYC upload
30. Dashboard ponudnika (Provider dashboard)
31. Upravljanje urnika (Schedule management)
32. Upravljanje storitev in cen (Services & pricing)
33. Podrobnosti naročila – ponudnik (Job detail)
34. Chat s stranko (Provider chat)
35. Zgodovina naročil & zaslužki (Earnings & history)
36. Izplačila (Payouts)
37. Obvestila ponudnika (Notifications – provider)
38. Nastavitve ponudnika (Provider settings)

---

## 2️⃣ UX struktura – kaj se dogaja na posamezni strani

Za vsak zaslon je spodaj:

- **Glavni namen**
- **Glavne akcije uporabnika**
- **Navigacija (kam vodijo gumbi)**

### 2.1 Onboarding / Welcome

- **Namen:** Na kratko razloži, kaj DomServices počne (hitro iskanje lokalnih mojstrov, AI filtriranje, varno plačilo).
- **Akcije:** Swipe med 2–3 informativnimi zasloni, klik na “Začni”, “Prijava”, “Registracija”.
- **Navigacija:**  
  “Začni” → Registracija ali Domov (če je uporabnik že prijavljen)  
  “Prijava” → Login  
  “Registracija” → Sign up

### 2.2 Prijava (Login)

- **Namen:** Uporabnik dostopa do svojega računa.
- **Akcije:** Vnos email/telefona in gesla, prijava, skok na “Pozabljeno geslo”.
- **Navigacija:**  
  “Log in” →  
  - če je kupec → Domov (Home)  
  - če je ponudnik → Provider dashboard  
  “Create account” → Registracija  
  “Forgot password?” → Pozabljeno geslo

### 2.3 Registracija (Sign up)

- **Namen:** Ustvari nov račun (kupec ali ponudnik).
- **Akcije:** Vnos osebnih podatkov, označitev “Sem ponudnik”, sprejem pogojev.
- **Navigacija:**  
  “Create account” →  
  - brez “Sem ponudnik” → Domov + onboarding tooltipi  
  - z “Sem ponudnik” → Onboarding ponudnika

### 2.4 Pozabljeno geslo

- **Namen:** Obnovi dostop do računa.
- **Akcije:** Vnos emaila, potrditev.
- **Navigacija:**  
  “Send reset link” → info zaslon → “Back to login”

---

### 2.5 Domov (Customer Home / Dashboard)

- **Namen:** Hiter vstop v iskanje storitev.
- **Akcije:**  
  - vnos problema v AI-iskalno polje (npr. “pušča pipa v kuhinji”),  
  - izbor kategorije (Popravila, Čiščenje, Vrt …),  
  - izbor predlaganih hitrih iskanj,  
  - klik na “Priporočeni ponudniki”.
- **Navigacija:**  
  Iskanje / kategorija → Rezultati ponudnikov  
  Ikona lokacije → Izbira lokacije  
  Spodnji meni:  
  - Home → Domov  
  - Bookings → Moja naročila  
  - Notifications → Obvestila  
  - Profile → Profil in nastavitve

### 2.6 Izbira lokacije (Location picker)

- **Namen:** Določi lokacijo storitve.
- **Akcije:** “Use my location”, ročni vnos naslova, izbira na zemljevidu, izbor shranjenega naslova.
- **Navigacija:**  
  “Confirm location” → nazaj na Domov ali Rezultate z novo lokacijo

### 2.7 Iskanje storitve (AI + kategorije)

- **Namen:** Uporabnik natančneje opiše svoj problem.
- **Akcije:** Vnos besedila, nastavitve datuma (danes, ta teden), osnovni filtri (cenovni razpon).
- **Navigacija:**  
  “Najdi ponudnike” → Rezultati ponudnikov

### 2.8 Rezultati ponudnikov

- **Namen:** Prikaz seznama najbolj ustreznih ponudnikov.
- **Akcije:** Pregled kartic, filtriranje, sortiranje, izbor ponudnika.
- **Navigacija:**  
  Klik kartice → Profil ponudnika  
  “Filter” → Filter & sort modal  
  “Nazaj” → Domov / Iskanje

### 2.9 Filter & sort (modal)

- **Namen:** Ožanje rezultatov.
- **Akcije:** Nastavitev min. ocene, cene, razdalje, “samo verificirani”, “dostopen danes”.
- **Navigacija:**  
  “Apply” → nazaj na Rezultate s posodobljenim seznamom  
  “Reset” → ponastavi filtre

### 2.10 Profil ponudnika

- **Namen:** Zgraditi zaupanje (ocene, reference, slike, cene).
- **Akcije:** Pregled informacij, storitev, ocen, galerije; klik na “Rezerviraj termin”; “Dodaj med priljubljene”.
- **Navigacija:**  
  “Rezerviraj termin” → Izbira termina  
  “Nazaj” → Rezultati  
  “Dodaj med priljubljene” → Priljubljeni

### 2.11 Izbira termina (Time selection)

- **Namen:** Izbira dneva in ure.
- **Akcije:** klik na datum, izbira časovnega termina, vnos opombe.
- **Navigacija:**  
  “Naprej na plačilo” → Povzetek & plačilo  
  “Nazaj” → Profil ponudnika

### 2.12 Povzetek naročila & plačilo

- **Namen:** Pregled naročila + izvedba plačila.
- **Akcije:** pregled podatkov, vklop/izklop “Garancija kvalitete” in “Priority booking”, vnos podatkov kartice.
- **Navigacija:**  
  “Plačaj in rezerviraj” → Potrditev naročila  
  “Nazaj” → Izbira termina

### 2.13 Potrditev naročila (Booking confirmation)

- **Namen:** Potrdi uspešno rezervacijo in pojasni naslednje korake.
- **Akcije:** Ogled naročila, vrnitev na Domov.
- **Navigacija:**  
  “Poglej naročilo” → Podrobnosti naročila  
  “Nazaj na Domov” → Domov

### 2.14 Moja naročila (Bookings list)

- **Namen:** Pregled vseh rezervacij.
- **Akcije:** Pregled kartic po statusu (prihodnja, pretekla), klik na naročilo.
- **Navigacija:**  
  Klik kartice → Podrobnosti naročila

### 2.15 Podrobnosti naročila (Booking detail)

- **Namen:** Prikaz statusa in vseh podrobnosti.
- **Akcije:** Sledenje statusu, odpiranje chata, preklic (če še možno), ogled računa po zaključku.
- **Navigacija:**  
  “Chat” → Chat s ponudnikom  
  “Poglej račun” → Račun  
  “Oceni storitev” → Ocena in mnenje  
  “Nazaj” → Moja naročila

### 2.16 Chat s ponudnikom (Customer chat)

- **Namen:** Komunikacija o detajlih storitve.
- **Akcije:** Pošiljanje sporočil, slik (slika poškodbe), dogovor o detajlih.
- **Navigacija:**  
  “Nazaj” → Podrobnosti naročila

### 2.17 Ocena in mnenje (Rating & review)

- **Namen:** Zbiranje verodostojnih ocen.
- **Akcije:** Dati oceno (zvezdice), izbrati tage, napisati komentar, poslati oceno.
- **Navigacija:**  
  “Pošlji oceno” → Podrobnosti naročila / Moja naročila  
  “Preskoči za zdaj” → Podrobnosti naročila

### 2.18 Račun / Invoice

- **Namen:** Pregled računa in prenos.
- **Akcije:** Ogled podatkov, prenos PDF, pošiljanje na email.
- **Navigacija:**  
  “Download PDF” → prenos  
  “Send to email” → pošlje račun  
  “Nazaj” → Podrobnosti naročila

### 2.19 Obvestila (Notifications – customer)

- **Namen:** Seznam vseh pomembnih dogodkov.
- **Akcije:** Klik na obvestilo.
- **Navigacija:**  
  Nova rezervacija → Podrobnosti naročila  
  Sprememba termina → Podrobnosti naročila  
  Nova ocena → Podrobnosti naročila / Ocena

### 2.20 Profil in nastavitve (Customer profile)

- **Namen:** Upravljanje računa.
- **Akcije:** Urejanje podatkov, naslovi, plačilne metode, jezik, odjava.
- **Navigacija:**  
  “Saved addresses” → Shranjeni naslovi  
  “Payment methods” → upravljanje kartic  
  “Help & FAQ” → Pomoč  
  “Legal” → Pravna obvestila  
  “Log out” → Login

### 2.21 Shranjeni naslovi (Saved addresses)

- **Namen:** Hitro izbiranje lokacije.
- **Akcije:** Dodajanje, urejanje, brisanje naslovov.
- **Navigacija:**  
  Izbira naslova pri naročilu → uporaba tega naslova

### 2.22 Priljubljeni ponudniki (Favourites)

- **Namen:** Hitro ponovno naročanje od istih ponudnikov.
- **Akcije:** pregled seznamov, klik na ponudnika.
- **Navigacija:**  
  Klik kartice → Profil ponudnika

### 2.23 Pomoč & FAQ (Help & FAQ)

- **Namen:** Odgovori na najpogostejša vprašanja.
- **Akcije:** pregled kategorij, klik na članek, kontakt podpore.
- **Navigacija:**  
  “Kontaktiraj podporo” → email / chat

### 2.24 Pravna obvestila (Terms & Privacy)

- **Namen:** prikaz pogojev uporabe in politike zasebnosti.
- **Akcije:** branje, sprejem ob registraciji.
- **Navigacija:**  
  “Nazaj” → Profil / Registracija

### 2.25 Error & empty state zasloni

- **Namen:** Prijazno obveščanje o napakah ali praznih seznamih.
- **Akcije:** “Retry”, “Adjust filters”, “Back to home”.

---

### 2.26–38 UX za ponudnika (na kratko)

- **Onboarding ponudnika:** checklist (profil, storitve, urnik, Stripe).
- **Nastavitev profila:** poslovni podatki, opis, področje dela.
- **Verifikacija:** upload dokumentov, status.
- **Dashboard:** današnja naročila, statistika.
- **Urnik:** tedenski pregled, nastavljanje razpoložljivosti.
- **Storitve & cene:** dodajanje/urejanje storitev.
- **Podrobnosti naročila (ponudnik):** potrdi/ zavrni, “na poti”, “zaključeno”, chat.
- **Chat s stranko:** podobno kot customer chat.
- **Zgodovina & zaslužki:** pregled prihodkov.
- **Izplačila:** seznam payoutov, povezava na Stripe.
- **Obvestila ponudnika:** nova naročila, spremembe, ocene.
- **Nastavitve ponudnika:** notification settings, jezik, odjava.

---

## 3️⃣ UI postavitev – ključni elementi na izbranih zaslonih

Spodaj so glavne smernice za vizualno razporeditev.

### 3.1 Domov (kupec)

- **Naslov:** “Kaj želite urediti danes?”
- **Elementi:**
  - Velik search bar z AI oznako.
  - Čipi kategorij (ikone + tekst).
  - Predlagana iskanja v obliki čipov.
  - “Priporočeni ponudniki” – horizontalni seznam kartic.
- **Navigacija:** spodnji tab bar (Home, Bookings, Notifications, Profile).

### 3.2 Rezultati ponudnikov

- **Header:** besedilo iskanja ali izbrana kategorija.
- **Elementi:**
  - vrstica s filtri (ikona Filter, Sort).
  - vertikalni seznam kartic ponudnikov (slika, ime, rating, cena, oznake).
- **CTA:** tap na kartico → Profil ponudnika.

### 3.3 Profil ponudnika

- **Header:** foto, ime, rating, “Verified”.
- **Body:** zavihki/sekcije (About, Services, Reviews, Gallery).
- **Sticky bottom bar:** cena od, gumb “Rezerviraj termin”.

### 3.4 Izbira termina

- **Zgoraj:** indikator korakov (1 Izbira mojstra, 2 Termin, 3 Plačilo).
- **Levo/center:** koledar.
- **Desno/spodaj:** seznam prostih slotov.
- **Spodaj:** gumb “Naprej na plačilo”.

### 3.5 Plačilo

- **Zgoraj:** kartica s povzetkom naročila.
- **V sredini:** opcijski toggle-i (garancija, priority).
- **Spodaj:** forma za kartico + gumb “Plačaj in rezerviraj”.

### 3.6 Rating screen

- **Zgoraj:** naslov + ime izvajalca.
- **Sredina:** velike zvezdice, čipi tagov, textarea.
- **Spodaj:** gumbi “Pošlji oceno” (primarni), “Preskoči za zdaj” (sekundarni).

### 3.7 Dashboard ponudnika

- **Zgoraj:** povzetek (današnji / tedenski prihodki).
- **Sredina:** seznam današnjih jobov (kartice z akcijami).
- **Spodaj / top nav:** zavihki (Naročila, Urnik, Storitve, Zaslužki).

---

## 4️⃣ UX skice/končni design (obvezno)

**Prva interakcija in registracija**
  
web application/stitch/projects/6488468369678298736/screens/ae7bcdef2ec04bc8aa053f040f760049<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/bb194bb0-34bb-4d7d-aacc-d36f8166c084" />

web application/stitch/projects/6488468369678298736/screens/dff578353ea94fdeac1946d248acbab7<img width="1600" height="1349" alt="image" src="https://github.com/user-attachments/assets/5a2faa1a-e2ca-4899-a14d-211bb992eeec" />

web application/stitch/projects/6488468369678298736/screens/e48e307e91db45dbaaa61e5df39b6944<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/0d2b8c97-8c7a-4729-acf3-1b8eaab56bb1" />

web application/stitch/projects/6488468369678298736/screens/5099aa457a2d44999cef5d9dd0bcc9d0<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/65ba8393-e822-47c0-828d-eb9efe2e49a9" />

web application/stitch/projects/6488468369678298736/screens/53bc9b83eaee4463b5f6659c1c917c2d<img width="1197" height="1600" alt="image" src="https://github.com/user-attachments/assets/28300a2c-fee0-45f0-9ac9-61558f575145" />


**Iskanje, izbira in rezervacija**

web application/stitch/projects/6488468369678298736/screens/50c51f045de04a7598e882825221bc76<img width="1115" height="1600" alt="image" src="https://github.com/user-attachments/assets/c9c09b02-9c70-4864-886d-ed8c45fbc4d1" />

web application/stitch/projects/6488468369678298736/screens/3a7a6c89090b4898bf8ad6f6b6e49883<img width="770" height="1600" alt="image" src="https://github.com/user-attachments/assets/a3b1bcce-4636-46e5-bbdf-985d985a1795" />

web application/stitch/projects/6488468369678298736/screens/44f5b7e1437149c4afa86555c00ce35f<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/e2b4f496-9d69-433e-bff6-6d27b2ca9247" />

web application/stitch/projects/6488468369678298736/screens/200464bf7b924900be9a260fd26be6c8<img width="1294" height="1600" alt="image" src="https://github.com/user-attachments/assets/c7cee7af-a697-45ff-8cdc-edb24b18b79e" />

web application/stitch/projects/6488468369678298736/screens/9903def650194c77bb2611b3b7ada8da<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/2a489e92-ee1e-42bc-88b3-a55904746034" />

web application/stitch/projects/6488468369678298736/screens/3b099d565c92456aa9f9725d2fdbea6e<img width="1600" height="1590" alt="image" src="https://github.com/user-attachments/assets/26d7a282-e406-4f0d-b4bb-e6f61422adc1" />

web application/stitch/projects/6488468369678298736/screens/0af6ee89b3aa468ca290ddf0b526bf71<img width="1198" height="1600" alt="image" src="https://github.com/user-attachments/assets/f7ad04d9-1c69-4f49-94f8-96ca1857c5c3" />

web application/stitch/projects/6488468369678298736/screens/4ea1a6ff5da94d5b98d392ebb28b3d6d<img width="1600" height="1501" alt="image" src="https://github.com/user-attachments/assets/83f2e829-67d9-4de5-ae94-395d1e88cf49" />

web application/stitch/projects/6488468369678298736/screens/b90187980a1e4ad08b8d1ee8960fead2<img width="1600" height="1578" alt="image" src="https://github.com/user-attachments/assets/1a95ed86-d97c-4167-9b7a-7d39b50ef6ef" />


**Opravljanje po rezervaciji**

web application/stitch/projects/6488468369678298736/screens/503b837d8edc43a08a66777c6afc66ff<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/2a884f60-99ce-46a3-b1b7-9e687e7b15f1" />

web application/stitch/projects/6488468369678298736/screens/5d405cc72938419f9445bb28da86c439<img width="1600" height="1334" alt="image" src="https://github.com/user-attachments/assets/bf67ead9-b098-4865-a598-0d8db472fc97" />

web application/stitch/projects/6488468369678298736/screens/b38b74aeb094422eb28b94449a98e5cb<img width="1600" height="1340" alt="image" src="https://github.com/user-attachments/assets/5253d325-324d-428f-a5bd-20b82d373481" />

web application/stitch/projects/6488468369678298736/screens/bad1d81479e9454ebddb163e073c11db<img width="1600" height="1389" alt="image" src="https://github.com/user-attachments/assets/6aaecb39-cf6d-4308-bf3e-23f6f4f375ed" />

web application/stitch/projects/6488468369678298736/screens/26e1ca1dbf8b4b34b58611bdb6040270<img width="1221" height="1600" alt="image" src="https://github.com/user-attachments/assets/c578443b-7371-47a0-9474-a1895228be19" />

web application/stitch/projects/6488468369678298736/screens/f2b166db0fa847c7a1db6a7f6dd98a3b<img width="1600" height="1280" alt="image" src="https://github.com/user-attachments/assets/19c373db-43ca-4c4e-97af-56199cf628cf" />

web application/stitch/projects/6488468369678298736/screens/f70598922a4e4b83af475d83a0513622<img width="1349" height="1600" alt="image" src="https://github.com/user-attachments/assets/5b749668-4989-478d-b8f9-1aa7539d1a0c" />

web application/stitch/projects/6488468369678298736/screens/e34d0c91aeea4d99a4d15a836a0e2c16<img width="1600" height="1295" alt="image" src="https://github.com/user-attachments/assets/7fab5874-24cc-4851-b21b-8ba1a1650f15" />

web application/stitch/projects/6488468369678298736/screens/ac571433d5144f48a5eaeac64dd4008a<img width="1600" height="1296" alt="image" src="https://github.com/user-attachments/assets/a1e86936-1a90-4063-8497-f5cdf1bb6830" />

web application/stitch/projects/6488468369678298736/screens/8171d57ea8f4492a9bd86a3726ebe1e8
web application/stitch/projects/6488468369678298736/screens/9f41393a2e1d454ea5068a52fe719a97<img width="1271" height="1600" alt="image" src="https://github.com/user-attachments/assets/558776f0-3f39-4e82-8af8-408166196add" />


**Poslovno okolje za ponudnike**

web application/stitch/projects/6488468369678298736/screens/5d0eadec35da4b5ab728cc8befbd9eab<img width="1600" height="1405" alt="image" src="https://github.com/user-attachments/assets/d0b1771f-095c-4b4e-84ba-439be8cde5ad" />

web application/stitch/projects/6488468369678298736/screens/8171d57ea8f4492a9bd86a3726ebe1e8<img width="1271" height="1600" alt="image" src="https://github.com/user-attachments/assets/78177be7-de4a-4bf1-96f6-158061c7e223" />

web application/stitch/projects/6488468369678298736/screens/84f7f8e10dc1416ca9bee8b9ba9ef9a1<img width="1589" height="1600" alt="image" src="https://github.com/user-attachments/assets/fbbfaad9-1e97-4c81-a191-35219aee26d6" />

web application/stitch/projects/6488468369678298736/screens/53bc9b83eaee4463b5f6659c1c917c2d<img width="1197" height="1600" alt="image" src="https://github.com/user-attachments/assets/0ffd9bdb-5d67-4725-a9d5-1cb67f8e1dba" />


web application/stitch/projects/6488468369678298736/screens/71dbbb0e58a44e478180270b3141c606<img width="1600" height="1289" alt="image" src="https://github.com/user-attachments/assets/6d0238ba-c517-4961-8f3b-8a6a33421710" />

web application/stitch/projects/6488468369678298736/screens/9f41393a2e1d454ea5068a52fe719a97<img width="1600" height="1449" alt="image" src="https://github.com/user-attachments/assets/d1460c17-1c05-4174-8c26-41380e81ba94" />



































