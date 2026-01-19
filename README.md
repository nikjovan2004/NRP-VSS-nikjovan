# Vaja 1: Ideja IT produkta in opredelitev problema

## 1. Delovni naslov produkta

**Delovni naslov:** Izgubljeno & Najdeno Kampus  
(kratko: KampusNajde)

---

## 2. Opis problema

Na univerzitetnih kampusih v Sloveniji študenti in zaposleni pogosto izgubljajo različne predmete (ključe, študentske izkaznice, denarnice, prenosnike, knjige, oblačila), vendar ne obstaja enoten, pregleden in hiter sistem za povezovanje izgubljenih in najdenih predmetov. Informacije so razpršene med fizičnimi »lost & found« mesti (vratarnice, referati), Facebook skupinami, e‑pošto in ustnim izročilom, kar otežuje iskanje in zmanjšuje verjetnost, da se predmet dejansko vrne lastniku. [web:65][web:72]

Problem zadeva predvsem študente in osebje večjih univerz (npr. Univerza v Ljubljani z več deset tisoč študenti in zaposlenimi), kjer je promet ljudi velik, prostori so razpršeni po mestu, hkratno pa ni standardiziranega digitalnega sistema za upravljanje z izgubljenimi/najdenimi predmeti. [web:93][web:96]

Problem je pomemben, ker izguba predmetov povzroča:
- finančno škodo (ponovne izdaje kartic, ključev, dokumentov, naprav),
- časovno izgubo (iskanje po različnih kanalih, obiski več lokacij),
- stres in občutek nesigurnosti (zlasti pri dokumentih, ključih in elektronskih napravah).

---

## 3. Ciljni uporabnik

Tipičen uporabnik je študent ali član osebja na slovenski univerzi (npr. UL, UM, UP), ki se vsakodnevno giblje med predavalnicami, knjižnicami, menzami, študentskimi domovi in javnim prevozom.

Deluje v okolju:
- z veliko premikanja med različnimi lokacijami (razpršene fakultete po mestu),
- z visoko uporabo osebne opreme (prenosniki, telefoni, kartice, ključi),
- kjer komunikacija poteka prek različnih kanalov (Facebook skupine, e‑pošta, ustno, fizični pulti).

V praksi se sooča z naslednjimi težavami:
- ko nekaj izgubi, ne ve, kje naj začne iskati (Facebook, vratar, referat, policija, spletne strani),
- nima enega centralnega mesta, kjer bi lahko hitro preveril, ali je bil njegov predmet najden,
- tudi ko najde predmet, nima enostavnega načina, da bi ga povezal s pravo osebo, razen da objavi sliko v neki skupini in upa na odziv.

---

## 4. Predlagana rešitev (osnovna ideja)

Predlagana rešitev je spletna aplikacija **Izgubljeno & Najdeno Kampus**, ki deluje kot centraliziran, kampusu prilagojen sistem za prijavo izgubljenih in objavo najdenih predmetov.

Osnovne funkcionalnosti:
- uporabnik lahko prijavi izgubljen predmet (opis, kategorija, lokacija, čas, opcijsko slika),
- uporabnik lahko objavi najden predmet (slika, opis, kategorija, lokacija, čas),
- sistem omogoča brskanje in filtriranje po kategoriji, lokaciji in datumu,
- vgrajen je pametni sistem ujemanja, ki predlaga možna ujemanja med izgubljenimi in najdenimi predmeti na podlagi časa, lokacije, kategorije in opisa,
- uporabnika obvesti, ko se pojavi visoko verjetno ujemanje.

Dodatna praktična funkcionalnost:
- na oglasnih tablah, v knjižnicah, menzah in študentskih domovih so nameščene **QR kode**, ki jih uporabniki skenirajo s telefonom in so preusmerjeni neposredno na stran za prijavo izgubljenega ali najdenega predmeta za to lokacijo (npr. “najdeno v FRI menzi”). To poenostavi in pohitri vnos ter spodbuja ljudi, da najdene predmete dejansko prijavijo.

Rešitev je boljša od obstoječih alternativ, ker:
- je **specializirana za univerzitetni kampus** (lokacije, stavbe, tipične kategorije predmetov),
- z uporabo **pametnega ujemanja** aktivno pomaga najti pare izgubljeno–najdeno, namesto da bi bil uporabnik prepuščen ročnemu iskanju,
- združi funkcionalnost, ki je trenutno razpršena med več kanalov (Facebook, fizični pulti, e‑pošta), v en sam pregleden sistem,
- z uporabo **QR kod** poveže fizične lokacije na kampusu z digitalno aplikacijo in zniža “frikcijo” pri prijavi najdenih predmetov.

---

## 5. Primer uporabe (kratek scenarij)

Ana, študentka 2. letnika na Univerzi v Ljubljani, po predavanju na Fakulteti za računalništvo in informatiko ugotovi, da je izgubila šop ključev (ključi od stanovanja in študentskega doma). Ne ve, ali jih je pozabila v predavalnici, računalniški učilnici ali v menzi.

Namesto, da bi pisala v več Facebook skupin, klicala referat in hodila od vratarnice do vratarnice, odpre spletno aplikacijo **Izgubljeno & Najdeno Kampus**, se prijavi in vnese prijavo izgubljenega predmeta: “šop srebrnih ključev, modri obesek, izgubljeno danes med 10:00 in 12:00, FRI / menza”.

Eden izmed študentov je istega dne v menzi našel šop ključev z modrim obeskom. Ko odhaja iz menze, na oglasni tabli opazi QR kodo “Izgubljeno & Najdeno – FRI menza”, jo skenira s telefonom, kar ga odpelje neposredno na obrazec za prijavo najdenega predmeta za to lokacijo. Doda sliko, izbere kategorijo “ključi” in odda.

Sistem na podlagi časovne in prostorske bližine ter opisa sam izračuna visoko verjetnost ujemanja in Ani pošlje obvestilo, da obstaja 90 % ujemanje z najdenim predmetom. Ana v aplikaciji odpre predlagano ujemanje, skozi vgrajeno sporočanje stopi v stik s študentom, ki je ključe našel, in se dogovorita za prevzem še isti dan.

---

## 6. Trg (konkurenca in alternative)

- **Splošne platforme izgubljeno–najdeno**  
  Obstaja spletna stran izgubljeno-najdeno.si, ki omogoča prijavo izgubljenih in najdenih predmetov ter iskanje po lokaciji, datumu in kategoriji, vendar ni vezana na posamezen kampus ali šolo, temveč deluje na ravni celotne države. [web:65]  
- **Policijski register najdenih predmetov**  
  Policija vodi javno dostopen seznam najdenih predmetov, ki jih najditelji oddajo policiji; ti se hranijo določeno obdobje, uporabnik pa mora ročno iskati po seznamu ali kontaktirati policijo. Sistem ni prilagojen študentom ali kampusom in je bolj formalen ter počasen. [web:72]  
- **Ad‑hoc kanali na kampusih**  
  Večina slovenskih fakultet in šol uporablja kombinacijo fizičnih “lost & found” mest (vratarnica, referat) ter Facebook skupin ali e‑pošte. Informacije so razpršene in ne omogočajo pametnega ujemanja niti centralnega pregleda.

Glede na obstoječe stanje na slovenskem trgu:
- **ni specializirane kampus rešitve** za slovenske univerze in šole,
- obstoječe slovenske rešitve so **splošne** (niso vezane na kampus, nimajo modela stavb, nadstropij, fakultet),
- globalne kampus platforme so namenjene tujim univerzam in niso integrirane v slovenski prostor.

Predlagana rešitev **Izgubljeno & Najdeno Kampus** se pozicionira kot:
- lokalno prilagojena kampus aplikacija (slovenski jezik, slovenske univerze, tipične lokacije),
- z **pametnim ujemanjem po času, lokaciji in opisu** ter QR kodami na fizičnih lokacijah,
- potencialna osnova za širitev na več kampusov v Sloveniji, kjer trenutno ni podobne namenske rešitve.

---
