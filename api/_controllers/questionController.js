const Question = require('../models/questionModel');

const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

const createQuestion = async (req, res) => {
    try {
        const { category, question_text, options, correct_answer, difficulty } = req.body;

        // Basic validation
        if (!category || !question_text || !options || !correct_answer) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const id = await Question.create({ category, question_text, options, correct_answer, difficulty });
        res.status(201).json({ message: 'Question created', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const importQuestions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileExt = req.file.originalname.split('.').pop().toLowerCase();
        let questions = [];

        if (fileExt === 'csv') {
            const results = [];
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => resolve(results))
                    .on('error', (err) => reject(err));
            });
            questions = results;
        } else if (fileExt === 'xlsx' || fileExt === 'xls') {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            questions = xlsx.utils.sheet_to_json(worksheet);
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: 'Unsupported file format' });
        }

        // Process questions
        const results = { success: 0, failed: 0, errors: [] };
        
        for (const q of questions) {
            try {
                // Map fields (handle variations in column names)
                const category = q.category || q.Category;
                const question_text = q.question || q.question_text || q.Question;
                const correct_answer = q.correct_answer || q.CorrectAnswer || q.Answer;
                const difficulty = q.difficulty || q.Difficulty || 'beginner';
                
                // Collect options
                const options = [
                    q.option1 || q.Option1,
                    q.option2 || q.Option2,
                    q.option3 || q.Option3,
                    q.option4 || q.Option4
                ].filter(opt => opt !== undefined && opt !== null && opt !== '');

                if (category && question_text && options.length >= 2 && correct_answer) {
                    await Question.create({ 
                        category, 
                        question_text, 
                        options, 
                        correct_answer, 
                        difficulty 
                    });
                    results.success++;
                } else {
                    results.failed++;
                    results.errors.push(`Missing required fields in row: ${JSON.stringify(q)}`);
                }
            } catch (err) {
                results.failed++;
                results.errors.push(`Error in row: ${err.message}`);
            }
        }

        // Delete temp file
        fs.unlinkSync(filePath);

        res.json({
            message: `Import completed. Success: ${results.success}, Failed: ${results.failed}`,
            details: results.errors
        });
    } catch (error) {
        console.error('Import error:', error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Failed to import questions' });
    }
};

const getQuestions = async (req, res) => {
    try {
        const category = req.query.category?.trim();
        const difficulty = req.query.difficulty?.trim();

        const questions = await Question.getFiltered({ category, difficulty });
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await Question.delete(id);
        res.json({ message: 'Question deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        // Basic validation could go here similar to create
        await Question.update(id, req.body);
        res.json({ message: 'Question updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const checkNewQuestions = async (req, res) => {
    try {
        const count = await Question.getRecentCount(3); // Check last 3 days
        res.json({ hasNew: count > 0, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const exportQuestions = async (req, res) => {
    try {
        const { format } = req.query; // 'csv' or 'xlsx'
        console.log(`📤 Exporting questions in ${format} format...`);
        const questions = await Question.getAll();

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions to export' });
        }

        // Prepare data for export
        const data = questions.map(q => {
            let options = q.options;
            if (typeof options === 'string') {
                try { options = JSON.parse(options); } catch { options = []; }
            }
            return {
                Category: q.category,
                Question: q.question_text,
                Option1: options[0] || '',
                Option2: options[1] || '',
                Option3: options[2] || '',
                Option4: options[3] || '',
                CorrectAnswer: q.correct_answer,
                Difficulty: q.difficulty || 'beginner'
            };
        });

        if (format === 'csv') {
            const headers = Object.keys(data[0]);
            const csvRows = [
                headers.join(','),
                ...data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=questions_export.csv');
            return res.send(csvRows);
        } else {
            // Default to XLSX
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Questions");
            
            const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=questions_export.xlsx');
            return res.send(buffer);
        }
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Failed to export questions' });
    }
};

module.exports = { createQuestion, importQuestions, exportQuestions, getQuestions, deleteQuestion, updateQuestion, checkNewQuestions };
