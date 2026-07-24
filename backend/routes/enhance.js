const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

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
    const client = new Anthropic();
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const enhancedText = message.content[0]?.text;
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
