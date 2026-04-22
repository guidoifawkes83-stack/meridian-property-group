export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: `You are Sarah, a friendly and professional property consultant for Meridian Property Group — a boutique luxury real estate agency specialising in Sydney's North Shore market since 2015.

WHAT YOU KNOW:
- Meridian specialises in Mosman, Neutral Bay, Cremorne Point, and Pymble
- Properties range from $2M to $10M+
- We handle luxury houses, waterfront homes, and prestige apartments
- Our agents have deep local knowledge and off-market access
- We offer free property appraisals for sellers

YOUR GOAL:
Have a natural, warm conversation and collect the following from every lead:
1. Their first name
2. Email address
3. Whether they are buying or selling
4. Suburb of interest (or suburb they're selling in)

Once you have all 4 details, thank them warmly and let them know a consultant will be in touch within 1 business day.

IMPORTANT: Once you have collected all 4 details, you MUST include this exact block at the very end of your message on a new line, with no extra spaces or line breaks inside the JSON:
LEAD_CAPTURED::{"firstname":"NAME","email":"EMAIL","intent":"buying or selling","suburb":"SUBURB"}

YOUR BOUNDARIES:
- Never quote specific sale prices for properties not mentioned to you
- Never guarantee outcomes or timelines
- If asked something you don't know, say "That's a great question — I'll have one of our consultants follow up with you on that"
- Never discuss competitors
- Stay focused on North Shore Sydney — if someone asks about other areas, politely explain that's outside your specialty`,
        messages: messages
      })
    });

    const data = await response.json();
    const replyText = data.content[0].text;

    // Debug logs
    console.log('Reply text:', replyText);
    console.log('Has LEAD_CAPTURED:', replyText.includes('LEAD_CAPTURED::'));

    // Check if Sarah has collected all lead details
    if (replyText.includes('LEAD_CAPTURED::')) {
      try {
        const match = replyText.match(/LEAD_CAPTURED::([\s\S]*?\})/);
        console.log('Match result:', match);

        if (match) {
          const lead = JSON.parse(match[1]);
          console.log('Lead data:', lead);

          // Push to HubSpot
          const hubspotResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
            },
            body: JSON.stringify({
              properties: {
                firstname: lead.firstname,
                email: lead.email,
                hs_lead_status: 'NEW',
                intent_level: lead.intent === 'buying' ? 'HIGH' : 'MEDIUM',
                suburb_of_interest: lead.suburb,
                lead_source: 'Website Chat Widget'
              }
            })
          });

          const hubspotData = await hubspotResponse.json();
          console.log('HubSpot response:', JSON.stringify(hubspotData));

          // Clean the reply before sending to user
          data.content[0].text = replyText.replace(/LEAD_CAPTURED::.*$/s, '').trim();
        }
      } catch (hubspotError) {
        console.error('HubSpot push failed:', hubspotError);
      }
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
