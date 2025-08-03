import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      password,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: '✅ Usuario creado correctamente', data });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
}
