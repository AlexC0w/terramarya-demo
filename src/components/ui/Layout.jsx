import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Utensils } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { label: 'Inicio', path: '/' },
        { label: 'Reservar', path: '/reservar' },
        { label: 'Happy Points', path: '/puntos' },
    ];

    const adminNavItems = [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Clientes', path: '/admin/clientes' },
        { label: 'Registro Venta', path: '/admin/registro-venta' },
        { label: 'Configuración', path: '/admin/settings' },
    ];

    const isAdmin = location.pathname.startsWith('/admin');
    const items = isAdmin ? adminNavItems : navItems;

    return (
        <div className="min-h-screen w-full flex flex-col bg-wood-900 text-cream-100 font-sans selection:bg-gold-500 selection:text-wood-900 overflow-x-hidden relative">
            {/* Navbar - Fixed to guarantee visibility */}
            <nav className="fixed top-0 left-0 right-0 z-[1000] w-full bg-wood-900/98 backdrop-blur-md border-b border-white/5 h-20 transition-all duration-300 shadow-xl">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={`${import.meta.env.BASE_URL}logo-simple.png`}
                            alt="Terramarya Logo"
                            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                        />
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl tracking-widest font-bold text-cream-100 group-hover:text-gold-400 transition-colors">TERRAMARYA</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {items.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "text-sm uppercase tracking-widest hover:text-gold-400 transition-colors py-2 border-b-2 border-transparent",
                                    location.pathname === item.path ? "text-gold-400 border-gold-400" : "text-cream-200"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {!isAdmin && (
                            <Link to="/reservar">
                                <Button variant="primary" size="sm" className="ml-4">
                                    Reservar Ahora
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle - Explicit High Z-Index */}
                    <button
                        className="lg:hidden text-cream-100 hover:text-gold-400 p-2 relative z-[1001]"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav - Fixed Overlay - Moved outside Nav to escape containing block */}
            {isMenuOpen && (
                <div className="lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-wood-900/98 backdrop-blur-xl border-t border-white/5 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5 z-[999] overflow-y-auto shadow-2xl">
                    {items.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                                "text-xl font-serif p-4 text-center border border-white/5 rounded-sm active:bg-white/5 transition-colors",
                                location.pathname === item.path ? "text-gold-400 bg-white/5 border-gold-400/30" : "text-cream-200"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link to="/reservar" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full mt-4 text-lg">Reservar Ahora</Button>
                    </Link>
                </div>
            )}

            {/* Main Content - Added padding-top to account for fixed navbar */}
            <main className="flex-grow pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-wood-900 border-t border-white/5 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <img src={`${import.meta.env.BASE_URL}logo-white.png`} alt="Logo" className="h-14 w-auto opacity-90" />
                                <h3 className="font-serif text-3xl text-cream-100 tracking-wide">Terramarya</h3>
                            </div>
                            <p className="text-cream-200/60 leading-relaxed">
                                Una experiencia gastronómica que fusiona lo mejor de la tierra y el mar en un ambiente rústico y elegante.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-serif text-lg text-cream-100">Horarios</h4>
                            <ul className="space-y-2 text-cream-200/60">
                                <li className="flex justify-between"><span>Lun - Jue</span> <span>1:00 PM - 10:00 PM</span></li>
                                <li className="flex justify-between"><span>Vie - Sab</span> <span>1:00 PM - 12:00 AM</span></li>
                                <li className="flex justify-between"><span>Dom</span> <span>1:00 PM - 9:00 PM</span></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-serif text-lg text-cream-100">Contacto</h4>
                            <p className="text-cream-200/60">Av. Independencia 123, Centro, Hidalgo del Parral, Chih.</p>
                            <p className="text-gold-400">+52 (627) 522 0000</p>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-cream-200/40">
                        <p>© 2024 Terramarya. Todos los derechos reservados. <span className="text-gold-500/50 ml-2">v1.3 (Layout Fix)</span></p>
                        <div className="flex gap-4">
                            <Link to="/admin/clientes" className="hover:text-gold-500 transition-colors">Clientes CRM</Link>
                            <Link to="/admin/registro-venta" className="hover:text-gold-500 transition-colors">Registro Venta</Link>
                            <Link to="/admin" className="hover:text-gold-500 transition-colors">Admin Access</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export { Layout };
