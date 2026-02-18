import React from 'react';
import { Layout } from '../components/ui/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { useReservation } from '../context/ReservationContext';
import { Star, Award, Crown, Gift } from 'lucide-react';
import { cn } from '../lib/utils';

const HappyPoints = () => {
    const { user } = useReservation();

    const tiers = [
        { name: 'Explorador', min: 0, max: 499, color: 'text-cream-200', icon: Star },
        { name: 'Gourmet', min: 500, max: 1499, color: 'text-gold-400', icon: Award },
        { name: 'Terramarya Elite', min: 1500, max: Infinity, color: 'text-wine-500', icon: Crown },
    ];

    const currentTier = tiers.find(t => user.points >= t.min && user.points <= t.max) || tiers[tiers.length - 1];
    const nextTier = tiers[tiers.indexOf(currentTier) + 1];

    const progress = nextTier
        ? ((user.points - currentTier.min) / (nextTier.min - currentTier.min)) * 100
        : 100;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif text-gold-400">Happy Points</h1>
                        <p className="text-cream-200/60">
                            Tu lealtad tiene recompensas exclusivas.
                        </p>
                    </div>

                    {/* Digital Card */}
                    <div className="relative aspect-[1.586/1] w-full rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                        {/* Card Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-wood-900 to-black`}>
                            <div className="absolute inset-0 bg-wood-pattern opacity-20 mix-blend-overlay" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-wine-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Card Content */}
                        <div className="relative h-full p-8 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-serif text-2xl text-gold-400 tracking-widest">TERRAMARYA</h3>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-cream-200/60">Rewards Club</p>
                                </div>
                                <currentTier.icon className={cn("h-8 w-8", currentTier.color)} />
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm uppercase tracking-widest text-cream-200/40">Miembro</p>
                                <p className="font-serif text-xl text-cream-100">{user.name}</p>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm uppercase tracking-widest text-cream-200/40">Nivel Actual</p>
                                    <p className={cn("font-serif text-2xl font-bold", currentTier.color)}>
                                        {currentTier.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm uppercase tracking-widest text-cream-200/40">Puntos</p>
                                    <p className="font-mono text-3xl text-gold-500">{user.points}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <Card className="bg-wood-900/40 border-white/5">
                        <CardContent className="pt-6 space-y-6">
                            {nextTier ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-cream-200/60">Progreso a {nextTier.name}</span>
                                        <span className="text-gold-400">{Math.floor(nextTier.min - user.points)} puntos restantes</span>
                                    </div>
                                    <div className="h-2 bg-wood-900 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gold-400 font-serif text-xl">¡Has alcanzado el nivel máximo!</p>
                                    <p className="text-cream-200/60 text-sm">Disfruta de todos los beneficios exclusivos.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                                {tiers.map((tier) => (
                                    <div key={tier.name} className={cn(
                                        "text-center space-y-2 p-3 rounded-sm transition-colors",
                                        user.points >= tier.min ? "bg-gold-500/5 ring-1 ring-gold-500/20" : "opacity-40"
                                    )}>
                                        <tier.icon className={cn("h-6 w-6 mx-auto", tier.color)} />
                                        <p className="text-[10px] uppercase tracking-wider font-medium">{tier.name}</p>
                                        <p className="text-[10px] text-cream-200/40">{tier.min}+ pts</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Benefits */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-wood-900/40 border-white/5 hover:border-gold-500/30 transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="bg-wine-900/50 p-3 rounded-full group-hover:bg-wine-500 transition-colors">
                                    <Gift className="h-6 w-6 text-wine-200 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-serif text-lg text-cream-100 mb-1">Beneficios Actuales</h4>
                                    <p className="text-sm text-cream-200/60">
                                        Acceso a reservas prioritarias y postre de cortesía en tu cumpleaños.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-wood-900/40 border-white/5 opacity-60">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="bg-wood-800 p-3 rounded-full">
                                    <Crown className="h-6 w-6 text-gold-500/50" />
                                </div>
                                <div>
                                    <h4 className="font-serif text-lg text-cream-100 mb-1">Siguiente Nivel</h4>
                                    <p className="text-sm text-cream-200/60">
                                        Mesa exclusiva del chef, botella de vino de la casa mensual y más.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default HappyPoints;
