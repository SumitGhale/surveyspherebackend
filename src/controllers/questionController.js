import supabase from "../config/db.js";

//  get all questions
export const getAllQuestions = async (req, res) => {
  const { data, error } = await supabase.from("questions").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

//  get question by survey
export const getQuestionsBySurvey = async (req, res) => {
  const { survey_id } = req.params;
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", survey_id)
    .order("order_index", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

//  create question
export const createQuestion = async (req, res) => {
  const { text, type, options, survey_id } = req.body;

  const maxOrderIndexResult = await supabase
    .from("questions")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1);

  const new_order_index =
    maxOrderIndexResult.data.length > 0
      ? maxOrderIndexResult.data[0].order_index + 1
      : 1;
  const { data, error } = await supabase
    .from("questions")
    .insert([{ text, survey_id, order_index: new_order_index, type, options }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  const io = req.app.get("io");
  io.emit("newQuestion", data);
  res.status(201).json(data);
};

//  update question text
export const updateQuestionText = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const { data, error } = await supabase
    .from("questions")
    .update({ text })
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Question text updated successfully", data });
};

//  delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get the question to be deleted
    const { data: deletedQuestion, error: findError } = await supabase
      .from("questions")
      .select("order_index")
      .eq("id", id)
      .single();

    if (findError) throw findError;
    if (!deletedQuestion) return res.status(404).json({ error: "Question not found" });

    // 2. Delete the question
    const { error: deleteError } = await supabase
      .from("questions")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // 3. Fetch all with higher order_index
    const { data: questionsToUpdate, error: fetchError } = await supabase
      .from("questions")
      .select("id, order_index")
      .gt("order_index", deletedQuestion.order_index);

    if (fetchError) throw fetchError;

    // 4. Decrement order_index
    for (const q of questionsToUpdate) {
      const { error: updateError } = await supabase
        .from("questions")
        .update({ order_index: q.order_index - 1 })
        .eq("id", q.id);
      if (updateError) console.error(`Failed to update question ${q.id}:`, updateError.message);
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error.message);
    res.status(500).json({ error: error.message });
  }
};

