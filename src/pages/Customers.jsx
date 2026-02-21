import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, MessageCircleHeart, CheckCircle2, TrendingUp, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import CampaignModal from '../components/crm/CampaignModal';

const BRANCHES = ['Terramarya', 'Café de Villa (SportBar)', 'Café de Villa (Restaurant)'];
const LEVELS = ['Explorador', 'Gourmet', 'Elite'];

// Generate 45 Mock Clients
const MOCK_CUSTOMERS = Array.from({ length: 45 }).map((_, i) => {
    const isElite = Math.random() > 0.8;
    const isOptIn = Math.random() > 0.2; // 80% opt-in
    const lastPurchaseDays = Math.floor(Math.random() * 60);
    return {
        id: `CUST-${i + 1000}`,
        name: `Cliente de Prueba ${i + 1}`,
        phone: `627${Math.floor(1000000 + Math.random() * 9000000)}`,
        branch: BRANCHES[Math.floor(Math.random() * BRANCHES.length)],
        level: isElite ? 'Elite' : (Math.random() > 0.5 ? 'Gourmet' : 'Explorador'),
        points: Math.floor(Math.random() * 5000) + 100,
        optIn: isOptIn,
        lastPurchase: `${lastPurchaseDays} días`,
        lastPurchaseDays: lastPurchaseDays
    };
});

const Customers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBranch, setFilterBranch] = useState('All');
    const [filterLevel, setFilterLevel] = useState('All');
    const [filterOptInOnly, setFilterOptInOnly] = useState(false);

    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

    const filteredCustomers = useMemo(() => {
        return MOCK_CUSTOMERS.filter(c => {
            const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
            const matchBranch = filterBranch === 'All' || c.branch === filterBranch;
            const matchLevel = filterLevel === 'All' || c.level === filterLevel;
            const matchOptIn = !filterOptInOnly || c.optIn;

            return matchSearch && matchBranch && matchLevel && matchOptIn;
        });
    }, [searchTerm, filterBranch, filterLevel, filterOptInOnly]);

    // KPIs
    const totalClients = MOCK_CUSTOMERS.length;
    const optInClients = MOCK_CUSTOMERS.filter(c => c.optIn).length;
    const inactiveClients = MOCK_CUSTOMERS.filter(c => c.lastPurchaseDays > 30).length;
    const eliteClients = MOCK_CUSTOMERS.filter(c => c.level === 'Elite').length;

    return (
        <div className="min-h-screen bg-wood-900 flex flex-col pt-8 pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 animate-in fade-in duration-500">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-serif text-cream-50 mb-2">Clientes</h1>
                        <p className="text-wood-300">Gestión de lealtad y campañas para Terramarya y Café de Villa.</p>
                    </div>
                    <Button
                        onClick={() => setIsCampaignModalOpen(true)}
                        className="bg-gold-500 text-wood-950 hover:bg-gold-400 font-bold tracking-widest px-8 shadow-lg shadow-gold-500/20"
                    >
                        <MessageCircleHeart className="w-5 h-5 mr-2" />
                        Enviar Publicidad
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-wood-800 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-wood-400 mb-2">
                            <Users className="w-5 h-5" />
                            <span className="uppercase text-xs font-bold tracking-widest">Total Clientes</span>
                        </div>
                        <span className="text-3xl font-serif text-cream-50">{totalClients}</span>
                    </div>
                    <div className="bg-wood-800 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-green-400/80 mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="uppercase text-xs font-bold tracking-widest">Autorizados</span>
                        </div>
                        <span className="text-3xl font-serif text-green-400">{optInClients}</span>
                    </div>
                    <div className="bg-wood-800 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-red-400/80 mb-2">
                            <TrendingUp className="w-5 h-5 rotate-180" />
                            <span className="uppercase text-xs font-bold tracking-widest">Inactivos (30d)</span>
                        </div>
                        <span className="text-3xl font-serif text-red-400">{inactiveClients}</span>
                    </div>
                    <div className="bg-wood-800 border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-gold-500/10 rounded-full blur-xl pointer-events-none" />
                        <div className="flex items-center gap-3 text-gold-400 mb-2 relative z-10">
                            <Users className="w-5 h-5" />
                            <span className="uppercase text-xs font-bold tracking-widest">Nivel Elite</span>
                        </div>
                        <span className="text-3xl font-serif text-gold-400 relative z-10">{eliteClients}</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-wood-800/50 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-wood-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-cream-100 placeholder:text-wood-500 focus:ring-2 focus:ring-gold-500 transition-all outline-none"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={filterBranch}
                            onChange={(e) => setFilterBranch(e.target.value)}
                            className="bg-wood-900 border border-white/10 rounded-xl px-4 py-3 text-cream-100 focus:ring-2 focus:ring-gold-500 outline-none min-w-[160px]"
                        >
                            <option value="All">Todas las sucursales</option>
                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="bg-wood-900 border border-white/10 rounded-xl px-4 py-3 text-cream-100 focus:ring-2 focus:ring-gold-500 outline-none min-w-[140px]"
                        >
                            <option value="All">Todos los niveles</option>
                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <button
                            onClick={() => setFilterOptInOnly(!filterOptInOnly)}
                            className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors ${filterOptInOnly ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-wood-900 border-white/10 text-wood-400 hover:text-cream-100'}`}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium text-sm">Solo Autorizados</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-wood-800 border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-wood-900/50 border-b border-white/10">
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-wood-400">Nombre</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-wood-400">Teléfono</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-wood-400">Sucursal (Última)</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-wood-400">Happy Points</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-wood-400">Nivel</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-wood-400">Última Compra</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-wood-400 text-center">WhatsApp Autorizado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-cream-50 font-medium">{customer.name}</td>
                                            <td className="p-4 text-wood-300 font-mono text-sm">{customer.phone}</td>
                                            <td className="p-4 text-wood-300 text-sm">{customer.branch}</td>
                                            <td className="p-4 font-serif text-lg text-gold-400">{customer.points}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-wood-900 border ${customer.level === 'Elite' ? 'border-gold-500/50 text-gold-400' :
                                                    customer.level === 'Gourmet' ? 'border-wine-500/50 text-wine-400' :
                                                        'border-white/10 text-wood-400'
                                                    }`}>
                                                    {customer.level}
                                                </span>
                                            </td>
                                            <td className="p-4 text-wood-300 text-sm">Hace {customer.lastPurchase}</td>
                                            <td className="p-4 text-center">
                                                {customer.optIn ? (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400">
                                                        <X className="w-4 h-4" />
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-wood-500">No se encontraron clientes con esos filtros.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isCampaignModalOpen && (
                <CampaignModal
                    isOpen={isCampaignModalOpen}
                    onClose={() => setIsCampaignModalOpen(false)}
                    allCustomers={MOCK_CUSTOMERS}
                />
            )}
        </div>
    );
};

export default Customers;
