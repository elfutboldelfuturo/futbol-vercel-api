import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🛡️ Protegido con Service Role Key (desde env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // https://fbkoqwgtjwicieiltmbd.supabase.co
  process.env.SUPABASE_SERVICE_ROLE_KEY! // sb_secret_...
);

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { correo, password, nombre, roles, equipo_id, categoria_id } = body;

    if (!correo || !password || !roles?.length || !nombre) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { data: user, error } = await supabase.auth.admin.createUser({
      email: correo,
      password,
    });

    if (error || !user?.user?.id) {
      return NextResponse.json({ error: error?.message || 'No se pudo crear el usuario' }, { status: 500 });
    }

    const { error: insertError } = await supabase.from('usuarios').insert({
      id: user.user.id,
      correo,
      nombre,
      rol_principal: roles[0],
      roles,
      equipo_id: equipo_id || null,
      categoria_id: categoria_id || null,
      creado_en: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error interno: ' + err.message }, { status: 500 });
  }
}
