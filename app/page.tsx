"use client";

import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

// Deterministic color pairing for category badges/spines.
// Purely presentational — does not affect stored category values.
const CATEGORY_STYLES = [
  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", spine: "bg-emerald-400" },
  { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", spine: "bg-sky-400" },
  { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", spine: "bg-amber-400" },
  { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", spine: "bg-rose-400" },
  { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", spine: "bg-violet-400" },
  { bg: "bg-stone-100", text: "text-stone-700", border: "border-stone-300", spine: "bg-stone-400" },
];

function getCategoryStyle(category: string) {
  if (!category) return CATEGORY_STYLES[5];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CATEGORY_STYLES.length;
  return CATEGORY_STYLES[index];
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Search and filter
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notes");
      const data = await response.json();

      if (response.ok) {
        setNotes(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or Update note
  const saveNote = async () => {
    if (!title.trim() || !content.trim() || !category.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      // UPDATE
      if (editingId !== null) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingId,
            title,
            content,
            category,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setNotes((prev) =>
            prev.map((note) =>
              note.id === editingId ? data : note
            )
          );

          clearForm();
        } else {
          alert(data.error || "Failed to update note");
        }

        return;
      }

      // CREATE
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotes((prev) => [data, ...prev]);

        clearForm();
      } else {
        alert(data.error || "Failed to create note");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // Start editing
  const editNote = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete note
  const deleteNote = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setNotes((prev) =>
          prev.filter((note) => note.id !== id)
        );
      } else {
        alert(data.error || "Failed to delete note");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // Clear form
  const clearForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setEditingId(null);
  };

  // Search + Category Filter
  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText);

    const matchesCategory =
      filterCategory === "" ||
      note.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(notes.map((note) => note.category))
  );

  const hasActiveFilters = search.trim() !== "" || filterCategory !== "";

  const resetFilters = () => {
    setSearch("");
    setFilterCategory("");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#1F1E1B]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#E3E1DC] bg-[#F7F7F4]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <rect x="4" y="3" width="22" height="24" rx="3" stroke="#2F6F4F" strokeWidth="2" />
              <line x1="9" y1="10" x2="21" y2="10" stroke="#2F6F4F" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="15" x2="21" y2="15" stroke="#2F6F4F" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="20" x2="16" y2="20" stroke="#2F6F4F" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">
                Mini Notes
              </h1>
              <p className="hidden truncate text-xs text-[#6E6C66] sm:block">
                Organize your thoughts, one note at a time.
              </p>
            </div>
          </div>
          <span className="hidden shrink-0 rounded-full border border-[#E3E1DC] bg-white px-3 py-1 text-xs font-medium text-[#6E6C66] sm:inline-block">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Hero / Welcome */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your notes
          </h2>
          <p className="mt-1.5 text-[#6E6C66]">
            Create, organize and manage your thoughts easily.
          </p>
        </section>

        {/* Add / Edit Note Form */}
        <section className="mb-8 rounded-2xl border border-[#E3E1DC] bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-base font-semibold">
            {editingId !== null ? "Edit note" : "Create a new note"}
          </h3>

          <div className="space-y-3">
            <div>
              <label htmlFor="note-title" className="sr-only">
                Title
              </label>
              <input
                id="note-title"
                className="w-full rounded-lg border border-[#DEDCD6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F6F4F] focus:ring-2 focus:ring-[#2F6F4F]/20"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="note-content" className="sr-only">
                Content
              </label>
              <textarea
                id="note-content"
                className="w-full resize-y rounded-lg border border-[#DEDCD6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F6F4F] focus:ring-2 focus:ring-[#2F6F4F]/20"
                placeholder="Write your note here..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="note-category" className="sr-only">
                Category
              </label>
              <input
                id="note-category"
                list="category-suggestions"
                className="w-full rounded-lg border border-[#DEDCD6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F6F4F] focus:ring-2 focus:ring-[#2F6F4F]/20"
                placeholder="Category (e.g. Work, Personal)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={saveNote}
              className="rounded-lg bg-[#2F6F4F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#24573E] focus:outline-none focus:ring-2 focus:ring-[#2F6F4F]/40"
            >
              {editingId !== null ? "Update note" : "Add note"}
            </button>

            {editingId !== null && (
              <button
                onClick={clearForm}
                className="rounded-lg border border-[#DEDCD6] bg-white px-5 py-2.5 text-sm font-medium text-[#1F1E1B] transition hover:bg-[#F1F0EC] focus:outline-none focus:ring-2 focus:ring-[#2F6F4F]/20"
              >
                Cancel
              </button>
            )}
          </div>
        </section>

        {/* Search and Filter */}
        <section className="mb-6 rounded-2xl border border-[#E3E1DC] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C9A93]"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
                <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <label htmlFor="note-search" className="sr-only">
                Search notes
              </label>
              <input
                id="note-search"
                className="w-full rounded-lg border border-[#DEDCD6] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#2F6F4F] focus:ring-2 focus:ring-[#2F6F4F]/20"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <label htmlFor="category-filter" className="sr-only">
                Filter by category
              </label>
              <select
                id="category-filter"
                className="w-full rounded-lg border border-[#DEDCD6] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#2F6F4F] focus:ring-2 focus:ring-[#2F6F4F]/20 md:w-48"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="shrink-0 rounded-lg border border-[#DEDCD6] bg-white px-3 py-2.5 text-sm font-medium text-[#6E6C66] transition hover:bg-[#F1F0EC]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Notes header */}
        <div className="mb-4 flex items-center justify-between border-b border-[#E3E1DC] pb-3">
          <h3 className="text-base font-semibold">Your notes</h3>
          <span className="text-sm text-[#6E6C66]">
            {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
          </span>
        </div>

        {/* Notes grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E3E1DC] bg-white py-16 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2F6F4F] border-t-transparent" />
            <p className="mt-3 text-sm text-[#6E6C66]">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E3E1DC] bg-white px-6 py-16 text-center">
            <svg width="36" height="36" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <rect x="4" y="3" width="22" height="24" rx="3" stroke="#B7B5AE" strokeWidth="2" />
              <line x1="9" y1="10" x2="21" y2="10" stroke="#B7B5AE" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="15" x2="21" y2="15" stroke="#B7B5AE" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="20" x2="16" y2="20" stroke="#B7B5AE" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {notes.length === 0 ? (
              <>
                <p className="mt-3 font-medium text-[#1F1E1B]">No notes found</p>
                <p className="mt-1 text-sm text-[#6E6C66]">
                  Create your first note to get started.
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 font-medium text-[#1F1E1B]">No matching notes found</p>
                <p className="mt-1 text-sm text-[#6E6C66]">
                  Try changing your search or category filter.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => {
              const style = getCategoryStyle(note.category);
              return (
                <div
                  key={note.id}
                  className="group relative overflow-hidden rounded-xl border border-[#E3E1DC] bg-white pl-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-1.5 ${style.spine}`}
                    aria-hidden="true"
                  />
                  <div className="p-4">
                    <h4 className="line-clamp-2 text-base font-semibold text-[#1F1E1B]">
                      {note.title}
                    </h4>

                    <span
                      className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}
                    >
                      {note.category}
                    </span>

                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[#565550]">
                      {note.content}
                    </p>

                    <p className="mt-3 text-xs text-[#9C9A93]">
                      {new Date(note.created_at).toLocaleString()}
                    </p>

                    <div className="mt-4 flex gap-2 border-t border-[#EFEEEA] pt-3">
                      <button
                        onClick={() => editNote(note)}
                        aria-label={`Edit ${note.title}`}
                        className="flex-1 rounded-lg border border-[#DEDCD6] px-3 py-2 text-sm font-medium text-[#1F1E1B] transition hover:bg-[#F1F0EC] focus:outline-none focus:ring-2 focus:ring-[#2F6F4F]/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        aria-label={`Delete ${note.title}`}
                        className="flex-1 rounded-lg border border-[#F3D9D6] bg-[#FBEAE9] px-3 py-2 text-sm font-medium text-[#B3261E] transition hover:bg-[#F6DAD8] focus:outline-none focus:ring-2 focus:ring-[#B3261E]/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-[#E3E1DC] py-6">
        <p className="text-center text-xs text-[#9C9A93]">
          Mini Notes • Built with Next.js, React &amp; PostgreSQL
        </p>
      </footer>
    </div>
  );
}