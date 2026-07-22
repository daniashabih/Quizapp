import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Plus, Trash2, Save, X, Edit2, Users, Terminal,
    ShieldCheck, Search, BookOpen, FolderOpen, Upload, Download, FileText, Layers,
    ChevronDown, Sparkles, Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('questions');
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [category, setCategory] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [difficulty, setDifficulty] = useState('beginner');

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/'); return; }
        fetchData();
        if (activeTab === 'users') fetchUsers();
    }, [user, navigate, activeTab]);

    const fetchData = async () => {
        try {
            const [qRes, cRes] = await Promise.all([axios.get('/questions'), axios.get('/categories')]);
            setQuestions(qRes.data);
            setCategories(cRes.data);
            if (!category && cRes.data.length > 0) setCategory(cRes.data[0].name);
        } catch { /* silent */ }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/auth/users');
            setAllUsers(res.data);
        } catch { /* silent */ }
    };

    const openQuestionModal = (question = null) => {
        if (question) {
            setEditingQuestionId(question.id);
            setCategory(question.category);
            setQuestionText(question.question_text);
            let parsedOptions = question.options;
            if (typeof parsedOptions === 'string') {
                try { parsedOptions = JSON.parse(parsedOptions); } catch { parsedOptions = ['', '', '', '']; }
            }
            setOptions(parsedOptions);
            setCorrectAnswer(question.correct_answer);
            setDifficulty(question.difficulty || 'beginner');
        } else {
            setEditingQuestionId(null);
            setQuestionText('');
            setOptions(['', '', '', '']);
            setCorrectAnswer('');
            setDifficulty('beginner');
            if (categories.length > 0) setCategory(categories[0].name);
        }
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { category, question_text: questionText, options, correct_answer: correctAnswer, difficulty };
            if (editingQuestionId) {
                await axios.put(`/questions/${editingQuestionId}`, payload);
                toast.success("Question updated.");
            } else {
                await axios.post('/questions', payload);
                toast.success("Question added.");
            }
            setIsFormOpen(false);
            fetchData();
        } catch { toast.error("Failed to save question."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this question permanently?")) return;
        try {
            await axios.delete(`/questions/${id}`);
            toast.success("Question deleted.");
            fetchData();
        } catch { toast.error("Failed to delete."); }
    };

    const handleAddOrUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            if (editingCategoryId) {
                await axios.put(`/categories/${editingCategoryId}`, { name: newCategory });
                toast.success("Category updated.");
            } else {
                await axios.post('/categories', { name: newCategory });
                toast.success("Category created.");
            }
            setNewCategory('');
            setEditingCategoryId(null);
            fetchData();
        } catch { toast.error("Failed to save category."); }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await axios.delete(`/categories/${id}`);
            toast.success("Category deleted.");
            fetchData();
        } catch { toast.error("Failed to delete."); }
    };

    const handleImportQuestions = async (e) => {
        e.preventDefault();
        if (!importFile) return toast.error("Please select a file.");
        const formData = new FormData();
        formData.append('file', importFile);
        setIsImporting(true);
        try {
            const res = await axios.post('/questions/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(res.data.message);
            setIsImportModalOpen(false);
            setImportFile(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Import failed.");
        } finally {
            setIsImporting(false);
        }
    };

    const downloadTemplate = () => {
        const headers = ['category', 'question', 'option1', 'option2', 'option3', 'option4', 'correct_answer', 'difficulty'];
        const sampleRows = [
            ['JavaScript', 'What is the type of NaN?', 'number', 'string', 'undefined', 'object', 'number', 'beginner'],
            ['Python', 'Which keyword is used to define a function?', 'func', 'define', 'def', 'function', 'def', 'beginner']
        ];
        const csvContent = [
            headers.join(','),
            ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'questions_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportQuestions = async (format) => {
        try {
            const response = await axios.get(`/questions/export?format=${format}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `questions_export.${format}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Questions exported as ${format.toUpperCase()}`);
        } catch { toast.error("Export failed."); }
    };

    const filteredQuestions = questions.filter(q =>
        q.question_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const difficultyBadge = (d) => {
        const map = {
            expert: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
            intermediate: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
            beginner: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
        };
        return map[d] || map.beginner;
    };

    const stats = [
        { label: 'Total Questions', value: questions.length, icon: BookOpen, gradient: 'from-indigo-500 to-cyan-500' },
        { label: 'Categories', value: categories.length, icon: FolderOpen, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Registered Users', value: allUsers.length || '—', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <div className="animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <div className="badge-error mb-3">
                        <ShieldCheck size={12} />
                        Admin Access
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--foreground)]">
                        System <span className="text-gradient">Control Center</span>
                    </h1>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">Manage questions, categories, and users.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)} className="btn-secondary text-sm">
                            <Download size={14} /> Export <ChevronDown size={12} />
                        </button>
                        {isExportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 glass rounded-2xl shadow-xl z-50 overflow-hidden border border-[var(--card-border)] animate-scale-in">
                                <button onClick={() => { handleExportQuestions('csv'); setIsExportDropdownOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-all flex items-center gap-2">
                                    <FileText size={14} /> Export as CSV
                                </button>
                                <button onClick={() => { handleExportQuestions('xlsx'); setIsExportDropdownOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-all flex items-center gap-2 border-t border-[var(--card-border)]">
                                    <Layers size={14} /> Export as XLSX
                                </button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsImportModalOpen(true)} className="btn-secondary text-sm">
                        <Upload size={14} /> Import
                    </button>
                    <button onClick={() => setIsCategoryModalOpen(true)} className="btn-secondary text-sm">
                        <FolderOpen size={14} /> Categories
                    </button>
                    <button onClick={() => openQuestionModal(null)} className="btn-primary text-sm">
                        <Plus size={14} /> New Question
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, gradient }) => (
                    <div key={label} className="card p-5 rounded-2xl flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                            <Icon size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xl font-display font-bold text-[var(--foreground)]">{value}</p>
                            <p className="text-[10px] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm mb-5">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions or categories…" className="input-field pl-10 text-sm py-3" />
            </div>

            {/* Table */}
            <div className="card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[var(--card-border)] bg-[var(--muted-bg)]/50">
                                {['Category', 'Difficulty', 'Question', 'Correct Answer', ''].map(h => (
                                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--card-border)]">
                            {filteredQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-sm text-[var(--foreground-muted)]">
                                        No questions found. <button onClick={() => openQuestionModal(null)} className="text-indigo-500 font-semibold hover:text-indigo-400">Add one</button>
                                    </td>
                                </tr>
                            ) : filteredQuestions.map((q) => (
                                <tr key={q.id} className="hover:bg-[var(--muted-bg)] transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="badge-indigo text-[10px]">{q.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge border text-[10px] ${difficultyBadge(q.difficulty)}`}>
                                            {q.difficulty || 'beginner'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm text-[var(--foreground)] truncate font-medium">{q.question_text}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="px-2.5 py-1 rounded-lg bg-[var(--muted-bg)] text-[var(--foreground)] font-bold text-xs font-mono border border-[var(--card-border)]">
                                            {q.correct_answer}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openQuestionModal(q)}
                                                className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-indigo-500 hover:bg-[var(--muted-bg)] transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(q.id)}
                                                className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Question Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="card rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)] shrink-0">
                            <h2 className="text-lg font-display font-bold text-[var(--foreground)]">
                                {editingQuestionId ? 'Edit Question' : 'New Question'}
                            </h2>
                            <button onClick={() => setIsFormOpen(false)}
                                className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="input-label">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="input-label">Difficulty</label>
                                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input-field">
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="input-label">Question</label>
                                <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                                    className="input-field min-h-[80px] resize-none" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map(idx => (
                                    <div key={idx} className="space-y-1.5">
                                        <label className="input-label">Option {String.fromCharCode(65 + idx)}</label>
                                        <input type="text" value={options[idx]}
                                            onChange={(e) => {
                                                const newOpts = [...options];
                                                newOpts[idx] = e.target.value;
                                                setOptions(newOpts);
                                            }}
                                            className="input-field" required />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="input-label">Correct Answer</label>
                                <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="input-field" required>
                                    <option value="">Select correct answer</option>
                                    {options.filter(o => o.trim()).map((opt, idx) => (
                                        <option key={idx} value={opt}>{String.fromCharCode(65 + idx)}. {opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary text-sm px-5">Cancel</button>
                                <button type="submit" className="btn-primary text-sm px-5">
                                    <Save size={15} /> {editingQuestionId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="card rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                            <h2 className="text-lg font-display font-bold text-[var(--foreground)]">Manage Categories</h2>
                            <button onClick={() => setIsCategoryModalOpen(false)}
                                className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <form onSubmit={handleAddOrUpdateCategory} className="flex gap-3">
                                <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Category name (e.g. Python)" className="input-field flex-1" required />
                                <button type="submit" className="btn-primary shrink-0 text-sm px-5">
                                    {editingCategoryId ? <><Save size={15} /> Update</> : <><Plus size={15} /> Add</>}
                                </button>
                            </form>

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {categories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3.5 card rounded-xl hover:bg-[var(--muted-bg)] transition-colors">
                                        <span className="text-sm font-semibold text-[var(--foreground)]">{cat.name}</span>
                                        <div className="flex gap-1.5">
                                            <button onClick={() => { setEditingCategoryId(cat.id); setNewCategory(cat.name); }}
                                                className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-indigo-500 hover:bg-[var(--muted-bg)] transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteCategory(cat.id)}
                                                className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-center text-sm text-[var(--foreground-muted)] py-8">No categories yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="card rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                            <h2 className="text-lg font-display font-bold text-[var(--foreground)]">Import Questions</h2>
                            <button onClick={() => { setIsImportModalOpen(false); setImportFile(null); }}
                                className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleImportQuestions} className="p-6 space-y-5">
                            <div className="p-4 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
                                <p className="text-sm text-[var(--foreground-muted)] mb-4">
                                    Upload a CSV or XLSX file. Download our template to see the required format.
                                </p>
                                <button type="button" onClick={downloadTemplate}
                                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1">
                                    <Download size={12} /> Download Template
                                </button>
                            </div>
                            <input type="file" accept=".csv,.xlsx,.xls"
                                onChange={(e) => setImportFile(e.target.files[0])}
                                className="input-field file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-500/10 file:text-indigo-600 dark:file:text-indigo-400" />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => { setIsImportModalOpen(false); setImportFile(null); }}
                                    className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
                                <button type="submit" disabled={isImporting || !importFile}
                                    className="btn-primary flex-1 justify-center text-sm">
                                    {isImporting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload size={15} />}
                                    Import
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
