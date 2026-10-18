import  { useState } from 'react';

export const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Orta');
  const [category, setCategory] = useState('Frontend');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      priority,
      category,
      status: 'Yapılacak',
    };

    onAddTask(newTask);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-5 shadow-xl mb-8">
      <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
        ✨ Yeni Görev Oluştur
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Görev adını girin (Örn: API Entegrasyonu yap)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            required
          />
        </div>

        <div className="md:col-span-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="Düşük">Düşük Öncelik</option>
            <option value="Orta">Orta Öncelik</option>
            <option value="Yüksek">Yüksek Öncelik</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Bug">Bug Fix</option>
            <option value="Test">Test & QA</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            Görev Ekle
          </button>
        </div>
      </div>
    </form>
  );
};