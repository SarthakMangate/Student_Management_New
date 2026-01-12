import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function askAI(question: string, context: any, history: any[] = []) {
  try {
    // 1. Create a snapshot of your DB facts
    const dbFacts = `
      DATABASE DATA:
      - Total Students: ${context.totalStudents}
      - Departments: ${JSON.stringify(context.departmentCounts)}
      - Student List: ${context.studentNames}
      - Student Age: ${context.studentAges}
    `;

    // 2. Call Cohere with a "General + Specific" instruction
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-a-03-2025", 
        preamble: `## Task and Context
You are a versatile Student Management Assistant. You have access to the specific database data provided below. 

## Instructions
1. If a question is about the students or the database, use the provided DATABASE DATA.
2. If a question is general (e.g., math, science, history, coding), use your general AI knowledge to answer helpfully.
3. If the user asks for student names and they aren't in the list, state that you don't have that specific record.
4. Always be professional, concise, and use Markdown for tables or lists.

## Database Context
${dbFacts}`,
        message: question,
        chat_history: history,
        temperature: 0.3 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      answer: response.data.text,
      newHistory: response.data.chat_history
    };
  } catch (err: any) {
    console.error("[Cohere Error]:", err.response?.data || err.message);
    return { answer: "I'm having trouble thinking right now. Try again?", newHistory: history };
  }
}

export default askAI;