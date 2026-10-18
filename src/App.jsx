import React from 'react';
import { TaskForm } from './components/TaskForm';
import { useLocalStorage } from './hooks/useLocalStorage';

const COLUMNS = [
  {
    status: 'Yapılacak',
    title: 'Yapılacak',
    dot: 'bg-slate-500',
    empty: 'Henüz görev yok. Yukarıdan yeni bir görev ekleyebilirsin.',
  },
  {
    status: 'Devam Ediyor',
    title: 'Devam Ediyor',
    dot: 'bg-amber-500',
    empty: 'Şu an üzerinde çalıştığın görev yok.',
  },
  {
    status: 'Tamamlandı',
    title: 'Tamamlandı',
    dot: 'bg-teal-600',
    empty: 'Tamamladığın görevler burada görünür.',
  },
];

const PRIORITY_STYLES = {
  Yüksek: { badge: 'bg-rose-100 text-rose-800 ring-rose-300', dot: 'bg-rose-600' },
  Orta: { badge: 'bg-amber-100 text-amber-800 ring-amber-300', dot: 'bg-amber-600' },
  Düşük: { badge: 'bg-emerald-100 text-emerald-800 ring-emerald-300', dot: 'bg-emerald-600' },
};

const CATEGORY_LABELS = {
  Frontend: 'Frontend',
  Backend: 'Backend',
  Bug: 'Hata Düzeltme',
  Test: 'Test',
};

const moveBtn =
  'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600';

function TaskCard({ task, onDelete, onMove }) {
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Orta;

  return (
    <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm transition hover:border-slate-400 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-snug text-slate-900">{task.title}</p>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`"${task.title}" görevini sil`}
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-100 hover:text-rose-700 focus:outline-none"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-slate-200 px-2.5 py-1 font-semibold text-slate-800">
          {CATEGORY_LABELS[task.category] || task.category}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ring-1 ring-inset ${priority.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {task.priority}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-3">
        {task.status !== 'Yapılacak' && (
          <button
            type="button"
            onClick={() => onMove(task, 'Yapılacak')}
            className={`${moveBtn} text-slate-700 bg-slate-100 hover:bg-slate-200`}
          >
            ← Yapılacak
          </button>
        )}
        {task.status === 'Tamamlandı' && (
          <button
            type="button"
            onClick={() => onMove(task, 'Devam Ediyor')}
            className={`${moveBtn} text-amber-800 bg-amber-100 hover:bg-amber-200`}
          >
            Devam Et
          </button>
        )}
        {task.status === 'Yapılacak' && (
          <button
            type="button"
            onClick={() => onMove(task, 'Devam Ediyor')}
            className={`${moveBtn} bg-amber-100 text-amber-900 hover:bg-amber-200`}
          >
            Başla
          </button>
        )}
        {task.status === 'Devam Ediyor' && (
          <button
            type="button"
            onClick={() => onMove(task, 'Tamamlandı')}
            className={`${moveBtn} bg-teal-100 text-teal-900 hover:bg-teal-200`}
          >
            Tamamla ✓
          </button>
        )}
      </div>
    </article>
  );
}

function App() {
  const [tasks, setTasks] = useLocalStorage('devsprint_tasks', []);

  const handleAddTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleDeleteTask = (task) => {
    const isConfirmed = window.confirm(`"${task.title}" görevini silmek istediğinize emin misiniz?`);
    if (isConfirmed) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
  };

  const handleStatusChange = (task, newStatus) => {
    const isConfirmed = window.confirm(
      `"${task.title}" görevinin durumunu "${newStatus}" olarak güncellemek istiyor musunuz?`
    );
    if (isConfirmed) {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    }
  };

  const doneCount = tasks.filter((t) => t.status === 'Tamamlandı').length;
  const progress = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              🚀 DevSprint : Sprint'leri Takip Et
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Görevlerini ekle, takip et, tamamladıkça ilerle.
            </p>
          </div>

          <div className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm sm:w-64">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold text-slate-800">İlerleme</span>
              <span className="font-medium text-slate-600">
                {doneCount}/{tasks.length} tamamlandı
              </span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tamamlanan görev oranı"
            >
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <main>
          <TaskForm onAddTask={handleAddTask} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {COLUMNS.map((col) => {
              const columnTasks = tasks.filter((task) => task.status === col.status);

              return (
                <section
                  key={col.status}
                  aria-label={col.title}
                  className="flex flex-col rounded-2xl bg-slate-200/80 p-3 sm:p-4 md:min-h-[420px] border border-slate-300/60"
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                      {col.title}
                    </h2>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-slate-800 shadow-sm border border-slate-200">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    {columnTasks.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-400/80 p-6 text-center">
                        <p className="max-w-[16rem] text-sm font-medium text-slate-600">{col.empty}</p>
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDeleteTask}
                          onMove={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;