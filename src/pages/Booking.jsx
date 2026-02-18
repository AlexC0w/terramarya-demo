import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useReservation } from '../context/ReservationContext';
import { Calendar as CalendarIcon, Clock, Users, User, Phone, Utensils, AlertCircle, CheckCircle2, ChevronLeft, ArrowRight, Minus, Plus, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '../lib/utils';

const getTagColor = (type) => {
    if (type.includes('SportBar')) return 'bg-orange-600';
    if (type.includes('Familiar')) return 'bg-emerald-600';
    if (type.includes('Mariscos')) return 'bg-wine-600';
    return 'bg-wood-600';
};

const Booking = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { restaurants, addReservation, checkAvailability, user } = useReservation();

    // Step 1: Selection, Step 2: Form
    const [step, setStep] = useState(searchParams.get('restaurantId') ? 2 : 1);

    // Initial state logic for user
    const [useProfile, setUseProfile] = useState(!!user);

    const [formData, setFormData] = useState({
        restaurantId: searchParams.get('restaurantId') || '',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        pax: 2, // Changed to number for counter
        name: user && useProfile ? user.name : '',
        phone: user && useProfile ? '6275551234' : '' // Mock phone for logged in user
    });

    // Update form data when useProfile toggles
    useEffect(() => {
        if (user) {
            if (useProfile) {
                setFormData(prev => ({
                    ...prev,
                    name: user.name,
                    phone: '6275551234'
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    name: '',
                    phone: ''
                }));
            }
        }
    }, [useProfile, user]);

    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const selectedRestaurant = restaurants.find(r => r.id.toString() === formData.restaurantId);

    const handleRestaurantSelect = (id) => {
        setFormData(prev => ({ ...prev, restaurantId: id.toString() }));
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setStep(1);
        setStatus('idle');
    };

    // Scroll to top on mount, step change, or success status
    useEffect(() => {
        if (status === 'checking') return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step, status]);

    const handlePaxChange = (increment) => {
        setFormData(prev => {
            const newPax = parseInt(prev.pax) + increment;
            if (newPax < 1 || newPax > 20) return prev;
            return { ...prev, pax: newPax };
        });
    };

    // Calendar Helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const handleMonthChange = (increment) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
    };

    const isDateDisabled = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDateSelected = (day) => {
        const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
        return formData.date === dateStr;
    };

    const selectDate = (day) => {
        if (isDateDisabled(day)) return;
        // Adjust for timezone offset to ensure correct YYYY-MM-DD
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        const dateStr = adjustedDate.toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, date: dateStr }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('checking');

        setTimeout(() => {
            try {
                const available = checkAvailability(
                    parseInt(formData.restaurantId),
                    formData.date,
                    formData.time
                );

                if (!available) {
                    setStatus('error');
                    setErrorMessage('Lo sentimos, este horario está completo. Por favor intenta otra hora.');
                    return;
                }

                addReservation({
                    restaurantId: parseInt(formData.restaurantId),
                    restaurantName: selectedRestaurant.name,
                    ...formData,
                    pax: formData.pax.toString() // Ensure string for consistency if needed, though mostly used as generic data
                });

                setStatus('success');
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.message);
            }
        }, 1500);
    };

    if (status === 'success') {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                    <Card className="max-w-md w-full bg-wood-900 border-gold-500/30 animate-in fade-in zoom-in duration-500 shadow-2xl shadow-gold-900/20">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-gold-500/30">
                                <CheckCircle2 className="h-10 w-10 text-wood-900" />
                            </div>
                            <CardTitle className="text-3xl font-serif text-gold-400">¡Reserva Confirmada!</CardTitle>
                            <CardDescription className="text-lg">Te esperamos en <span className="text-cream-100 font-medium">{selectedRestaurant?.name}</span></CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 text-center px-8 pb-10">
                            <p className="text-cream-200/80 leading-relaxed">
                                Hemos enviado los detalles a tu teléfono. Gracias por elegir Terramarya.
                            </p>

                            <div className="bg-wine-900/30 p-6 rounded-sm border border-wine-500/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                <h4 className="text-gold-400 font-serif text-xl mb-1">¡Felicidades!</h4>
                                <p className="text-cream-100/90 text-sm uppercase tracking-wide">Has ganado</p>
                                <p className="text-gold-500 font-bold text-3xl mt-2 drop-shadow-sm">150 Happy Points</p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button onClick={() => navigate('/')} variant="ghost" className="flex-1">Inicio</Button>
                                <Button onClick={() => navigate('/puntos')} variant="primary" className="flex-1 bg-gold-600 hover:bg-gold-500 text-wood-900 border-none font-bold">Ver Puntos</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        );
    }

    const { days, firstDay } = getDaysInMonth(currentMonth);
    const timeSlots = Array.from({ length: 10 }).map((_, i) => `${13 + i}:00`);

    return (
        <Layout>
            <div className="min-h-screen bg-wood-900 relative pb-20">
                <div className="absolute inset-0 bg-wood-pattern opacity-5 pointer-events-none" />

                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="text-center mb-8 space-y-2">
                        <h1 className="text-4xl md:text-5xl font-serif text-gold-400 drop-shadow-lg">
                            {step === 1 ? 'Elige tu Experiencia' : 'Completa tu Reserva'}
                        </h1>
                        <div className="flex justify-center gap-2 mt-4">
                            <div className={`h-1.5 w-12 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-gold-500' : 'bg-wood-700'}`} />
                            <div className={`h-1.5 w-12 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-gold-500' : 'bg-wood-700'}`} />
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                                {restaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.id}
                                        onClick={() => handleRestaurantSelect(restaurant.id)}
                                        className="group relative bg-wood-800/40 border border-white/5 rounded-sm overflow-hidden hover:bg-wood-800/60 transition-all cursor-pointer shadow-lg hover:shadow-gold-500/5 hover:-translate-y-1"
                                    >
                                        <div className="flex flex-col md:flex-row h-auto md:h-64">
                                            {/* Image Section - Stacked on mobile, Side on desktop */}
                                            <div className="relative w-full md:w-2/5 h-48 md:h-auto shrink-0 overflow-hidden">
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070";
                                                    }}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                                <div className="absolute top-2 left-2 flex flex-col gap-2">
                                                    <span className={`text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm w-fit ${getTagColor(restaurant.type)}`}>
                                                        {restaurant.type}
                                                    </span>
                                                </div>

                                            </div>

                                            {/* Content Section */}
                                            <div className="p-4 flex flex-col justify-between grow">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-xl md:text-2xl font-serif text-cream-100 group-hover:text-gold-400 transition-colors line-clamp-1">{restaurant.name}</h3>
                                                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gold-500/50 group-hover:text-gold-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                                                    </div>

                                                    {/* Menu Highlights - Compact */}
                                                    <div className="mt-4 text-sm text-cream-200/60 leading-relaxed">
                                                        <span className="text-gold-500/80 font-bold text-[10px] uppercase tracking-wider mr-2 block mb-1">Especialidad:</span>
                                                        <ul className="list-disc pl-4 space-y-1">
                                                            {restaurant.menu?.slice(0, 2).map((item, i) => (
                                                                <li key={i}>
                                                                    {item.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Availability Badge - Moved here */}
                                                    <div className="mt-4 flex justify-start">
                                                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm flex items-center gap-1.5 w-fit">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            Lugares Disponibles
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in slide-in-from-right-8 duration-500">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="mb-6 pl-0 hover:bg-transparent text-cream-200/60 hover:text-gold-400 group"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Volver a selección
                                </Button>

                                <Card className="bg-wood-800/60 border-white/5 backdrop-blur-xl shadow-2xl">
                                    <CardHeader className="border-b border-white/5 pb-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <img
                                                src={selectedRestaurant?.image}
                                                alt="Selected"
                                                className="w-16 h-16 rounded-sm object-cover border border-gold-500/20 shadow-md"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070";
                                                }}
                                            />
                                            <div>
                                                <CardDescription className="text-xs uppercase tracking-widest text-gold-500 font-bold mb-1">Reservando en</CardDescription>
                                                <CardTitle className="text-2xl font-serif text-cream-100">{selectedRestaurant?.name}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 md:p-8">
                                        <form onSubmit={handleSubmit} className="space-y-10">

                                            {/* Custom Pax Counter */}
                                            <div className="space-y-4">
                                                <label className="text-xs uppercase tracking-widest text-gold-500/80 font-bold flex items-center gap-2">
                                                    <Users className="w-4 h-4" /> Cantidad de Personas
                                                </label>
                                                <div className="flex items-center justify-between bg-wood-800/50 rounded-sm border border-white/10 p-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePaxChange(-1)}
                                                        className="w-12 h-12 flex items-center justify-center rounded-sm bg-wood-700 hover:bg-wood-600 text-gold-500 border border-white/5 transition-colors"
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </button>
                                                    <div className="text-center">
                                                        <span className="text-3xl font-serif text-cream-100 block">{formData.pax}</span>
                                                        <span className="text-[10px] uppercase text-cream-200/40">Invitados</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePaxChange(1)}
                                                        className="w-12 h-12 flex items-center justify-center rounded-sm bg-wood-700 hover:bg-wood-600 text-gold-500 border border-white/5 transition-colors"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Custom Calendar */}
                                            <div className="space-y-4">
                                                <label className="text-xs uppercase tracking-widest text-gold-500/80 font-bold flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4" /> Selecciona una Fecha
                                                </label>
                                                <div className="bg-wood-800/50 rounded-sm border border-white/10 p-4">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <button type="button" className="h-8 w-8 flex items-center justify-center text-cream-200 hover:text-gold-400 transition-colors" onClick={() => handleMonthChange(-1)}>
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <span className="text-cream-100 font-serif text-lg">
                                                            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                                                        </span>
                                                        <button type="button" className="h-8 w-8 flex items-center justify-center text-cream-200 hover:text-gold-400 transition-colors" onClick={() => handleMonthChange(1)}>
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                                                            <div key={d} className="text-[10px] text-cream-200/40 font-bold">{d}</div>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                                                        {Array.from({ length: days }).map((_, i) => {
                                                            const day = i + 1;
                                                            const isDisabled = isDateDisabled(day);
                                                            const isSelected = isDateSelected(day);
                                                            return (
                                                                <button
                                                                    key={day}
                                                                    type="button"
                                                                    disabled={isDisabled}
                                                                    onClick={() => selectDate(day)}
                                                                    className={cn(
                                                                        "h-10 w-full rounded-sm flex items-center justify-center text-sm font-medium transition-all relative overflow-hidden",
                                                                        isSelected
                                                                            ? "bg-gold-500 text-wood-900 font-bold shadow-lg shadow-gold-500/20"
                                                                            : "bg-wood-700/30 text-cream-100 hover:bg-wood-700/80 hover:text-gold-400",
                                                                        isDisabled && "opacity-20 cursor-not-allowed bg-transparent hover:bg-transparent hover:text-cream-100"
                                                                    )}
                                                                >
                                                                    {day}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Custom Time Grid */}
                                            <div className="space-y-4">
                                                <label className="text-xs uppercase tracking-widest text-gold-500/80 font-bold flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> Horarios Disponibles
                                                </label>
                                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                                    {timeSlots.map((time) => {
                                                        const isAvailable = checkAvailability(parseInt(formData.restaurantId), formData.date, time);
                                                        const isSelected = formData.time === time;
                                                        return (
                                                            <button
                                                                key={time}
                                                                type="button"
                                                                disabled={!isAvailable}
                                                                onClick={() => setFormData({ ...formData, time })}
                                                                className={cn(
                                                                    "py-2 px-1 rounded-sm text-sm font-medium border transition-all",
                                                                    isSelected
                                                                        ? "bg-gold-500 border-gold-500 text-wood-900 shadow-lg"
                                                                        : "bg-wood-800/50 border-white/10 text-cream-100 hover:border-gold-500/50 hover:text-gold-400",
                                                                    !isAvailable && "opacity-30 cursor-not-allowed decoration-slice line-through bg-wood-900"
                                                                )}
                                                            >
                                                                {time}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-6 border-t border-white/5">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-xs uppercase tracking-widest text-gold-500/80 font-bold">Datos de Contacto</label>
                                                    {user && (
                                                        <div
                                                            onClick={() => setUseProfile(!useProfile)}
                                                            className="flex items-center gap-2 cursor-pointer group"
                                                        >
                                                            <span className={cn("text-xs font-bold uppercase transition-colors", useProfile ? "text-gold-500" : "text-cream-200/40 group-hover:text-cream-100")}>
                                                                {useProfile ? `Usar perfil de ${user.name}` : "Usar mi perfil"}
                                                            </span>
                                                            {useProfile
                                                                ? <ToggleRight className="text-gold-500 w-5 h-5" />
                                                                : <ToggleLeft className="text-cream-200/40 w-5 h-5 group-hover:text-cream-100" />
                                                            }
                                                        </div>
                                                    )}
                                                </div>

                                                {useProfile && user ? (
                                                    <div className="bg-wood-800/30 border border-gold-500/20 rounded-sm p-4 flex items-center justify-between  animate-in fade-in slide-in-from-top-1">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20">
                                                                <User className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-cream-100 font-medium leading-tight">{formData.name}</p>
                                                                <p className="text-cream-200/50 text-xs">{formData.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-green-500">
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                                                        <Input
                                                            icon={User}
                                                            type="text"
                                                            placeholder="Nombre Completo"
                                                            required
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="bg-wood-800/50 border-white/10 text-cream-100 placeholder:text-cream-200/30"
                                                        />
                                                        <Input
                                                            icon={Phone}
                                                            type="tel"
                                                            placeholder="Teléfono (10 dígitos)"
                                                            required
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            className="bg-wood-800/50 border-white/10 text-cream-100 placeholder:text-cream-200/30"
                                                        />
                                                    </div>
                                                )}

                                            </div>

                                            {status === 'error' && (
                                                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-sm flex items-start gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
                                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                                    <p className="text-sm font-medium">{errorMessage}</p>
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                className="w-full text-lg h-14 bg-gradient-to-r from-wine-600 to-wine-500 hover:from-wine-500 hover:to-wine-400 shadow-xl shadow-wine-900/20 border border-white/10 relative overflow-hidden group"
                                                size="lg"
                                                isLoading={status === 'checking'}
                                                disabled={status === 'checking'}
                                            >
                                                <span className="relative z-10">Confirmar Reserva</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                            </Button>

                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Booking;
