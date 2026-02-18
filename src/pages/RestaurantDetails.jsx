import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { useReservation } from '../context/ReservationContext';
import { Clock, Calendar, Utensils, ArrowRight, X } from 'lucide-react';

const RestaurantDetails = () => {
    const { id } = useParams();
    const { restaurants, checkAvailability } = useReservation();
    const restaurant = restaurants.find(r => r.id.toString() === id);
    const [showFullMenu, setShowFullMenu] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (!restaurant) return <div>Restaurante no encontrado</div>;

    const today = new Date().toISOString().split('T')[0];
    const timeSlots = Array.from({ length: 6 }).map((_, i) => `${18 + i}:00`);

    return (
        <Layout>
            {/* Hero */}
            <div className="relative h-[60vh]">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070";
                    }}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-wood-900/60 gradient-mask-b flex items-center justify-center">
                    <div className="text-center space-y-4 px-4 animate-in fade-in zoom-in duration-700">
                        <h1 className="text-5xl md:text-7xl font-serif text-white drop-shadow-2xl">{restaurant.name}</h1>
                        <p className="text-xl text-gold-400 font-light tracking-widest uppercase">{restaurant.type}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 space-y-24">

                {/* Description & Availability */}
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-serif text-gold-400">Sobre Nosotros</h2>
                        <p className="text-cream-200/80 text-lg leading-relaxed">{restaurant.description}</p>

                        <div className="pt-8">
                            <h3 className="text-2xl font-serif text-cream-100 mb-6">Galería</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {restaurant.gallery?.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-sm overflow-hidden group">
                                        <img
                                            src={img}
                                            alt="Gallery"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070";
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                                {restaurant.gallery?.length < 3 && (
                                    <div className="aspect-square bg-wood-800/20 rounded-sm flex items-center justify-center border border-white/5">
                                        <span className="text-cream-200/20 text-xs">Más fotos pronto</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <Card className="sticky top-24 bg-wood-800/50 border-white/5 backdrop-blur-md">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-xl font-serif text-gold-400 flex items-center gap-2">
                                    <Clock className="w-5 h-5" /> Disponibilidad Hoy
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {timeSlots.map(time => {
                                        const isAvailable = checkAvailability(restaurant.id, today, time);
                                        return (
                                            <div
                                                key={time}
                                                className={`text-center py-2 rounded-sm text-sm border ${isAvailable
                                                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                                    : 'border-red-500/30 text-red-400 bg-red-500/10 opacity-50'
                                                    }`}
                                            >
                                                {time}
                                            </div>
                                        )
                                    })}
                                </div>
                                <Link to={`/reservar?restaurantId=${restaurant.id}`} className="block">
                                    <Button className="w-full">Reservar Mesa</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Menu Highlights */}
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-serif text-gold-400">Menú Destacado</h2>
                        <div className="w-24 h-1 bg-gold-500 mx-auto opacity-50" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {restaurant.menu?.slice(0, 3).map((item, i) => (
                            <Card key={i} className="bg-transparent border-none shadow-none group">
                                <div className="border-b border-white/10 pb-4 mb-4 group-hover:border-gold-500/50 transition-colors">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="text-xl font-serif text-cream-100 group-hover:text-gold-400 transition-colors">{item.name}</h4>
                                        <span className="text-gold-500 font-mono">{item.price}</span>
                                    </div>
                                    <p className="text-cream-200/60 text-sm">{item.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button variant="outline" onClick={() => setShowFullMenu(true)}>Ver Menú Completo</Button>
                    </div>
                </div>

            </div>

            {/* Full Menu Modal */}
            {showFullMenu && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wood-900/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-wood-800 border border-white/10 rounded-sm w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl relative">
                        <button
                            onClick={() => setShowFullMenu(false)}
                            className="absolute top-4 right-4 text-cream-200/60 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-8 space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-serif text-gold-400">Menú Completo</h2>
                                <p className="text-cream-200/60">{restaurant.name}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                {restaurant.menu?.map((item, i) => (
                                    <div key={i} className="border-b border-white/5 pb-4">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h4 className="font-serif text-lg text-cream-100">{item.name}</h4>
                                            <span className="text-gold-500 font-mono text-sm">{item.price}</span>
                                        </div>
                                        <p className="text-cream-200/50 text-xs">{item.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center pt-8 border-t border-white/5">
                                <Button onClick={() => setShowFullMenu(false)}>Cerrar Menú</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default RestaurantDetails;
