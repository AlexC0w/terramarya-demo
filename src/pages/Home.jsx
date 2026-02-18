import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { useReservation } from '../context/ReservationContext';

const getTagColor = (type) => {
    if (type.includes('SportBar')) return 'bg-orange-600';
    if (type.includes('Familiar')) return 'bg-emerald-600';
    if (type.includes('Mariscos')) return 'bg-wine-600'; // Returning to wine for premium feel, or ocean if preferred? User disliked blue shadow, maybe keep tags distinct but not too jarring.
    return 'bg-wood-600';
};

const Home = () => {
    const { restaurants } = useReservation();

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')" }}
                >
                    {/* Dark Overlay for text contrast */}
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative container mx-auto px-4 text-center space-y-12 z-10 animate-in fade-in zoom-in duration-1000">
                    <div className="flex flex-col items-center justify-center gap-8">
                        <img
                            src={`${import.meta.env.BASE_URL}logo-white.png`}
                            alt="Terramarya Anchor"
                            className="h-72 md:h-96 w-auto object-contain drop-shadow-2xl opacity-100 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                        />
                    </div>

                    <div className="space-y-6 pt-4">
                        <p className="max-w-xl mx-auto text-cream-200/90 text-xl font-serif italic tracking-wide">
                            "Donde la tierra abraza al mar en una danza de sabores inigualables."
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <Link to="/reservar">
                                <Button size="lg" variant="primary" className="w-full md:w-auto min-w-[200px] h-14 shadow-xl hover:shadow-gold-500/20 text-xl tracking-[0.2em] uppercase font-bold border-2 border-transparent bg-gold-500 text-wood-900 hover:bg-gold-400">
                                    Reservar Mesa
                                </Button>
                            </Link>
                            <Link to="/puntos">
                                <Button variant="outline" size="lg" className="w-full md:w-auto min-w-[200px] h-14 text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white text-white">
                                    Happy Points
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Restaurants Section */}
            <section className="py-24 bg-wood-900 relative">
                <div className="absolute inset-0 bg-wood-pattern opacity-5 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-5xl md:text-6xl font-serif text-cream-100">Nuestros Espacios</h2>
                        <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full" />
                        <p className="text-cream-200/60 max-w-2xl mx-auto text-lg">
                            Tres ambientes distintos, una misma excelencia gastronómica. Elige tu experiencia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
                        {restaurants.map((restaurant) => {
                            const tagColor = getTagColor(restaurant.type);

                            return (
                                <Card key={restaurant.id} className="group hover:-translate-y-2 transition-transform duration-500 border-none bg-cream-100 overflow-hidden flex flex-col md:flex-row lg:flex-col h-full shadow-xl shadow-black/20">
                                    <Link to={`/restaurante/${restaurant.id}`} className="relative h-72 md:h-auto md:w-2/5 lg:w-full lg:h-72 overflow-hidden shrink-0 block cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                        <img
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070";
                                            }}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20">
                                            <span className={`text-white text-xs px-4 py-1.5 rounded-full uppercase tracking-[0.1em] font-bold shadow-lg backdrop-blur-sm border border-white/10 ${tagColor}`}>
                                                {restaurant.type}
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="flex flex-col grow md:w-3/5 lg:w-full">
                                        <CardHeader>
                                            <Link to={`/restaurante/${restaurant.id}`}>
                                                <CardTitle className="group-hover:text-gold-600 transition-colors text-3xl font-serif text-wood-900">
                                                    {restaurant.name}
                                                </CardTitle>
                                            </Link>
                                        </CardHeader>

                                        <CardContent className="grow">
                                            <CardDescription className="text-base leading-relaxed line-clamp-3 md:line-clamp-none lg:line-clamp-3 text-wood-600 font-medium">
                                                {restaurant.description}
                                            </CardDescription>
                                        </CardContent>

                                        <CardFooter className="flex flex-col gap-4 pt-6 shrink-0 mt-auto">
                                            <Link to={`/reservar?restaurantId=${restaurant.id}`} className="w-full">
                                                <Button variant="primary" className="w-full py-6 text-sm tracking-[0.2em] uppercase shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform font-bold bg-gold-500 hover:bg-gold-600 text-wood-950 border-none">
                                                    Reservar Mesa
                                                </Button>
                                            </Link>
                                            <Link to={`/restaurante/${restaurant.id}`} className="w-full">
                                                <Button variant="outline" className="w-full py-4 text-xs border border-wood-200 hover:border-wood-900 text-wood-800 hover:bg-wood-900 hover:text-gold-400 tracking-[0.2em] uppercase transition-all">
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Home;
