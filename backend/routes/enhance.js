const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

router.post('/', async (req, res) => {
  const { fieldName, fieldValue } = req.body;

  if (!fieldValue || !fieldValue.trim()) {
    return res.status(400).json({ message: 'fieldValue is required' });
  }

  if (!['intro', 'whyMe'].includes(fieldName)) {
    return res.status(400).json({ message: 'Invalid field' });
  }

  const prompt = fieldName === 'intro'
    ? `You are a professional pitch writer helping Indian college students get freelance jobs from local businesses. Enhance this student introduction to make it more professional, confident and engaging. Keep it under 80 words. Return ONLY the enhanced text, nothing else. Original: ${fieldValue}`
    : `You are a professional pitch writer helping Indian college students win freelance jobs. Enhance this "Why Me" pitch to make it compelling, specific and confident for an Indian SME business owner. Keep it under 120 words. Return ONLY the enhanced text, nothing else. Original: ${fieldValue}`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const enhancedText = response.text;
    if (enhancedText) {
      return res.json({ enhancedText: enhancedText.trim() });
    }
    return res.status(500).json({ message: 'AI enhancement failed' });
  } catch (err) {
    console.error('AI error:', err.message);
    return res.status(500).json({ message: 'AI enhancement error: ' + err.message });
  }
});

module.exports = router;
