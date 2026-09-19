// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// // GET - Fetch all notes
// export async function GET() {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM notes ORDER BY created_at DESC"
//     );

//     return NextResponse.json(result.rows);
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to fetch notes" },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new note
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const { title, content, category } = body;

//     if (!title || !content || !category) {
//       return NextResponse.json(
//         { error: "Title, content and category are required" },
//         { status: 400 }
//       );
//     }

//     const result = await pool.query(
//       `INSERT INTO notes (title, content, category)
//        VALUES ($1, $2, $3)
//        RETURNING *`,
//       [title, content, category]
//     );

//     return NextResponse.json(result.rows[0], { status: 201 });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to create note" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET - Fetch all notes
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM notes ORDER BY created_at DESC"
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST - Create note
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, content, category } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content and category are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO notes (title, content, category)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, content, category]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

// PUT - Update note
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, title, content, category } = body;

    if (!id || !title || !content || !category) {
      return NextResponse.json(
        { error: "ID, title, content and category are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE notes
       SET title = $1,
           content = $2,
           category = $3
       WHERE id = $4
       RETURNING *`,
      [title, content, category, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE - Delete note
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}