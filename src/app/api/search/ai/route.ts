import OpenAI from "openai";
import { NextResponse } from "next/server";
import { parseAiSearchModelTextContent } from "@/lib/aiSearch";

/**
 * xAI Grok: naravni jezik → strukturiran JSON (AiSearchResult).
 * Shema in parsanje: src/lib/aiSearch.ts (parseAiSearchJsonObject, parseAiSearchModelTextContent).
 */

const XAI_BASE_URL = "https://api.x.ai/v1";
const MODEL = "grok-4-1-fast-non-reasoning";

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "XAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { description?: string; city?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const cityHint =
    typeof body.city === "string" ? body.city.trim() : undefined;

  if (!description) {
    return NextResponse.json(
      { error: "description is required" },
      { status: 400 }
    );
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: XAI_BASE_URL,
  });

  /**
   * System prompt: JSON shema, semantika polj, few-shot.
   * Ob spremembi polj posodobi tudi parseAiSearchJsonObject v aiSearch.ts.
   */
  const systemPrompt = `Si asistent za slovensko platformo DomServices (povezovanje strank z izvajalci: vodovod, elektrika, čiščenje, vrt, kleparstvo …).

NALOGA: Iz uporabnikovega stavka v slovenščini izlušči NAMEN in strukturiran JSON za iskanje.

Odgovori IZKLJUČNO z enim veljavnim JSON objektom (brez markdown, razen če uporabnik eksplicitno zahteva; idealno čisti JSON).

OBVEZNA POLJA (vedno):
- intent: "search" | "alert" | "book"
- category: "plumber" | "electrician" | "cleaner" | "gardener" | "other"
  (plumber = vodovod, kleparstvo, pušilke; electrician = elektrika; cleaner = čiščenje; gardener = vrt, košnja, trava)
- city: string ali null (eno glavno mesto, če je smiselno; če je več mest, nastavi tudi cities)
- cities: string[] (seznam mest, OR logika; če je samo eno mesto, lahko ["Velenje"] ali city + prazen cities)
- keywords: string[] (ključne besede iz poizvedbe; lahko prazno)
- maxRating: null | število 0–5 (če uporabnik želi največ toliko zvezdic / slabo ocenjene)
- minRating: null | število 0–5 (če uporabnik želi vsaj toliko zvezdic / "nad 4", "vsaj 4.5")
- verifiedOnly: true|false (samo "preverjeni ponudniki", "verified", "preverjeno")
- priceMinEur: null | število (minimalna cena €/h, npr. "vsaj 30 evrov na uro")
- priceMaxEur: null | število (maksimalna cena €/h, npr. "do 40 €/h", "pod 50 evrov")
- limit: null | število 1–100 (npr. "pokaži 5 najboljših", "top 3")
- date, timeStart, timeEnd: za intent "book" (datum YYYY-MM-DD, časi HH:mm), sicer null

PRAVILA:
- intent "alert" = obvestilo ob novem ponudniku v mestu (npr. "obvesti me ko bo vodovodar v Kopru").
- intent "book" = rezervacija termina (npr. čiščenje v petek 14.–18.).
- intent "search" = običajno iskanje (vse ostalo).
- "Vsi ponudniki" / "vsi izvajalci" / "najdi vse" / "pokaži vse" → category "other", keywords: [] (prazen array), ostale filtre (cities, verifiedOnly, minRating, maxRating, price*, limit) nastavi samo če jih uporabnik omeni.
- Lokacija: eno mesto (city + cities) ali več mest v cities (OR); če je "vsi v Velenju in Celju" → cities: ["Velenje","Celje"], category "other", keywords [].
- Če uporabnik napiše več mest ("Velenje ali Celju"), napolni cities z obema.
- Če ni omenjene cene/ocene/verifikacije, nastavi null oziroma verifiedOnly false.
- maxRating: "največ 3 zvezdice" / "slaba ocena" → maxRating 3; minRating null.
- minRating: "ocena nad 4" / "vsaj 4.5" → minRating 4 ali 4.5; maxRating null.
- Cena: "pod 40 €/h" → priceMaxEur 40; "nad 30 evrov na uro" → priceMinEur 30.
- Število zadetkov: "top 5" / "prvih 10" → limit.

Primeri (en vrstica JSON):
{"intent":"search","category":"other","city":null,"cities":[],"keywords":[],"maxRating":null,"minRating":null,"verifiedOnly":false,"priceMinEur":null,"priceMaxEur":null,"limit":null,"date":null,"timeStart":null,"timeEnd":null}
{"intent":"search","category":"other","city":null,"cities":["Velenje","Celje"],"keywords":[],"maxRating":null,"minRating":null,"verifiedOnly":false,"priceMinEur":null,"priceMaxEur":null,"limit":null,"date":null,"timeStart":null,"timeEnd":null}
{"intent":"search","category":"plumber","city":"Velenje","cities":["Velenje"],"keywords":["pušilka"],"maxRating":null,"minRating":null,"verifiedOnly":false,"priceMinEur":null,"priceMaxEur":null,"limit":null,"date":null,"timeStart":null,"timeEnd":null}
{"intent":"search","category":"plumber","city":null,"cities":["Velenje","Celje"],"keywords":["klepar"],"maxRating":null,"minRating":4,"verifiedOnly":true,"priceMinEur":null,"priceMaxEur":40,"limit":10,"date":null,"timeStart":null,"timeEnd":null}
{"intent":"alert","category":"cleaner","city":"Koper","cities":["Koper"],"keywords":["čiščenje"],"maxRating":null,"minRating":null,"verifiedOnly":false,"priceMinEur":null,"priceMaxEur":null,"limit":null,"date":null,"timeStart":null,"timeEnd":null}
{"intent":"book","category":"plumber","city":"Velenje","cities":["Velenje"],"keywords":["termin"],"maxRating":null,"minRating":null,"verifiedOnly":false,"priceMinEur":null,"priceMaxEur":null,"limit":null,"date":"2026-03-16","timeStart":"14:00","timeEnd":"18:00"}`;

  const userContent = cityHint
    ? `Opis: "${description}". Uporabnikovo mesto (hint): ${cityHint}.`
    : `Opis: "${description}".`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.1,
      max_tokens: 512,
    });

    const content =
      completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "Empty model response" },
        { status: 502 }
      );
    }

    const result = parseAiSearchModelTextContent(content);
    if (!result) {
      return NextResponse.json(
        { error: "Model did not return valid JSON", raw: content },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("xAI API error:", err);
    return NextResponse.json(
      { error: "AI search failed" },
      { status: 502 }
    );
  }
}
