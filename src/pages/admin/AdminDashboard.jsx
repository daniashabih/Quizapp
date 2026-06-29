import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Plus, Trash2, Save, X, Edit2, Users, Terminal,
    ShieldCheck, Search, BookOpen, FolderOpen, ArrowRight, Upload, Download, FileText, Layers
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
                toast.success("Question updated successfully.");
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
            setNewCategory(''); setEditingCategoryId(null);
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
        console.log(`Starting export for format: ${format}...`);
        try {
            const response = await axios.get(`/questions/export?format=${format}`, {
                responseType: 'blob'
            });
            console.log('Export response received successfully');
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `questions_export.${format}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Questions exported as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error("Export failed.");
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.question_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const difficultyBadge = (d) => {
        const map = {
            expert: 'bg-sky-500/15 text-sky-700 border-sky-500/25',
            intermediate: 'bg-blue-500/15 text-blue-700 border-blue-500/25',
            beginner: 'bg-slate-500/15 text-slate-700 border-slate-500/25',
        };
        return map[d] || map.beginner;
    };

    const stats = [
        { label: 'Total Questions', value: questions.length, icon: BookOpen, color: 'text-blue-600' },
        { label: 'Categories', value: categories.length, icon: FolderOpen, color: 'text-sky-600' },
        { label: 'Registered Users', value: allUsers.length || '—', icon: Users, color: 'text-slate-600' },
    ];

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <div className="badge bg-red-500/10 border border-red-500/20 text-red-400 mb-3">
                        <ShieldCheck size={12} />
                        Admin Access
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[var(--foreground)]">
                        System <span className="text-gradient">Control Center</span>
                    </h1>
                    <p className="text-[var(--muted)] text-sm mt-1">Manage assessment content and candidate profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                            className="btn-secondary text-sm"
                        >
                            <Download size={15} /> Export
                        </button>
                        {isExportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 glass rounded-xl shadow-xl z-50 overflow-hidden border border-[var(--card-border)] animate-fade-in">
                                <button
                                    onClick={() => { handleExportQuestions('csv'); setIsExportDropdownOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-blue-600/10 hover:text-blue-400 transition-all flex items-center gap-2"
                                >
                                    <FileText size={14} /> Export as CSV
                                </button>
                                <button
                                    onClick={() => { handleExportQuestions('xlsx'); setIsExportDropdownOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-blue-600/10 hover:text-blue-400 transition-all flex items-center gap-2 border-t border-[var(--card-border)]"
                                >
                                    <Layers size={14} /> Export as XLSX
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="btn-secondary text-sm"
                    >
                        <Upload size={15} /> Import
                    </button>
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="btn-secondary text-sm"
                    >
                        <FolderOpen size={15} /> Categories
                    </button>
                    <button
                        onClick={() => openQuestionModal(null)}
                        className="btn-primary text-sm"
                    >
                        <Plus size={15} /> New Question
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="card p-5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-[var(--muted-bg)] flex items-center justify-center ${color}`}>
                            <Icon size={18} />
                        </div>
                        <div>
                            <p className="text-xl font-display font-bold text-[var(--foreground)]">{value}</p>
                            <p className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl w-fit">
                {[
                    { id: 'questions', icon: Terminal, label: 'Questions' },
                    { id: 'users', icon: Users, label: 'Users' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-blue-600/10 text-blue-400 shadow-sm border border-blue-500/20'
                            : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                            }`}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search (questions only) */}
            {activeTab === 'questions' && (
                <div className="mb-5">
                    <div className="relative max-w-sm">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions or categories…"
                            className="input-field !pl-10 text-sm"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {activeTab === 'questions' ? (
                            <>
                                <thead>
                                    <tr className="border-b border-[var(--card-border)] bg-[var(--muted-bg)]/30">
                                        {['Category', 'Difficulty', 'Question', 'Answer', ''].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--card-border)]">
                                    {filteredQuestions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center text-[var(--muted)] text-sm">
                                                No questions found. <button onClick={() => openQuestionModal(null)} className="text-blue-600 hover:text-blue-500 font-semibold ml-1">Add one</button>
                                            </td>
                                        </tr>
                                    ) : filteredQuestions.map((q) => (
                                        <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="badge bg-blue-500/10 border border-blue-500/20 text-blue-700 text-[10px]">
                                                    {q.category}
                                                </span>
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
                                                <code className="px-2 py-1 rounded-lg bg-[var(--muted-bg)] text-slate-700 font-bold text-xs font-mono border border-[var(--card-border)]">
                                                    {q.correct_answer}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openQuestionModal(q)}
                                                        className="p-1.5 text-slate-600 hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] rounded-lg transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(q.id)}
                                                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        ) : (
                            <>
                                <thead>
                                    <tr className="border-b border-[var(--card-border)] bg-[var(--muted-bg)]/30">
                                        {['User', 'Email', 'Role', 'Joined'].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--card-border)]">
                                    {allUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center text-slate-500 text-sm">No users found.</td>
                                        </tr>
                                    ) : allUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-[var(--muted-bg)] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 font-bold text-sm">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-semibold text-[var(--foreground)]">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--muted)] font-mono">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`badge border text-[10px] ${u.role === 'admin'
                                                    ? 'bg-sky-500/10 text-sky-700 border-sky-500/20'
                                                    : 'bg-slate-50 text-slate-600 border-[var(--card-border)]'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--muted)]">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}
                    </table>
                </div>
            </div>

            {/* ─── Category Modal ─── */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
                    <div className="glass rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                            <h2 className="text-xl font-display font-bold text-[var(--foreground)]">Manage Categories</h2>
                            <button onClick={() => setIsCategoryModalOpen(false)}
                                className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] rounded-lg transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <form onSubmit={handleAddOrUpdateCategory} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Category name (e.g. Python)"
                                    className="input-field flex-1"
                                    required
                                />
                                <button type="submit" className="btn-primary shrink-0">
                                    {editingCategoryId ? <Save size={16} /> : <Plus size={16} />}
                                    {editingCategoryId ? 'Update' : 'Add'}
                                </button>
                            </form>

                            <div className="space-y-2 max-h-60 overflow-y-auto pr-3">
                                {categories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3.5 card hover:bg-[var(--muted-bg)] transition-colors">
                                        <span className="text-sm font-semibold text-[var(--foreground)]">{cat.name}</span>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => { setEditingCategoryId(cat.id); setNewCategory(cat.name); }}
                                                className="p-1.5 text-slate-700 hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] rounded-lg transition-all"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(cat.id)}
                                                className="p-1.5 text-slate-700 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-center text-slate-600 text-sm py-8">No categories yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Question Form Modal ─── */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
                    <div className="glass rounded-2xl w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)] shrink-0">
                            <h2 className="text-xl font-display font-bold text-[var(--foreground)]">
                                {editingQuestionId ? 'Edit Question' : 'New Question'}
                            </h2>
                            <button onClick={() => setIsFormOpen(false)}
                                className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] rounded-lg transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                            {/* Category + Difficulty */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="input-field"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="beginner">Beginner — Foundational</option>
                                        <option value="intermediate">Intermediate — Professional</option>
                                        <option value="expert">Expert — Maestro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Question</label>
                                <textarea
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    rows={3}
                                    required
                                    className="input-field resize-none"
                                    placeholder="Enter the question or code snippet…"
                                />
                            </div>

                            {/* Options */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Answer Options</label>
                                <p className="text-[10px] text-[var(--muted)]">Select the radio button to mark the correct answer.</p>
                                {options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-[var(--muted-bg)] border border-[var(--card-border)] flex items-center justify-center text-[10px] font-bold text-[var(--muted)] shrink-0">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => {
                                                const n = [...options]; n[i] = e.target.value;
                                                setOptions(n);
                                            }}
                                            className="input-field flex-1 py-2.5 text-sm"
                                            placeholder={`Option ${i + 1}`}
                                        />
                                        <input
                                            type="radio"
                                            name="correct"
                                            checked={correctAnswer === opt && opt !== ''}
                                            onChange={() => setCorrectAnswer(opt)}
                                            className="w-4 h-4 accent-blue-500 shrink-0"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)] -mx-6 px-6 mt-6">
                                <p className="text-[10px] text-[var(--muted)]">* Select a radio to mark the correct answer</p>
                                <button type="submit" className="btn-primary text-sm">
                                    <Save size={15} />
                                    {editingQuestionId ? 'Update Question' : 'Save Question'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ─── Import Modal ─── */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
                    <div className="glass rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                            <h2 className="text-xl font-display font-bold text-[var(--foreground)]">Import Questions</h2>
                            <button onClick={() => setIsImportModalOpen(false)}
                                className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] rounded-lg transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                                    <FileText size={14} /> File Requirements
                                </div>
                                <p className="text-xs text-[var(--muted)] leading-relaxed">
                                    Upload a <span className="text-blue-400 font-bold">CSV</span> or <span className="text-blue-400 font-bold">XLSX</span> file with columns:
                                    <br />
                                    <code className="text-[10px] bg-slate-800 px-1 py-0.5 rounded mt-1 block">
                                        category, question, option1, option2, option3, option4, correct_answer, difficulty
                                    </code>
                                </p>
                                <button 
                                    onClick={downloadTemplate}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                                >
                                    <Download size={12} /> Download CSV Template
                                </button>
                            </div>

                            <div 
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                                    importFile ? 'border-blue-500/50 bg-blue-500/5' : 'border-[var(--card-border)] hover:border-blue-500/30'
                                }`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) setImportFile(file);
                                }}
                            >
                                <input 
                                    type="file" 
                                    id="file-upload" 
                                    className="hidden" 
                                    accept=".csv, .xlsx, .xls"
                                    onChange={(e) => setImportFile(e.target.files[0])}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                                        importFile ? 'bg-blue-500 text-white' : 'bg-[var(--muted-bg)] text-[var(--muted)]'
                                    }`}>
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-[var(--foreground)] mb-1">
                                        {importFile ? importFile.name : 'Click or drag to upload'}
                                    </p>
                                    <p className="text-xs text-[var(--muted)]">Excel or CSV files only</p>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="flex-1 btn-secondary justify-center py-3"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleImportQuestions}
                                    disabled={!importFile || isImporting}
                                    className="flex-1 btn-primary justify-center py-3"
                                >
                                    {isImporting ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Start Import <ArrowRight size={16} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
