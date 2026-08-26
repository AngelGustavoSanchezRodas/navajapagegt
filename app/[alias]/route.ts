import { NextRequest, NextResponse } from "next/server";

/**
 * Route Handler para redirección dinámica de enlaces cortos.
 * Intercepta alias en la raíz del dominio y los consulta al backend de Java.
 */

const SYSTEM_ROUTES = [
  'login', 
  'register', 
  'dashboard', 
  'herramientas', 
  'api', 
  'bio', 
  'favicon.ico',
  'not-found',
  'error'
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alias: string }> }
) {
  const { alias } = await params;

  // 1. IMPLEMENTA UNA LISTA NEGRA (Anti-Colisiones)
  // Evitamos interceptar rutas del sistema o recursos de Next.js
  if (
    SYSTEM_ROUTES.includes(alias) || 
    alias.startsWith('_next') || 
    alias.includes('.') // Evita interceptar archivos estáticos comunes
  ) {
    return NextResponse.next();
  }

  try {
    // 2. Consulta a la API de redirección del backend (Java)
    // Usamos redirect: 'manual' para capturar nosotros mismos los status 3xx
    const response = await fetch(`/api/core/links/public/${alias}`, {
      method: 'GET',
      redirect: 'manual',
      // Añadimos headers mínimos por seguridad
      headers: {
        'Accept': 'application/json',
      },
    });

    // 3. Manejo de Redirección status 301 o 302
    if (response.status === 301 || response.status === 302) {
      const location = response.headers.get('Location');
      if (location) {
        return NextResponse.redirect(new URL(location));
      }
    }

    // 4. Manejo de error o 404
    // Si Java devuelve 404 o cualquier otro status no redireccionable
    return NextResponse.redirect(new URL('/not-found', request.url));

  } catch (error) {
    console.error(`[Redirection Error] Alias: ${alias}`, error);
    // En caso de fallo de red o error de servidor, vamos a 404 para no romper la UX
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
}
