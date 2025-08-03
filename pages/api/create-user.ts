import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { correo, password, rol, nombre } = req.body;

  if (!correo || !password || !rol) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const { data: user, error } = await supabase.auth.admin.createUser({
    email: correo,
    password,
  });

  if (error || !user?.user?.id) {
    return res.status(500).json({ error: error?.message || 'Error al crear usuario en auth' });
  }

  const { error: insertError } = await supabase.from('usuarios').insert({
    id: user.user.id,
    correo,
    nombre: nombre || '',
    rol_principal: rol,
    roles: [rol],
    creado_en: new Date().toISOString(),
  });

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(200).json({ mensaje: '✅ Usuario creado correctamente' });
}
