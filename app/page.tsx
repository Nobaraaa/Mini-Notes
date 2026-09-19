"use client";

import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

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
      const response = await fetch("/api/notes");
      const data = await response.json();

      if (response.ok) {
        setNotes(data);
      }
    } catch (error) {
      console.error(error);
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

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
          📝 Mini Notes
        </h1>

        {/* Add / Edit Form */}
        <div className="mb-8 rounded-xl bg-black p-6 shadow">

          <h2 className="mb-4 text-2xl font-semibold">
            {editingId !== null
              ? "Edit Note"
              : "Add New Note"}
          </h2>

          {/* Title */}
          <input
            className="mb-3 w-full rounded-lg border p-3"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Content */}
          <textarea
            className="mb-3 w-full rounded-lg border p-3"
            placeholder="Content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Category */}
          <input
            className="mb-4 w-full rounded-lg border p-3"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="flex gap-3">

            <button
              onClick={saveNote}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              {editingId !== null
                ? "Update Note"
                : "Add Note"}
            </button>

            {editingId !== null && (
              <button
                onClick={clearForm}
                className="rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
            )}

          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 rounded-xl bg-black p-5 shadow">

          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}
            <input
              className="flex-1 rounded-lg border p-3"
              placeholder="🔍 Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category Filter */}
            <select
              className="rounded-lg border p-3"
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value)
              }
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Notes */}
        <div className="space-y-4">

          {filteredNotes.length === 0 ? (
            <p className="text-center text-gray-500">
              No notes found.
            </p>
          ) : (
            filteredNotes.map((note) => (

              <div
                key={note.id}
                className="rounded-xl bg-white p-5 shadow"
              >

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800">
                  {note.title}
                </h2>

                {/* Content */}
                <p className="mt-2 text-gray-600">
                  {note.content}
                </p>

                {/* Category */}
                <span className="mt-3 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm">
                  {note.category}
                </span>

                {/* Date */}
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(note.created_at).toLocaleString()}
                </p>

                {/* Buttons */}
                <div className="mt-4 flex gap-3">

                  <button
                    onClick={() => editNote(note)}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

    </main>
  );
}