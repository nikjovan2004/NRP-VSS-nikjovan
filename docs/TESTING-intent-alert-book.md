# Testiranje: iskanje, obvestila in rezervacija (AI intent)

Kako ročno preveriti funkcionalnosti **search**, **alert** in **book** po implementaciji iz `PLAN-intent-alert-book.md`.

---

## 1. Priprava

- **Zaženi aplikacijo**
  ```bash
  npm run dev
  ```
  Odpri npr. `http://localhost:3000`.

- **AI iskanje:** V `.env.local` mora biti nastavljen `XAI_API_KEY` (xAI Grok), sicer bo iskanje padlo na fallback po ključnih besedah.

- **Prijava kot stranka (customer)**  
  Če še nimaš uporabnika:
  - Odpri `/auth/customer/register`, se registriraj (npr. email + geslo) z vlogo **Stranka**.
  - Nato se prijavi na `/auth/customer/login`.

- Za test **obvestil** boš potreboval tudi **ponudnika (provider)** (korak 3).

---

## 2. Test **Iskanja (search)**

1. Pojdi na **Pristajalna stran / iskanje** (npr. `/customer/search`).
2. Vpiši npr.:
   - *"Potrebujem popravilo pušilke v kuhinji"*
   - *"Iščem čiščenje stanovanja v Ljubljani"*
3. Klikni **Išči**.
4. **Pričakovano:** Preusmeritev na rezultate, seznam ponudnikov, ki ustreza kategoriji in (če je navedeno) mestu. Badge „Rezultati z AI (xAI Grok)“, če je bil uporabljen AI.

Če AI ni na voljo (npr. brez `XAI_API_KEY`), bo iskanje šlo po ključnih besedah in rezultati so lahko drugačni.

---

## 3. Test **Obvestil (alert)**

Ideja: stranka nastavi željo „Obvesti me, ko se pojavi [storitev] v [mesto]“. Ko kdo (ponudnik) shrani profil, ki ustreza tej kategoriji in mestu, stranka dobi obvestilo.

### 3a. Nastavitev obvestila (kot stranka)

1. Prijavljen kot **stranka**, odpri `/customer/search`.
2. Vpiši npr.:
   - *"Obvesti me, ko se pojavi vodovodarstvo v Kopru"*
   - *"Želim biti obveščen, ko bo na voljo elektrika v Celju"*
3. Klikni **Išči**.
4. **Pričakovano:** Sporočilo v zelenem: „Obvestilo nastavljeno. Ko se v Koper/Celje pojavi … vas bomo obvestili.“ (brez preusmeritve na rezultate.)

Če **ne** navedete mesta (npr. samo „Obvesti me za vodovodarstvo“), bi se moral prikazati opozorilni tekst, da je treba navesti mesto.

### 3b. Sprožitev obvestila (nov/posodobljen ponudnik)

1. Odjavi se ali odpri drug brskalnik/inkognito.
2. Registriraj se kot **ponudnik** (npr. `/auth/provider/register`) in se prijavi.
3. Pojdi na urejanje profila ponudnika (dashboard ponudnika → profil / nastavitve).
4. Nastavi:
   - **Lokacija:** isto mesto kot v obvestilu (npr. **Koper** ali **Celje**),
   - **Storitve / opis:** tako, da ustreza kategoriji (npr. za Koper „Vodovod, popravilo pušilk“, za Celje „Elektrika, montaža svetilk“).
5. Shrani profil (Submit / Shrani).
6. **Pričakovano:** V backendu se kliče `notifyAlertsForNewProvider`; vsi, ki imajo alert za to kategorijo in mesto, dobijo obvestilo.

### 3c. Preverjanje obvestila pri stranki

1. Ponovno se prijavi kot **stranka** (tista, ki je nastavila obvestilo).
2. Pojdi na stran z obvestili (če jo imaš v glavi / dropdown – npr. ikona zvončka ali `/customer/notifications`).
3. **Pričakovano:** Novo obvestilo z besedilom v smislu „Nov ponudnik v vaši lokaciji – V [mesto] je na voljo [kategorija]: [ime ponudnika].“

**Opomba:** Če ne uporabljate Firestore, so obvestila in alerti shranjeni v **localStorage** (mock). Ob brisanju podatkov brskalnika bodo izgubljeni.

---

## 4. Test **Rezervacije (book)**

Ideja: uporabnik napiše željo za termin (datum + čas). Sistem razpozna intent „book“, filtrira ponudnike po kategoriji, mestu in **razpoložljivosti** v tem terminu in prikaže povezavo **Rezerviraj**.

1. Prijavljen kot **stranka**, odpri `/customer/search`.
2. Vpiši npr.:
   - *"Rezerviraj mi termin za vodovodarstvo v Velenju v ponedeljek 3. marca med 14:00 in 18:00"*
   - Ali z dnevom, ki pade v naslednjih 7 dneh (mock razpoložljivost ima privzete termine za 7 dni: 09:00–12:00 in 14:00–18:00), npr.:
   - *"Želim rezervacijo za čiščenje v Ljubljani 5. marca od 14:00 do 18:00"*
3. Klikni **Išči**.
4. **Pričakovano:**
   - Preusmeritev na rezultate.
   - Samo ponudniki, ki imajo v tem terminu **prost termin** (in ustreza kategoriji/mestu).
   - Pri vsakem ponudniku gumb **Rezerviraj**.
5. Klikni **Rezerviraj** pri enem ponudniku.
6. **Pričakovano:** Odpre se stran rezervacije (`/customer/book/[id]`) z že izpolnjenim datumom in časom (date, start, end v URL).

**Pomembno:** Če so vsi ponudniki za to mesto/kategorijo že „zasedeni“ v tem terminu (v mock podatkih), lahko seznam ostane prazen. V tem primeru poskusi drug datum ali drug čas (npr. 09:00–12:00) znotraj naslednjih 7 dni.

---

## 5. Hitri pregled

| Funkcionalnost | Kje | Kaj vnesti (primer) | Kaj preveriš |
|----------------|-----|---------------------|--------------|
| **Search** | `/customer/search` | „Popravilo pušilke v Ljubljani“ | Rezultati, AI badge |
| **Alert** | `/customer/search` | „Obvesti me, ko se pojavi vodovodarstvo v Kopru“ | Zeleno sporočilo; nato ponudnik v Koper → obvestilo pri stranki |
| **Book** | `/customer/search` | „Rezerviraj termin za vodovodarstvo v Velenju 3.3. med 14:00 in 18:00“ | Rezultati s filtrom po razpoložljivosti, gumb Rezerviraj → book stran z datumom/časom |

---

## 6. Težave in namige

- **Ni rezultatov pri „book“:** Preveri, da je datum v naslednjih 7 dneh in čas npr. 09:00–12:00 ali 14:00–18:00 (privzeti mock sloti). Če ponudniki imajo svoj koledar (provider dashboard), lahko tam dodajo termine.
- **Obvestilo se ne sproži:** Preveri, da ima nov/posodobljen ponudnik **lokacijo** in **storitve/bio** tako, da `providerToCategory()` vrne isto kategorijo kot pri alertu (npr. vodovodarstvo → „plumber“).
- **AI vedno vrne „search“:** Preveri system prompt v `/api/search/ai` in da zahteva vsebuje jasno „obvesti me“ (alert) ali „rezerviraj/termin“ (book) in datum/čas.
