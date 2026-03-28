# Vaja 6 – Definicija MVP za DomServices

## 1. MVP Scope – izbrane User Stories (5–8)

MVP DomServices se osredotoča na **en glavni problem**:

> Lastnik doma porabi 1–2 uri za iskanje zaupljivega ponudnika in dogovarjanje, pri tem pa nima jasne cene, razpoložljivosti in zaščite pri plačilu.

Za MVP sem izbral **7 ključnih user stories**, ki omogočajo celoten end‑to‑end tok:
od opisa problema do plačila in izvedene storitve.

### 1.1 Hitro opisovanje problema (AI iskanje)

> **Kot zaposlen lastnik doma želim, da lahko v aplikaciji v naravnem jeziku opišem svoj problem, da mi ni treba poznati natančne kategorije storitve ali strokovnih izrazov.**

Ta story omogoča, da uporabnik hitro začne – brez razumevanja, ali potrebuje vodovodarja, kleparja ali drugega mojstra. Sistem prevede uporabnikov jezik v notranje kategorije storitev.

---

### 1.2 Prikaz samo preverjenih ponudnikov

> **Kot lastnik stanovanja želim, da lahko filtriram in vidim samo preverjene ponudnike, da lahko zaupam, da je oseba, ki pride v moj dom, preverjena in zanesljiva.**

MVP mora graditi zaupanje, zato je osnovna filtracija na “preverjene” ponudnike nujna. Brez tega je tveganje za uporabnika previsoko.

---

### 1.3 Razpoložljivost v realnem času

> **Kot lastnik hiše želim, da vidim razpoložljivost ponudnikov v realnem času, da lahko takoj rezerviram termin, ki mi ustreza, brez dodatnega klicanja.**

Ključna razlikovalna vrednost DomServices je **live urnik**. Če uporabnik ne ve, kdaj je ponudnik dejansko prost, ne rešimo glavnega problema (čakanje, klicanje, maili).

---

### 1.4 Transparentna cena vnaprej

> **Kot uporabnik želim, da vidim ceno storitve še pred rezervacijo, da vem, koliko bom plačal, in se izognem neprijetnim presenečenjem.**

MVP mora že v prvi verziji jasno pokazati ceno (ali cenovni razpon), ker to močno vpliva na odločitev za rezervacijo in zmanjšuje trenje pri plačilu.

---

### 1.5 Varno plačilo s kartico + escrow

> **Kot uporabnik želim, da lahko plačam storitev s kartico znotraj aplikacije, da mi ni treba uporabljati gotovine ali tveganih nakazil.**

> **Kot uporabnik želim, da je moj denar zadržan do moje potrditve opravljenega dela, da se počutim zaščitenega pred slabo opravljenim delom ali goljufijo.**

Plačilo + escrow skupaj predstavljata **jedro zaupanja** v platformo:
uporabnik plača vnaprej, a ve, da se denar ponudniku nakaže šele, ko potrdi, da je delo opravljeno.

---

### 1.6 Obvestila o statusu naročila

> **Kot uporabnik želim, da prejemam obvestila ob vsaki spremembi statusa naročila, da vedno vem, ali je termin potrjen, ali je ponudnik na poti ali je delo zaključeno.**

Brez jasnih statusov in obvestil je uporabnik ponovno v situaciji “čakaj na odgovor”.
Obvestila so zato minimalni del MVP, da je izkušnja predvidljiva.

---

### 1.7 Vgrajen chat s ponudnikom

> **Kot uporabnik želim, da lahko komuniciram s ponudnikom preko chata v aplikaciji, da lahko delim podrobnosti in slike problema, ne da bi razkril svojo telefonsko številko.**

Chat odstrani potrebo po menjavi telefonskih številk, omogoča pošiljanje slik
in zmanjšuje nesporazume pri obsegu dela – zato je ključen za učenje o tem,
kako stranke in ponudniki dejansko komunicirajo.

---

## 2. Utemeljitev – zakaj so te stories bistvene za učenje

MVP ni “najmanj funkcionalen produkt”, ampak **najmanjši produkt, ki omogoča največ učenja**.  
Izbrani stories so kritični, ker omogočajo, da preverim naslednje ključne hipoteze:

1. **Ali uporabniki sploh želijo AI‑podprto iskanje?**  
   - S storyjem *Hitro opisovanje problema* testiram, ali je naravni jezik dovolj
     za ujemanje s pravimi storitvami in ali uporabniki to dojemajo kot resnično
     skrajšanje časa iskanja.

2. **Ali je zaupanje največji blocker pri naročanju lokalnih storitev?**  
   - *Prikaz samo preverjenih ponudnikov* + *Transparentna cena* + *Varno plačilo + escrow*
     neposredno napadajo strah pred prevaro, “črnim delom” in nejasnimi cenami.
   - Če se tu pokaže visok conversion rate, vem, da rešujem pravi problem.

3. **Ali real‑time razpoložljivost res drastično skrajša čas do rezervacije?**  
   - *Razpoložljivost v realnem času* mi omogoča meriti, ali uporabnik od prvega iskanja
     do potrditve porabi minut ali ure in ali je to ključen razlog, da ostane na platformi.

4. **Ali end‑to‑end digitalni tok (booking + plačilo + status + chat) deluje za obe strani?**  
   - *Obvestila o statusu* in *Chat* sta nujna za sprejemljivost procesa za stranko in
     ponudnika, brez dodatnega klicanja in SMS-ov.
   - S tem dobim vpogled v resnične težave v komunikaciji in logistiki (zamude, odpovedi, napačni naslovi).

Te stories skupaj pokrijejo celoten “življenjski cikel” naročila, zato lahko
iz MVP-ja izmerim:

- čas od problema do rezervacije,  
- stopnjo zaupanja (koliko uporabnikov izpolni plačilo),  
- kvaliteto matchinga (prek ocen in feedbacka),  
- pripravljenost ponudnikov, da uporabljajo digitalni urnik in sprejemajo naročila prek aplikacije.

---

## 3. Izključitve – kaj MVP NAMERNO NI

Da ostanem discipliniran pri obsegu, MVP **zavestno izpušča** naslednje user stories
in funkcionalnosti:

### 3.1 Napredne funkcionalnosti za ponudnike

- **Pregled prihodkov in statistike**  
- **Pridobivanje novih strank brez marketinga (napredni algoritmi)**  
- **Upravljanje več nepremičnin**  

**Zakaj niso nujne?**  
Za prvo verzijo je najpomembnejše, da ponudnik sploh lahko:
prejme povpraševanje, nastavi urnik, sprejme ali zavrne job in dobi plačilo.
Analitika, napredno targetiranje in podpora upraviteljem nepremičnin
so pomembne za skaliranje, ne pa za prvo učenje.

### 3.2 Garancija kakovosti kot dodatni produkt

- **Garancija kakovosti (plačljiva opcija)**

**Zakaj ni nujna?**  
Osnovno zaščito že rešuje **escrow**. Garancija bi zahtevala
dodatne pravne procese (reklamacije, reševanje sporov, kriteriji vračila),
kar presega obseg MVP. Najprej želim razumeti osnovne vzorce nezadovoljstva,
šele nato uvajati kompleksnejše mehanizme garancije.

### 3.3 Kakovost življenja / “comfort” funkcionalnosti

- **Ponovno naročanje istega ponudnika**  
- **Shranjeni naslovi**  
- **Instantna obvestila za nove jobe (napredna konfiguracija)**  

**Zakaj niso nujne?**  
Te funkcionalnosti izboljšajo uporabniško izkušnjo, ne pa ključnega učenja.
Uporabnik lahko v MVP-ju ponovno najde ponudnika prek zgodovine,
naslov vpiše ročno, ponudnik pa obvestila za nova naročila dobi v osnovni obliki.
Če se pokaže visok engagement, jih dodam v naslednjem releasu.

---

## Povzetek MVP

**MVP DomServices** je torej verzija produkta, ki omogoča:

- da stranka v nekaj minutah:
  - opiše problem v naravnem jeziku,
  - najde preverjenega ponudnika z real‑time razpoložljivostjo,
  - vidi ceno, rezervira termin in varno plača (z escrow zaščito),
  - spremlja status naročila in komunicira s ponudnikom,
- medtem ko ponudnik:
  - prejema centralizirana povpraševanja,
  - upravlja svoj urnik,
  - prejme plačilo po potrditvi dela.

S tem **ne gradim vsega**, ampak se osredotočim na minimum funkcionalnosti,
ki mi da največ **učenja o času, zaupanju in pripravljenosti uporabnikov,
da lokalne storitve naročajo popolnoma digitalno.**
