import React, { useState } from 'react';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { useReservation } from '../context/ReservationContext';
import { BarChart3, Users, Calendar, AlertTriangle, Lock, Unlock, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const Admin = () => {
    const { reservations, restaurants } = useReservation();
    // Use local date to match user's "Today"
    const [filterDate, setFilterDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [selectedRestaurant, setSelectedRestaurant] = useState('all');
    const [notification, setNotification] = useState(null);

    // Analytics Logic
    const filteredReservations = reservations.filter(r => {
        const matchesDate = r.date === filterDate;
        const matchesRestaurant = selectedRestaurant === 'all' || r.restaurantId.toString() === selectedRestaurant;
        return matchesDate && matchesRestaurant;
    });

    const stats = {
        total: filteredReservations.reduce((acc, curr) => acc + parseInt(curr.pax), 0),
        count: filteredReservations.length,
        estimatedRevenue: filteredReservations.reduce((acc, curr) => acc + (parseInt(curr.pax) * 850), 0), // Est. $850 MXN per person (Higher ticket)
        byRestaurant: restaurants.map(r => ({
            name: r.name,
            count: filteredReservations.filter(res => res.restaurantId === r.id).length,
            pax: filteredReservations.filter(res => res.restaurantId === r.id).reduce((acc, curr) => acc + parseInt(curr.pax), 0)
        })),
        byHour: Array.from({ length: 13 }).map((_, i) => {
            const hourInt = 12 + i;
            // Format: "13:00", "14:00" etc. matching data
            // For 24:00/00:00 we need to match how data is stored or display 00:00
            const displayHour = hourInt === 24 ? "00:00" : `${hourInt}:00`;

            // Data stored as "13:00"
            // We need to count matching times
            // Robust matching using integers
            // Simplified string matching
            // hourInt goes from 12 to 24
            const searchHour = hourInt === 24 ? 0 : hourInt;
            // Normalize to string "13", "0", "22"

            const count = filteredReservations.filter(r => {
                if (!r.time) return false;
                // Parse the hour from time string "13:00" -> 13
                const h = parseInt(r.time.split(':')[0]);
                // Handle 24:00 edge case in data if it exists
                if (h === 24 && searchHour === 0) return true;

                return h === searchHour;
            }).length;

            return {
                hour: displayHour,
                count
            };
        })
    };

    const maxCount = Math.max(...stats.byHour.map(h => h.count), 1);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <Layout>
            <div className="bg-wood-900 min-h-screen pb-12 relative">
                {/* Toast Notification */}
                {notification && (
                    <div className="fixed top-24 right-4 z-50 bg-gold-500 text-wood-900 px-6 py-3 rounded-md shadow-xl font-bold animate-in slide-in-from-right-10 fade-in duration-300">
                        {notification}
                    </div>
                )}

                <div className="container mx-auto px-4 py-8 space-y-8">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
                        <div>
                            <h1 className="text-3xl font-serif text-cream-100">Vista General</h1>
                            <p className="text-cream-200/60 text-sm">Monitoreo en tiempo real de {restaurants.length} restaurantes.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Restaurant Filter */}
                            {/* Premium Segmented Control / Filter Chips */}
                            <div className="flex bg-wood-800/50 p-1 rounded-full border border-white/5 overflow-x-auto max-w-[600px] scrollbar-hide">
                                <button
                                    onClick={() => setSelectedRestaurant('all')}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                                        selectedRestaurant === 'all'
                                            ? "bg-gold-500 text-wood-900 shadow-lg transform scale-105"
                                            : "text-cream-200/60 hover:text-cream-100 hover:bg-white/5"
                                    )}
                                >
                                    Todos
                                </button>
                                {restaurants.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => setSelectedRestaurant(r.id.toString())}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2",
                                            selectedRestaurant === r.id.toString()
                                                ? "bg-gold-500 text-wood-900 shadow-lg transform scale-105"
                                                : "text-cream-200/60 hover:text-cream-100 hover:bg-white/5"
                                        )}
                                    >
                                        {r.name.replace("Café de Villa", "CDV")} {/* Shorten names for UI */}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 bg-wood-800 p-2 rounded-sm border border-white/5">
                                <Calendar className="h-5 w-5 text-gold-500" />
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="bg-transparent text-cream-100 outline-none text-sm uppercase font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-wood-800/50 border-white/5 hover:border-gold-500/20 transition-colors">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-cream-200/40 uppercase mb-1">Total Reservas</p>
                                    <p className="text-3xl font-bold text-cream-100">{stats.count}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                                    <BarChart3 className="h-6 w-6 text-blue-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-wood-800/50 border-white/5 hover:border-gold-500/20 transition-colors">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-cream-200/40 uppercase mb-1">Comensales</p>
                                    <p className="text-3xl font-bold text-gold-500">{stats.total}</p>
                                </div>
                                <div className="h-12 w-12 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20">
                                    <Users className="h-6 w-6 text-gold-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-wood-800/50 border-white/5 hover:border-gold-500/20 transition-colors">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-cream-200/40 uppercase mb-1">Ingreso Est.</p>
                                    <p className="text-3xl font-bold text-emerald-400">
                                        ${stats.estimatedRevenue.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                    <DollarSign className="h-6 w-6 text-emerald-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-wood-800/50 border-white/5 hover:border-gold-500/20 transition-colors">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-cream-200/40 uppercase mb-1">Ocupación</p>
                                    <p className="text-3xl font-bold text-wine-500">
                                        {Math.round((stats.count / (12 * 10 * 3)) * 100)}%
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-wine-500/10 rounded-full flex items-center justify-center border border-wine-500/20">
                                    <Activity className="h-6 w-6 text-wine-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart & Distro */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Visual Chart */}
                        <Card className="lg:col-span-2 bg-wood-800/30 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-gold-500" /> Actividad por Hora
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 flex items-end gap-2 md:gap-4 pt-4">
                                    {stats.byHour.map((data, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                            <div
                                                className="w-full bg-gold-500/40 rounded-t-sm relative transition-all duration-500 group-hover:bg-gold-500"
                                                style={{ height: `${(data.count / maxCount) * 100}%`, minHeight: '4px' }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-wood-900 text-gold-500 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gold-500/20 z-10">
                                                    {data.count} reservas
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-cream-200/60 font-mono -rotate-45 origin-center translate-y-2">{data.hour}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Distribution */}
                        <Card className="lg:col-span-1 bg-wood-800/30 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-lg">Distribución</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {stats.byRestaurant.map((r, i) => (
                                    <div key={r.name} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-cream-100">{r.name}</span>
                                            <span className="text-gold-500 font-bold">{r.count}</span>
                                        </div>
                                        <div className="h-2 w-full bg-wood-900 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-1000", i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-emerald-500' : 'bg-wine-500')}
                                                style={{ width: `${stats.count > 0 ? (r.count / stats.count) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-cream-200/30 text-right">{r.pax} pax totales</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Reservations Table */}
                    <Card className="bg-wood-800/30 border-white/5 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Reservas Recientes</CardTitle>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => showNotification("Lista exportada a CSV")}>
                                    Exportar
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-cream-200/40 uppercase bg-wood-900/50">
                                        <tr>
                                            <th className="px-6 py-4">Hora</th>
                                            <th className="px-6 py-4">Cliente</th>
                                            <th className="px-6 py-4">Restaurante</th>
                                            <th className="px-6 py-4">Personas</th>
                                            <th className="px-6 py-4">Contacto</th>
                                            <th className="px-6 py-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredReservations.length > 0 ? (
                                            filteredReservations.sort((a, b) => a.time.localeCompare(b.time)).map((reservation) => (
                                                <tr key={reservation.id} className="bg-wood-900/20 hover:bg-wood-800/40 transition-colors group">
                                                    <td className="px-6 py-4 font-mono text-gold-500 font-bold">{reservation.time}</td>
                                                    <td className="px-6 py-4 font-medium text-cream-100">
                                                        {reservation.name}
                                                        <div className="text-[10px] text-cream-200/40 uppercase tracking-wider">{reservation.id.slice(0, 8)}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-cream-200/80">{reservation.restaurantName}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-wood-900 px-2 py-1 rounded text-xs border border-white/5">
                                                            {reservation.pax}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-cream-200/60 font-mono text-xs">{reservation.phone}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => showNotification(`Reserva de ${reservation.name} editada`)}
                                                                className="text-blue-400 hover:text-blue-300"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => showNotification(`Reserva de ${reservation.name} cancelada`)}
                                                                className="text-red-400 hover:text-red-300"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-cream-200/40 italic">
                                                    No hay reservas registradas para esta fecha.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="bg-wood-800/20 border-white/5 border-dashed">
                            <CardHeader>
                                <CardTitle className="text-base text-cream-200/80">Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10" onClick={() => showNotification("Horario 20:00 bloqueado")}>
                                    <Lock className="w-4 h-4 mr-2" /> Bloquear Hora
                                </Button>
                                <Button size="sm" variant="outline" className="border-gold-500/20 text-gold-400 hover:bg-gold-500/10" onClick={() => showNotification("Capacidad aumentada al 100%")}>
                                    <Unlock className="w-4 h-4 mr-2" /> Liberar Mesas
                                </Button>
                                <Button size="sm" variant="primary" onClick={() => showNotification("Nueva reserva manual creada")}>
                                    + Crear Reserva
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Admin;
