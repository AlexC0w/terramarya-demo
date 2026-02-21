import React, { useState, useEffect } from 'react';
import { X, MessageCircleHeart, Users, CheckCircle2, AlertTriangle, Send, Loader2, Store } from 'lucide-react';
import { Button } from '../ui/Button';

const STEP_MESSAGE = 1;
const STEP_RECIPIENTS = 2;
const STEP_SIMULATION = 3;

const CampaignModal = ({ isOpen, onClose, allCustomers }) => {
    const [step, setStep] = useState(STEP_MESSAGE);

    // Step 1 State
    const [campaignName, setCampaignName] = useState('');
    const [messageType, setMessageType] = useState('template');
    const [messageText, setMessageText] = useState('');
    const [ctaLink, setCtaLink] = useState('');

    // Step 2 State
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    // Filtered eligible recipients (only opt-in)
    const eligibleRecipients = allCustomers.filter(c => c.optIn);

    // For this simple MVP, we auto-select the eligible ones based on the filter in Step 2.
    const selectedRecipients = eligibleRecipients.filter(c => {
        const matchBranch = selectedBranch === 'All' || c.branch === selectedBranch;
        const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
        return matchBranch && matchLevel;
    });

    // Step 3 (Simulation) State
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationComplete, setSimulationComplete] = useState(false);
    const [progress, setProgress] = useState(0);

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setStep(STEP_MESSAGE);
            setCampaignName('');
            setMessageText('');
            setSimulationComplete(false);
            setProgress(0);
            setIsSimulating(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const startSimulation = () => {
        if (selectedRecipients.length === 0) return;
        setIsSimulating(true);
        setSimulationComplete(false);
        setProgress(0);

        // Very basic simple simulation: 3 seconds loading bar.
        const totalDuration = 3000;
        const interval = 100; // update every 100ms
        const steps = totalDuration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setProgress((currentStep / steps) * 100);
            if (currentStep >= steps) {
                clearInterval(timer);
                setIsSimulating(false);
                setSimulationComplete(true);
                setProgress(100);
            }
        }, interval);
    };

    const insertVar = (variable) => {
        setMessageText(prev => prev + `{${variable}} `);
    };

    const isStep1Valid = campaignName.trim() !== '' && messageText.trim() !== '';
    const isStep2Valid = selectedRecipients.length > 0;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-wood-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-wood-800 w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-wood-900/50">
                    <div>
                        <h2 className="text-2xl font-serif text-cream-50 flex items-center gap-3">
                            <MessageCircleHeart className="w-6 h-6 text-gold-500" />
                            Nueva Campaña WhatsApp
                        </h2>
                        <p className="text-sm text-wood-400 mt-1">Envía promociones y noticias a tus clientes autorizados.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-wood-400 hover:text-cream-50 hover:bg-white/5 rounded-full transition-colors"
                        disabled={isSimulating}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Stepper Indicators */}
                <div className="flex items-center px-8 flex-shrink-0 bg-wood-900/20 border-b border-white/5">
                    {[
                        { num: 1, label: 'Mensaje' },
                        { num: 2, label: 'Destinatarios' },
                        { num: 3, label: 'Envío' }
                    ].map((s) => (
                        <div key={s.num} className="flex-1 flex items-center">
                            <div className={`flex items-center justify-center py-4 border-b-2 transition-colors flex-1 ${step === s.num ? 'border-gold-500 text-gold-400' : step > s.num ? 'border-green-500 text-green-400' : 'border-transparent text-wood-500'}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${step >= s.num ? 'bg-current text-wood-950' : 'bg-wood-800 text-wood-500 border border-wood-600'}`}>
                                    {step > s.num ? <CheckCircle2 className="w-4 h-4 text-wood-950" /> : s.num}
                                </span>
                                <span className="text-sm uppercase tracking-widest font-bold">{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

                    {/* STEP 1: MESSAGE */}
                    {step === STEP_MESSAGE && (
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-wood-400 mb-2">Nombre de Campaña</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. Promoción Especial Fin de Año"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                        className="w-full bg-wood-900 border border-white/10 focus:border-gold-500/50 rounded-xl px-4 py-3 text-cream-100 placeholder:text-wood-600 focus:ring-1 focus:ring-gold-500 transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-wood-400 mb-2">Tipo de Mensaje</label>
                                    <div className="flex gap-4 mb-3">
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer border-white/10 ${messageType === 'template' ? 'bg-gold-500/10 border-gold-500/50 text-gold-400' : 'bg-wood-900 text-wood-400 hover:text-cream-100 hover:bg-wood-800'}`}>
                                            <input type="radio" value="template" checked={messageType === 'template'} onChange={() => setMessageType('template')} className="hidden" />
                                            <MessageCircleHeart className="w-4 h-4" />
                                            <span className="font-medium text-sm">Template (Recomendado)</span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer border-white/10 ${messageType === 'text' ? 'bg-gold-500/10 border-gold-500/50 text-gold-400' : 'bg-wood-900 text-wood-400 hover:text-cream-100 hover:bg-wood-800'}`}>
                                            <input type="radio" value="text" checked={messageType === 'text'} onChange={() => setMessageType('text')} className="hidden" />
                                            <span className="font-medium text-sm">Texto Libre</span>
                                        </label>
                                    </div>
                                    {messageType === 'text' && (
                                        <div className="flex gap-2 items-start bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-200 text-sm">
                                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                            <p><strong>Aviso:</strong> Usar texto libre masivo puede provocar bloqueos rápidos en WhatsApp si los clientes no interactúan. Las plantillas preaprobadas son más seguras.</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-wood-400">Contenido del Mensaje</label>
                                        <span className="text-xs text-wood-500">{messageText.length} / 1024 char</span>
                                    </div>
                                    <div className="flex gap-2 mb-3">
                                        {['nombre', 'puntos', 'nivel', 'sucursal'].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => insertVar(v)}
                                                className="px-2 py-1 text-xs font-mono bg-wood-900 border border-white/5 rounded hover:bg-wood-700 text-gold-400 transition-colors"
                                            >
                                                {`{${v}}`}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        rows="5"
                                        placeholder="Escribe el mensaje de tu campaña aquí..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        className="w-full bg-wood-900 border border-white/10 focus:border-gold-500/50 rounded-xl p-4 text-cream-100 placeholder:text-wood-600 focus:ring-1 focus:ring-gold-500 transition-all outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-wood-400 mb-2">Enlace CTA (Botón en Whatsapp)</label>
                                    <input
                                        type="url"
                                        placeholder="https://terramarya.com/reservar"
                                        value={ctaLink}
                                        onChange={(e) => setCtaLink(e.target.value)}
                                        className="w-full bg-wood-900 border border-white/10 focus:border-gold-500/50 rounded-xl px-4 py-3 text-cream-100 placeholder:text-wood-600 focus:ring-1 focus:ring-gold-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Live Preview Bubble */}
                            <div className="flex-1 max-w-sm shrink-0 flex flex-col">
                                <label className="block text-xs font-bold uppercase tracking-wider text-wood-400 mb-2">Vista Previa (Simulada)</label>
                                <div className="flex-1 bg-wood-900 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col">
                                    <div className="bg-[#075e54] p-3 shadow-md flex items-center justify-between z-10 shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex flex-col justify-center items-center">
                                                <Store className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-white text-sm font-semibold leading-tight">Terramarya</h4>
                                                <span className="text-xs text-white/70 leading-none">Empresa verificada</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Whatsapp Chat Background mockup */}
                                    <div className="flex-1 bg-[#efeae2] p-4 relative" style={{ backgroundImage: 'radial-gradient(circle, #e2dcd2 1px, transparent 1px)', backgroundSize: '10px 10px' }}>

                                        {messageText ? (
                                            <div className="bg-white text-[#111b21] rounded-lg rounded-tl-none p-3 shadow text-sm break-words relative w-[90%] float-left">
                                                <p className="whitespace-pre-wrap">
                                                    {messageText.replace('{nombre}', 'Juan Pérez').replace('{puntos}', '150').replace('{nivel}', 'Explorador').replace('{sucursal}', 'Terramarya')}
                                                </p>
                                                {ctaLink && (
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <a href="#" className="flex justify-center text-[#027eb5] font-semibold">{ctaLink.length > 25 ? 'Ver enlace' : ctaLink}</a>
                                                    </div>
                                                )}
                                                <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">12:00</span>
                                            </div>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-center text-gray-500 text-sm px-4">
                                                Escribe un mensaje para ver cómo lucirá en WhatsApp.
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: RECIPIENTS */}
                    {step === STEP_RECIPIENTS && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-3 text-green-200">
                                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-green-300 mb-1">Filtro de Seguridad Activo</p>
                                    <p className="text-sm">Por seguridad, solo se muestran y enviarán mensajes a los <strong>{eligibleRecipients.length} clientes</strong> que dieron explícitamente su consentimiento. Los clientes no autorizados han sido excluidos automáticamente.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-wood-400 mb-2">Filtrar por Sucursal</label>
                                    <select
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className="w-full bg-wood-900 border border-white/10 rounded-xl px-4 py-3 text-cream-100 focus:ring-1 focus:ring-gold-500 outline-none"
                                    >
                                        <option value="All">Todas las sucursales</option>
                                        <option value="Terramarya">Terramarya</option>
                                        <option value="Café de Villa (SportBar)">Café de Villa (SportBar)</option>
                                        <option value="Café de Villa (Restaurant)">Café de Villa (Restaurant)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-wood-400 mb-2">Filtrar por Nivel Elite</label>
                                    <select
                                        value={selectedLevel}
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                        className="w-full bg-wood-900 border border-white/10 rounded-xl px-4 py-3 text-cream-100 focus:ring-1 focus:ring-gold-500 outline-none"
                                    >
                                        <option value="All">Todos los niveles</option>
                                        <option value="Explorador">Explorador</option>
                                        <option value="Gourmet">Gourmet</option>
                                        <option value="Elite">Elite</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-serif text-cream-50 mb-4 border-b border-white/10 pb-2">Destinatarios Seleccionados ({selectedRecipients.length})</h3>
                                <div className="bg-wood-900 border border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-wood-800 sticky top-0 z-10">
                                            <tr>
                                                <th className="p-3 text-wood-400 font-medium">Nombre</th>
                                                <th className="p-3 text-wood-400 font-medium">Teléfono</th>
                                                <th className="p-3 text-wood-400 font-medium">Nivel</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRecipients.length > 0 ? (
                                                selectedRecipients.map(c => (
                                                    <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                        <td className="p-3 text-cream-100">{c.name}</td>
                                                        <td className="p-3 text-wood-300 font-mono">{c.phone}</td>
                                                        <td className="p-3 text-gold-400">{c.level}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="p-6 text-center text-wood-500">Ningún cliente coincide con los filtros.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SIMULATION / SEND */}
                    {step === STEP_SIMULATION && (
                        <div className="flex flex-col items-center justify-center p-8 text-center animate-in slide-in-from-right-4 duration-300 h-full min-h-[300px]">

                            {!isSimulating && !simulationComplete ? (
                                <div className="space-y-6 max-w-md w-full">
                                    <div className="bg-wood-900 rounded-full w-24 h-24 flex block items-center justify-center mx-auto mb-4 border border-gold-500/30">
                                        <Send className="w-10 h-10 text-gold-400 ml-2" />
                                    </div>
                                    <h2 className="text-3xl font-serif text-cream-50">Resumen de Envío</h2>
                                    <p className="text-wood-400 text-lg">
                                        Estás a punto de enviar una campaña a <strong>{selectedRecipients.length} clientes</strong>.
                                    </p>
                                    <div className="bg-wood-900/50 rounded-xl p-4 border border-white/5 space-y-2 mt-6">
                                        <p className="flex justify-between text-sm"><span className="text-wood-500">Campaña:</span> <strong className="text-cream-100 truncate flex-1 text-right ml-4">{campaignName}</strong></p>
                                        <p className="flex justify-between text-sm"><span className="text-wood-500">Tipo:</span> <strong className="text-cream-100">{messageType === 'template' ? 'Plantilla Segura' : 'Texto Libre'}</strong></p>
                                        <p className="flex justify-between text-sm"><span className="text-wood-500">Destinatarios Autorizados:</span> <strong className="text-green-400">{selectedRecipients.length}</strong></p>
                                    </div>
                                    <Button
                                        onClick={startSimulation}
                                        className="w-full mt-8 bg-gold-500 text-wood-950 font-bold hover:bg-gold-400 text-lg py-6"
                                    >
                                        Confirmar e Iniciar Envío (Simulación)
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full max-w-2xl text-center space-y-10">
                                    {simulationComplete ? (
                                        <div className="space-y-4 animate-in zoom-in-95 duration-500">
                                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto relative">
                                                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
                                                <CheckCircle2 className="w-12 h-12 text-green-400 relative z-10" />
                                            </div>
                                            <h2 className="text-4xl font-serif text-cream-50">¡Campaña Enviada!</h2>
                                            <p className="text-wood-300 text-lg">
                                                Se procesaron con éxito los {selectedRecipients.length} mensajes a clientes autorizados.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <h2 className="text-3xl font-serif text-cream-50 flex justify-center items-center gap-4">
                                                <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                                                Enviando Mensajes a Cola...
                                            </h2>
                                            <p className="text-wood-400">Procesando envío masivo simulado seguro.</p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className={simulationComplete ? "text-green-400" : "text-gold-400"}>
                                                {simulationComplete ? "Completado" : "En progreso..."}
                                            </span>
                                            <span className="text-cream-50">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-wood-900 rounded-full h-4 overflow-hidden border border-white/5 inset-shadow-sm p-0.5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-[100ms] ease-linear ${simulationComplete ? 'bg-green-500' : 'bg-gold-500'}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        {isSimulating && (
                                            <p className="text-xs text-wood-500">Conectando a API simulada de mensajería...</p>
                                        )}
                                    </div>

                                    {simulationComplete && (
                                        <Button onClick={onClose} variant="outline" className="mt-8 border-wood-500 text-wood-300 hover:text-white">
                                            Volver a Clientes
                                        </Button>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {!isSimulating && !simulationComplete && (
                    <div className="p-6 border-t border-white/10 bg-wood-900/80 flex items-center justify-between shrink-0">
                        <Button variant="ghost" className="text-wood-400 hover:text-white" onClick={onClose}>
                            Cancelar
                        </Button>
                        <div className="flex gap-3">
                            {step > STEP_MESSAGE && (
                                <Button variant="outline" onClick={() => setStep(step - 1)}>
                                    Atrás
                                </Button>
                            )}

                            {step === STEP_MESSAGE && (
                                <Button
                                    onClick={() => setStep(STEP_RECIPIENTS)}
                                    className="bg-gold-500 text-wood-950 font-bold hover:bg-gold-400"
                                    disabled={!isStep1Valid}
                                >
                                    Siguiente: Seleccionar Clientes
                                </Button>
                            )}

                            {step === STEP_RECIPIENTS && (
                                <Button
                                    onClick={() => setStep(STEP_SIMULATION)}
                                    className="bg-gold-500 text-wood-950 font-bold hover:bg-gold-400"
                                    disabled={!isStep2Valid}
                                >
                                    Siguiente: Resumen de Envío
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignModal;
