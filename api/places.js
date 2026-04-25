export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { input } = req.query;

  if (!input || input.length < 2) {
    return res.status(400).json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_KEY;

  try {
    const response = await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify({
          input: input,
          includedRegionCodes: ['us'],
        }),
      }
    );

    const data = await response.json();

    const predictions = (data.suggestions || []).map(s => ({
      description: s.placePrediction?.text?.text || '',
      place_id: s.placePrediction?.placeId || '',
    }));

    return res.status(200).json({ predictions });

  } catch (err) {
    console.error('Places API error:', err);
    return res.status(500).json({ predictions: [], error: 'Failed' });
  }
}
