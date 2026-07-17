// frontend/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl.pathname;
    
    // 🔥 Bloquer les requêtes vers des fichiers statiques dans les routes dynamiques
    if (url.match(/\/series\/[^\/]+\/[^\/]+\/[^\/]+\.(png|ico|jpg|jpeg|svg|webp|json|xml|txt)/)) {
        console.log(`⛔ Middleware: Requête statique bloquée - ${url}`);
        return new NextResponse('Not Found', { status: 404 });
    }
    
    // 🔥 Bloquer les requêtes avec 'undefined' dans l'URL
    if (url.includes('/undefined/') || url.includes('/null/')) {
        console.log(`⛔ Middleware: URL invalide bloquée - ${url}`);
        return new NextResponse('Not Found', { status: 404 });
    }
    
    // 🔥 Bloquer les requêtes où season est 'images'
    if (url.match(/\/series\/[^\/]+\/images\//)) {
        console.log(`⛔ Middleware: Requête images bloquée - ${url}`);
        return new NextResponse('Not Found', { status: 404 });
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/series/:path*',
        '/movies/:path*',
    ],
};