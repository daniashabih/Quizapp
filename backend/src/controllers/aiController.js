const OpenAI = require('openai');
const Question = require('../models/questionModel');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateQuestions = async (req, res) => {
    console.log('--- AI Generation Request Received ---');
    console.log('Body:', req.body);

    try {
        const { topic, difficulty, count = 5 } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            console.error('Missing OpenAI API Key');
            return res.status(500).json({ message: 'OpenAI API Key not configured' });
        }

        const prompt = `
            Create ${count} multiple-choice quiz questions about ${topic} for a ${difficulty} level developer.
            Return ONLY a valid JSON array of objects with this structure:
            [
                {
                    "category": "${topic}",
                    "question_text": "Question here?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "Option A",
                    "difficulty": "${difficulty}"
                }
            ]
            Do not include any markdown formatting like \`\`\`json. Just the raw JSON array.
        `;

        console.log('Sending request to OpenAI...');
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        console.log('OpenAI Response received');
        const content = completion.choices[0].message.content.trim();
        console.log('Raw Content:', content);

        // Clean up markdown if present (sometimes GPT adds it anyway)
        const jsonStr = content.replace(/^```json/, '').replace(/```$/, '').trim();

        let questions;
        try {
            questions = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('String attempting to parse:', jsonStr);
            throw new Error('Failed to parse AI response. Try again.');
        }

        console.log(`Parsed ${questions.length} questions. Saving to DB...`);

        // Save to database
        const savedIds = [];
        for (const q of questions) {
            // Ensure difficulty is set if AI missed it
            if (!q.difficulty) q.difficulty = difficulty;

            const id = await Question.create(q);
            savedIds.push(id);
        }

        console.log('All questions saved successfully.');
        res.json({ message: `Successfully generated ${savedIds.length} questions`, count: savedIds.length });

    } catch (error) {
        console.error('AI Generation Error:', error);

        let errorMessage = 'Failed to generate questions. Check API Key or try again.';

        if (error.response) {
            // OpenAI API error
            errorMessage = `OpenAI API Error: ${error.response.data.error.message}`;
            console.error('OpenAI Error details:', error.response.data);
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(500).json({ message: errorMessage });
    }
};

module.exports = { generateQuestions };
