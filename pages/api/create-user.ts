// pages/api/create-user.ts

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { correo, password, rol } = req.body;

  if (!correo || !password || !rol) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: correo,
      password: password,
      email_confirm: true,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ mensaje: 'Usuario creado', data });
  } catch (err) {
    return res.status(500).json({ error: 'Error inesperado al crear usuario' });
  }
};
