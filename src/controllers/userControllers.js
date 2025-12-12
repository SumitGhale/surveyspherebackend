import supabase from "../config/db.js";

export const getUsers = async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
};

export const createUser = async (req, res) => {
  const {id, name, email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ id: id, name: name, email: email }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ message: "User created successfully", user: data });
}

export const updateUser = async (req, res) => {
  const id = req.params.id;

  const { name, email } = req.body;
  const { data, error } = await supabase
    .from("users")
    .update({ name: name, email: email })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: "User updated successfully", user: data });
};

export const getUserById = async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const response = await supabase
  .from('users')
  .delete()
  .eq('id', id);
  
  if (response.error) {
    return res.status(500).json({ error: response.error.message });
  }
  res.status(200).json({ message: "User deleted successfully" });
};