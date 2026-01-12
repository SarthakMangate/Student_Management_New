import { pool } from "../config/db";

export async function buildContext() {
  // Fetch department counts
  const branchRes = await pool.query(`
    SELECT course, COUNT(*)::int AS count FROM students GROUP BY course
  `);

  // Fetch all student names
  const studentsRes = await pool.query(
    `SELECT name, course , age , email , phone , address , image FROM students`
  );

  const distribution: Record<string, number> = {};
  let total = 0;
  branchRes.rows.forEach((r: any) => {
    distribution[r.course || "General"] = r.count;
    total += r.count;
  });

  const studentList = studentsRes.rows
    .map(
      (s) =>
        `${s.name} (${s.course} ${s.email} (${s.phone} ${s.age} (${s.phone} ${s.gender})`
    )
    .join(", ");

  return {
    totalStudents: total,
    departmentCounts: distribution,
    studentNames: studentList || "None",
  };
}
