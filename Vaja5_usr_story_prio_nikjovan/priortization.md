# Prioritizacija – DomServices (Vaja 5)

## Izbrana metoda

Za prioritizacijo user stories sem izbral metodo **MoSCoW (Must, Should, Could, Won’t for now)**.

Metoda je primerna za projekt **DomServices**, ker:

- moram jasno ločiti funkcionalnosti, ki so nujne za prvi **MVP**
  (iskanje storitev, rezervacija, plačilo, osnovna podpora ponudnikom),
- je enostavna za razumevanje in komunikacijo na študijskem projektu,
- mi omogoča, da 20+ user stories razdelim v štiri jasne skupine
  in tako pokažem razvojni fokus prve verzije aplikacije.

## Razvrstitev po MoSCoW

### Must have (M) – brez tega MVP nima smisla

- Hitro opisovanje problema  
- Prikaz samo preverjenih ponudnikov  
- Razpoložljivost v realnem času  
- Transparentna cena vnaprej  
- Pregled ocen in mnenj drugih uporabnikov  
- Varno plačilo s kartico  
- Escrow – denar zadržan do potrditve  
- Obvestila o statusu naročila  
- Vgrajen chat s ponudnikom  
- Centralizirani leadi za ponudnika  
- Upravljanje urnika ponudnika  

Te funkcionalnosti omogočajo osnovni “end‑to‑end” flow:
uporabnik opiše problem, najde zaupanja vrednega ponudnika,
vidi razpoložljivost, rezervira termin, varno plača,
denar je zadržan do potrditve, komunikacija poteka preko chata,
ponudnik pa ima osnovno podporo za prejem leadov in upravljanje urnika.

### Should have (S) – zelo pomembno, a lahko počaka za drugi sprint

- Ponovno naročanje istega ponudnika  
- Samodejna nakazila po potrditvi dela  
- Ogled podrobnosti naročila pred sprejemom  
- Pregled prihodkov in statistike  
- Instantna obvestila za nove jobe  

Te funkcionalnosti bistveno izboljšajo izkušnjo kupca in ponudnika
(repeat business, manj ročnega dela za plačila, boljša preglednost),
vendar osnovni koncept platforme deluje tudi brez njih.

### Could have (C) – nice‑to‑have, za kasnejše release‑e

- Pridobivanje novih strank brez marketinga  
- Upravljanje več nepremičnin  
- Shranjeni naslovi za hitrejše naročanje  

Gre za funkcionalnosti, ki ciljajo na specifične segmente
(npr. upravitelji nepremičnin) ali dodatno udobje za uporabnike
(shranjeni naslovi), zato so primerne za kasnejše faze razvoja.

### Won’t have for now (W) – izven prve verzije

- Garancija kakovosti  

Garancija kakovosti bi povečala zaupanje v platformo, vendar zahteva
dodatne pravne in operativne procese (pravila reklamacij, reševanje sporov).
Zato sem jo označil kot **Won’t have for first release** – konceptualno
ostane v backlogu, v MVP pa ne bo implementirana.

---

## Povzetek

Z metodo **MoSCoW** sem 20 user stories razdelil v štiri skupine.
To jasno pokaže:

- katere funkcionalnosti so potrebne, da DomServices sploh deluje
  kot uporaben marketplace,
- katere funkcionalnosti bomo verjetno dodali takoj po MVP,
- katere funkcionalnosti so strateške za kasnejšo rast platforme.
