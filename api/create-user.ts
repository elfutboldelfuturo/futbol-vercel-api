import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { correo, password, rol } = req.body;

  if (!correo || !password || !rol) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: correo,
      password,
    });

    if (error || !user?.user?.id) {
      return res.status(500).json({ error: error?.message || 'Error al crear usuario' });
    }

    return res.status(200).json({ success: true, userId: user.user.id });
  } catch (err) {
    return res.status(500).json({ error: 'Error inesperado' });
  }
}
