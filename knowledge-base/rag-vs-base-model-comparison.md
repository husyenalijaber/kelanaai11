# RAG vs Base Model Comparison
## KelanaAI Knowledge Base Expansion — Session 9

---

## Test Questions & Answer Comparison

### Question 1: "What is the best time to visit Bali for good weather?"

**Base Model Answer:**
> "Bali is a tropical destination with a warm climate year-round, typically between 26–30°C. The dry season runs roughly from April to September, and the wet season from October to March. The best time to visit for good weather is generally considered to be between June and August."

**RAG Answer (using Indonesia Travel Guide):**
> "Based on our travel documents, Bali's dry season runs May–September, making it the peak and best season for beaches and outdoor activities. However, Ubud is pleasant year-round due to its highland climate. Avoid December–February if you want to minimize rainfall. April and October are shoulder months — fewer tourists with generally good weather. For surfing, the wet season (November–March) actually brings better waves to the west coast."

**Improvement:** RAG provides more specific monthly guidance, mentions Ubud's microclimate difference, and adds the surfing angle not in the base model response.

---

### Question 2: "How much does a trip to Japan cost per day?"

**Base Model Answer:**
> "Japan is known for being expensive. Budget travelers typically spend around $80–100 per day, while mid-range travelers spend $150–250, and luxury travelers can spend $500 or more per day."

**RAG Answer (using Japan Travel Guide):**
> "According to our knowledge base: Budget travelers in Japan can manage on $60–110/day (hostel $30–50, food $15–25, transport $10–20, activities $5–15). Standard travelers should budget $150–300/day. For transport savings, the 7-day JR Pass (~$280) pays off if taking 3+ Shinkansen rides. Convenience store meals (7-Eleven, Lawson) can keep food costs to $3–6 per meal, significantly reducing the daily budget."

**Improvement:** RAG provides a detailed breakdown by category, mentions the JR Pass strategy, and the convenience store meal tip — all specific to the uploaded documents.

---

### Question 3: "What are the cheapest ways to get around Indonesia?"

**Base Model Answer:**
> "In Indonesia, you can use local buses, shared minivans (angkot), and ojek (motorcycle taxis) to get around cheaply. Budget domestic flights on Lion Air or Citilink are affordable for inter-island travel."

**RAG Answer (using Indonesia Travel Guide + Budget Tips):**
> "Based on our travel documents: The cheapest options are Gojek and Grab ride-hailing apps (negotiated prices, usually cheaper than taxis), ojek motorcycle taxis (always agree price upfront), and Trans-Jakarta buses (flat fare ~$0.30). For inter-island travel, Lion Air and Citilink offer Jakarta–Bali flights from $30–80. In Bali, renting a scooter at $5–8/day is most flexible. Book flights 2–3 months ahead and fly midweek for 20–40% savings."

**Improvement:** RAG adds specific prices, the scooter rental tip for Bali, the Trans-Jakarta flat fare detail, and actionable booking advice.

---

### Question 4: "What documents do I need to visit Japan as an Indonesian citizen?"

**Base Model Answer:**
> "Indonesian citizens need a tourist visa to visit Japan. You should apply at the Japanese Embassy in your country with your passport, photos, and travel itinerary."

**RAG Answer (using Japan Travel Guide):**
> "According to our knowledge base: Indonesian citizens require a tourist visa for Japan. You must apply at the Japanese Embassy. Required documents include: valid passport, return ticket, proof of accommodation (hotel bookings), and bank statement showing sufficient funds. Processing typically takes 5–7 business days. Note that 68 other nationalities (USA, EU, Australia) can enter visa-free for 90 days, so check updated embassy guidelines close to your travel date."

**Improvement:** RAG provides the complete document checklist, specific processing time, and important context about which nationalities get visa-free entry.

---

### Question 5: "What is the daily food budget for backpackers in Southeast Asia?"

**Base Model Answer:**
> "Backpackers in Southeast Asia can eat well on $10–20 per day by eating at local restaurants and street food stalls."

**RAG Answer (using Budget Travel Tips):**
> "Our budget travel guide breaks it down by country: Indonesia (warung meals $1–3, nasi goreng $1–2), Thailand (Pad Thai $1–2, Som Tam $1), Vietnam (Pho $1.50–3, Banh Mi $1–2). Total daily food budget: $5–10 for shoestring backpackers. Pro tip: Japan's 7-Eleven, Lawson, and FamilyMart convenience stores offer quality ready meals for $3–6 — an excellent budget strategy even in expensive Japan. Overall, $5–15/day for food is very achievable across Southeast Asia."

**Improvement:** RAG gives country-specific prices with exact dish costs, not just a vague range. The Japan convenience store tip is specific to our documents.

---

## Summary

| Metric | Base Model | RAG with KB |
|--------|-----------|-------------|
| Specificity | Generic ranges | Exact prices and dates |
| Source | Training data (may be outdated) | Our curated documents |
| Country-specific tips | Limited | Detailed per destination |
| Practical advice | Basic | Actionable with specific strategies |
| Accuracy | Approximate | Tied to verified document content |

**Conclusion:** RAG consistently outperforms the base model by providing specific, actionable, document-grounded answers. The knowledge base documents allow KelanaAI to give travelers exact prices, dates, and strategies rather than generic guidance.
