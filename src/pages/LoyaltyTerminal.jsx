import React, { useState } from 'react';
import { Camera, Search, UserPlus, CheckCircle2, ChevronRight, Store, ArrowLeft, CreditCard, Smartphone, Edit2, KeyRound, QrCode } from 'lucide-react';

// We reuse standard Input/Button but override classes if needed for the specific light theme
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const MOCK_CLIENTS = [
    { id: '1', phone: '1234567890', name: 'Juan Pérez', cardId: 'CARD-001', points: 150 },
    { id: '2', phone: '0987654321', name: 'María García', cardId: '', points: 45 },
    { id: '3', phone: '6271310248', name: 'Alejandro Baca', cardId: '', points: 100 },
];

const LOCATIONS = [
    "Café Drive Thru",
    "Restaurante Centro",
    "Restaurante Norte"
];

const STEPS = {
    CONFIG: 'CONFIG',
    IDENTIFY: 'IDENTIFY',
    PURCHASE: 'PURCHASE',
    SUCCESS: 'SUCCESS'
};

const LoyaltyTerminal = () => {
    const getInitialLocation = () => localStorage.getItem('terramarya_terminal_location') || '';

    const [savedLocation, setSavedLocation] = useState(getInitialLocation());
    const [currentStep, setCurrentStep] = useState(() => {
        const storedLoc = getInitialLocation();
        if (storedLoc && LOCATIONS.includes(storedLoc)) {
            return STEPS.IDENTIFY;
        }
        return STEPS.CONFIG;
    });

    const [totalAmount, setTotalAmount] = useState('');
    const [ticketId, setTicketId] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [client, setClient] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const [showRegistration, setShowRegistration] = useState(false);
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regCardId, setRegCardId] = useState('');
    const [earnedPoints, setEarnedPoints] = useState(0);

    const handleSaveLocation = (loc) => {
        localStorage.setItem('terramarya_terminal_location', loc);
        setSavedLocation(loc);
        setCurrentStep(STEPS.IDENTIFY);
    };

    const handleChangeLocation = () => {
        setCurrentStep(STEPS.CONFIG);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        setClient(null);
        setShowRegistration(false);

        setTimeout(() => {
            const foundClient = MOCK_CLIENTS.find(
                c => c.phone === searchQuery || c.cardId === searchQuery
            );

            if (foundClient) {
                setClient(foundClient);
                setCurrentStep(STEPS.PURCHASE);
            } else {
                if (/^\d+$/.test(searchQuery)) {
                    setRegPhone(searchQuery);
                    setRegCardId('');
                } else {
                    setRegCardId(searchQuery);
                    setRegPhone('');
                }
                setShowRegistration(true);
            }
            setIsSearching(false);
        }, 600);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!regName || (!regPhone && !regCardId)) return;

        const newClient = {
            id: Date.now().toString(),
            name: regName,
            phone: regPhone,
            cardId: regCardId,
            points: 0
        };
        MOCK_CLIENTS.push(newClient);
        setClient(newClient);
        setShowRegistration(false);
        setCurrentStep(STEPS.PURCHASE);
    };

    const handleProcessSale = (e) => {
        e.preventDefault();
        if (!totalAmount || !ticketId || !client) return;

        const pts = Math.floor(parseFloat(totalAmount) * 0.1);
        setClient({ ...client, points: client.points + pts });
        setEarnedPoints(pts);

        setCurrentStep(STEPS.SUCCESS);
    };

    const handleNextCustomer = () => {
        setTotalAmount('');
        setTicketId('');
        setSearchQuery('');
        setClient(null);
        setEarnedPoints(0);
        setShowRegistration(false);
        setRegName('');
        setRegPhone('');
        setRegCardId('');
        setCurrentStep(STEPS.IDENTIFY);
    };

    const goBackToIdentify = () => {
        setCurrentStep(STEPS.IDENTIFY);
        setClient(null);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] w-full bg-cream-50 flex flex-col items-center justify-center p-4">

            {/* Main Terminal Container */}
            <div className="w-full max-w-md flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">

                {/* Persistent Config Header */}
                {currentStep !== STEPS.CONFIG && (
                    <div className="w-full bg-white border border-wood-900/10 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cream-50 rounded-full text-wood-600">
                                <Store className="w-5 h-5" />
                            </div>
                            <span className="font-serif text-lg text-wood-900 truncate tracking-wide">{savedLocation}</span>
                        </div>
                        <button
                            onClick={handleChangeLocation}
                            className="text-xs font-medium text-wood-500 hover:text-wood-900 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-cream-50"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Cambiar
                        </button>
                    </div>
                )}

                {/* Main Card View */}
                <div className="w-full bg-white shadow-2xl shadow-wood-900/5 rounded-[2rem] border border-wood-900/5 overflow-hidden flex flex-col relative min-h-[460px]">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-wood-100 rounded-full blur-[80px] pointer-events-none opacity-50" />

                    {/* CONFIGURATION STEP */}
                    {currentStep === STEPS.CONFIG && (
                        <div className="p-8 md:p-10 flex flex-col h-full justify-center">
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-cream-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-wood-900/5 shadow-inner">
                                    <Store className="w-10 h-10 text-wood-800" />
                                </div>
                                <h2 className="text-3xl font-serif text-wood-900 mb-2">Punto de Venta</h2>
                                <p className="text-wood-500">Selecciona la sucursal actual para iniciar.</p>
                            </div>

                            <div className="space-y-4">
                                {LOCATIONS.map(loc => (
                                    <button
                                        key={loc}
                                        onClick={() => handleSaveLocation(loc)}
                                        className="w-full p-5 bg-white hover:bg-cream-50 border-2 border-cream-100 hover:border-wood-300 rounded-2xl flex items-center justify-between group transition-all text-left shadow-sm hover:shadow-md"
                                    >
                                        <span className="text-wood-900 text-lg font-medium group-hover:text-wood-950">{loc}</span>
                                        <ChevronRight className="w-6 h-6 text-wood-300 group-hover:text-wood-900 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 1: IDENTIFY CLIENT */}
                    {currentStep === STEPS.IDENTIFY && (
                        <div className="p-8 md:p-10 flex flex-col flex-1">
                            <div className="mb-8">
                                <h2 className="text-3xl font-serif text-wood-900 mb-2">Identificar Cliente</h2>
                                <p className="text-wood-500 leading-relaxed">Busca por número de celular o código de tarjeta para otorgar puntos.</p>
                            </div>

                            {!showRegistration ? (
                                <form onSubmit={handleSearch} className="flex flex-col flex-1">
                                    <div className="space-y-4 flex-1">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-wood-900 text-wood-400 transition-colors">
                                                <Search className="h-6 w-6" />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full bg-cream-50 border-2 border-transparent outline-none ring-1 ring-wood-900/10 focus:ring-2 focus:ring-wood-900 rounded-2xl pl-14 pr-16 py-5 text-wood-900 placeholder:text-wood-400 focus:bg-white transition-all text-xl font-medium shadow-inner"
                                                placeholder="Teléfono o ID..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
                                                <button
                                                    type="button"
                                                    className="p-2 text-wood-500 hover:text-wood-900 bg-white hover:bg-cream-100 rounded-xl transition-all focus:ring-2 focus:ring-wood-900/20 outline-none shadow-sm border border-wood-900/10 pointer-events-auto"
                                                    title="Escanear Código QR"
                                                    onClick={() => alert("Simulando cámara para escanear QR...")}
                                                >
                                                    <QrCode className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-center gap-12 text-wood-400 mb-10">
                                        <div className="flex flex-col items-center gap-3">
                                            <Smartphone className="w-8 h-8 opacity-80" />
                                            <span className="text-xs font-medium uppercase tracking-wider">Celular</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            <CreditCard className="w-8 h-8 opacity-80" />
                                            <span className="text-xs font-medium uppercase tracking-wider">Tarjeta</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-auto w-full py-5 text-lg font-bold uppercase tracking-widest rounded-2xl bg-wood-900 text-white hover:bg-wood-800 focus:ring-4 focus:ring-wood-900/20 active:scale-[0.98] transition-all shadow-xl shadow-wood-900/20 disabled:opacity-50 disabled:pointer-events-none"
                                        disabled={isSearching || !searchQuery.trim()}
                                    >
                                        {isSearching ? 'Buscando...' : 'Buscar Cliente'}
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-cream-50 border border-wood-900/5 rounded-2xl p-5 mb-8 text-center shadow-sm">
                                        <UserPlus className="w-8 h-8 text-wood-800 mx-auto mb-3" />
                                        <p className="font-serif text-xl text-wood-900 mb-1">Cliente Nuevo</p>
                                        <p className="text-sm text-wood-600">Completa el registro para empezar a sumar puntos en esta compra.</p>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-5 flex-1 flex flex-col">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-wood-500 mb-2 ml-1">Nombre Completo</label>
                                                <input
                                                    className="w-full px-5 py-4 bg-white border outline-none ring-1 ring-wood-900/10 focus:ring-2 focus:ring-wood-900 rounded-xl text-wood-900 transition-all font-medium"
                                                    placeholder="Ej. Juan Pérez"
                                                    value={regName}
                                                    onChange={(e) => setRegName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-wood-500 mb-2 ml-1">Teléfono</label>
                                                    <input
                                                        className="w-full px-5 py-4 bg-white border outline-none ring-1 ring-wood-900/10 focus:ring-2 focus:ring-wood-900 rounded-xl text-wood-900 transition-all font-medium"
                                                        type="tel"
                                                        placeholder="10 dígitos"
                                                        value={regPhone}
                                                        onChange={(e) => setRegPhone(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-wood-500 mb-2 ml-1">Tarjeta (Opc.)</label>
                                                    <input
                                                        className="w-full px-5 py-4 bg-white border outline-none ring-1 ring-wood-900/10 focus:ring-2 focus:ring-wood-900 rounded-xl text-wood-900 transition-all font-medium"
                                                        placeholder="Membresía"
                                                        value={regCardId}
                                                        onChange={(e) => setRegCardId(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <label className="flex items-start gap-3 p-3 rounded-xl border border-wood-900/10 bg-white cursor-pointer hover:bg-cream-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="mt-1 w-5 h-5 rounded border-wood-300 text-wood-900 focus:ring-wood-900 flex-shrink-0"
                                                        defaultChecked
                                                    />
                                                    <span className="text-sm font-medium text-wood-600 leading-snug">
                                                        ¿Le gustaría recibir mensajes con promociones y descuentos exclusivos a su WhatsApp?
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-8 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => { setShowRegistration(false); setSearchQuery(''); }}
                                                className="flex-1 py-4 px-2 text-sm font-bold uppercase tracking-widest rounded-2xl bg-cream-50 text-wood-900 hover:bg-cream-100 transition-all border border-wood-900/10"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-[2] py-4 px-2 text-sm font-bold uppercase tracking-widest rounded-2xl bg-wood-900 text-white hover:bg-wood-800 shadow-lg shadow-wood-900/20 transition-all"
                                            >
                                                Registrar y Seguir
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: PURCHASE DETAILS */}
                    {currentStep === STEPS.PURCHASE && client && (
                        <div className="p-8 md:p-10 flex flex-col flex-1 h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <button
                                    onClick={goBackToIdentify}
                                    className="p-2 -ml-2 text-wood-400 hover:text-wood-900 transition-colors rounded-full hover:bg-cream-50"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <h2 className="text-3xl font-serif text-wood-900">Registrar Venta</h2>
                            </div>

                            {/* Client Summary */}
                            <div className="bg-wood-900 rounded-[1.5rem] p-6 mb-8 flex justify-between items-center shadow-lg shadow-wood-900/10 relative overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gold-400/20 rounded-full blur-2xl" />

                                <div className="relative z-10">
                                    <h3 className="text-lg font-serif tracking-wide text-cream-50 mb-1">{client.name}</h3>
                                    <p className="text-sm text-wood-300 flex items-center gap-1.5 font-medium">
                                        <Smartphone className="w-4 h-4" /> {client.phone}
                                    </p>
                                </div>
                                <div className="text-right relative z-10 flex flex-col items-end">
                                    <span className="text-3xl font-serif text-gold-400 leading-none mb-1">{client.points}</span>
                                    <span className="text-[10px] text-wood-400 uppercase tracking-widest font-bold">Pts Actuales</span>
                                </div>
                            </div>

                            <form onSubmit={handleProcessSale} className="flex flex-col flex-1 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-wood-500 mb-2 ml-1">Total de la Compra</label>
                                        <div className="relative focus-within:text-wood-900 text-wood-400 transition-colors">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-serif">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full bg-cream-50 hover:bg-white border outline-none ring-1 ring-wood-900/10 focus:ring-2 focus:ring-wood-900 rounded-2xl pl-12 pr-6 py-5 text-wood-900 placeholder:text-wood-300 transition-all text-3xl font-serif shadow-inner"
                                                placeholder="0.00"
                                                value={totalAmount}
                                                onChange={(e) => setTotalAmount(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-wood-500 mb-2 ml-1">Número de Ticket</label>
                                        <div className="relative focus-within:text-wood-900 text-wood-400 transition-colors">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2">
                                                <KeyRound className="w-5 h-5" />
                                            </span>
                                            <input
                                                type="text"
                                                className="w-full bg-white border outline-none ring-1 ring-wood-900/10 focus:ring-2 focus:ring-wood-900 rounded-2xl pl-14 pr-6 py-4 text-wood-900 placeholder:text-wood-300 transition-all font-mono text-lg"
                                                placeholder="Ej. TCK-98765"
                                                value={ticketId}
                                                onChange={(e) => setTicketId(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-wood-900/15 text-wood-500 font-medium hover:text-wood-900 hover:border-wood-900/30 hover:bg-cream-50 transition-colors"
                                >
                                    <Camera className="w-5 h-5" />
                                    Subir Foto (Opcional)
                                </button>

                                <button
                                    type="submit"
                                    className="mt-auto w-full py-5 text-lg font-bold uppercase tracking-widest rounded-2xl bg-wood-900 text-white hover:bg-wood-800 focus:ring-4 focus:ring-wood-900/20 active:scale-[0.98] transition-all shadow-xl shadow-wood-900/20"
                                >
                                    Otorgar Puntos
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {currentStep === STEPS.SUCCESS && client && (
                        <div className="p-8 md:p-10 text-center animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center flex-1">

                            <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
                                <CheckCircle2 className="w-14 h-14 text-green-600 relative z-10" />
                            </div>

                            <h2 className="text-4xl font-serif text-wood-900 mb-3">¡Venta Exitosa!</h2>
                            <p className="text-wood-600 mb-10 max-w-[280px] mx-auto text-lg">
                                Registro de <strong className="text-wood-900 font-bold">${parseFloat(totalAmount).toFixed(2)}</strong> procesado.
                            </p>

                            <div className="w-full bg-cream-50 border border-wood-900/10 rounded-[1.5rem] p-8 mb-10 shadow-inner">
                                <p className="text-xs font-bold text-wood-500 uppercase tracking-widest mb-3">Puntos Sumados</p>
                                <div className="text-6xl font-serif text-wood-900 mb-4">+{earnedPoints}</div>
                                <p className="text-sm text-wood-600 font-medium">El nuevo saldo de {client.name} es <strong className="text-gold-600 text-base">{client.points} pts</strong></p>
                            </div>

                            <button
                                onClick={handleNextCustomer}
                                className="w-full py-5 text-lg font-bold uppercase tracking-widest rounded-2xl bg-wood-900 text-white hover:bg-wood-800 focus:ring-4 focus:ring-wood-900/20 active:scale-[0.98] transition-all shadow-xl shadow-wood-900/20"
                            >
                                Siguiente Cliente
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoyaltyTerminal;
