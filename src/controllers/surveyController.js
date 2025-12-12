import supabase from "../config/db.js";

export const getAllSurveys = async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("host_id", userId);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
};

export const createSurvey = async (req, res) => {
  const { host_id, title, code, status } = req.body;
  const { data, error } = await supabase
    .from("surveys")
    .insert([{ host_id, title, code, status }])
    .select();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  const io = req.app.get("io");
  io.emit("surveyCreated", data);
  res.status(201).json(data);
};

//  update title
export const updateSurveyTitle = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const { data, error } = await supabase
    .from("surveys")
    .update({ title })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: "Survey title updated successfully", data });
};

//  delete survey
export const deleteSurvey = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("surveys").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: "Survey deleted successfully" });
};
