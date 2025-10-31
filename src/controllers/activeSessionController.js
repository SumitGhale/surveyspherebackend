import supabase from "../config/db.js";

// get all active sessions
export const getAllActiveSessions = async (req, res) => {
  const { data, error } = await supabase.from("active_sessions").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

// create active session
export const createActiveSession = async (req, res) => {
  const { survey_id, current_question_id } = req.body;
  const { data, error } = await supabase.from("active_sessions").insert([
    { survey_id, current_question_id }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// update current_question_id by survey_id
export const updateActiveSession = async (req, res) => {
  const { survey_id } = req.params;
  const { current_question_id } = req.body;
  const { data, error } = await supabase
    .from("active_sessions")
    .update({ current_question_id })
    .eq("survey_id", survey_id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Active session updated successfully", data });
};

// delete active session by survey_id
export const deleteActiveSession = async (req, res) => {
  const { survey_id } = req.params;
  const { error } = await supabase
    .from("active_sessions")
    .delete()
    .eq("survey_id", survey_id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Active session deleted successfully" });
};