import supabase from "../config/db.js";

export const getAllResponses = async (req, res) => {
  const { data, error } = await supabase.from("responses").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

export const getResponsesByQuestion = async (req, res) => {
  const { questionId } = req.params;
  try {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .eq("question_id", questionId); // ✅ Check column name in Supabase

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createResponse = async (req, res) => {
  const { question_id, participant_id, answer } = req.body;
  const { data, error } = await supabase
    .from("responses")
    .insert([{ question_id, participant_id, answer }]);
  if (error) return res.status(500).json({ error: error.message });
  const io = req.app.get("io");
  io.emit("newResponse", data);
  res.status(201).json(data);
};

export const updateResponseAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  const { data, error } = await supabase
    .from("responses")
    .update({ answer })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Response updated successfully", data });
};

export const deleteResponse = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("responses").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Response deleted successfully" });
};
