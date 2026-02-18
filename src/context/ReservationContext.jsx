import React, { createContext, useContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

const RESTAURANTS = [
    {
        id: 1,
        name: "Terramarya",
        type: "Cortes y Mariscos",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2070", // Reliable steakhouse image
        description: "La joya de la corona. Experiencia gastronómica premium donde los cortes de carne añejados y los mariscos más frescos se encuentran en el corazón de Parral.",
        gallery: [
            "https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2070", // Fine dining plate
            "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=2000", // Steak
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974", // Interior
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070", // Plating
            "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070"  // Steakhouse interior
        ],
        menu: [
            { name: "Tomahawk Gold", price: "$1,800", description: "Corte premium de 1.2kg bañado en oro de 24k." },
            { name: "Langosta Thermidor", price: "$1,200", description: "Clásica preparación francesa con salsa cremosa de mostaza y queso gratinado." },
            { name: "Rib Eye Añejo", price: "$950", description: "45 días de maduración en seco." },
            { name: "Ostiones Rockefeller", price: "$450", description: "Docena de ostiones frescos con espinacas y salsa holandesa." },
            { name: "Pulpo a las Brasas", price: "$580", description: "Adobado con chiles secos y papas cambray." },
            { name: "Salmón en Costra", price: "$490", description: "En costra de pistache con reducción de balsámico." },
            { name: "Carpaccio de Res", price: "$320", description: "Con alcaparras, parmesano y aceite de trufa." },
            { name: "Crema de Almeja", price: "$220", description: "Servida en pan de masa madre." }
        ]
    },
    {
        id: 2,
        name: "Café de Villa (SportBar)",
        type: "SportBar",
        image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1974",
        description: "El mejor ambiente para disfrutar de tus deportes favoritos con snacks de alta cocina y mixología de autor.",
        gallery: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
            "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1974",
            "https://images.unsplash.com/photo-1563806951-e4070a72ad4e?q=80&w=2000"
        ],
        menu: [
            { name: "Hamburguesa Trufada", price: "$350", description: "Carne wagyu, queso brie y aceite de trufa." },
            { name: "Alitas Bourbon", price: "$220", description: "Bañadas en salsa BBQ casera con un toque de whisky." },
            { name: "Nachos Villa", price: "$280", description: "Con arrachera, guacamole rústico y queso fundido." }
        ]
    },
    {
        id: 3,
        name: "Café de Villa (Restaurant)",
        type: "Restaurante Familiar",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974",
        description: "Cocina reconfortante en un ambiente relajado, ideal para desayunos y comidas familiares inolvidables.",
        gallery: [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974",
            "https://images.unsplash.com/photo-1466978913421-dad938661248?q=80&w=1950"
        ],
        menu: [
            { name: "Chilaquiles Divorciados", price: "$180", description: "Con salsa roja y verde, crema de rancho y queso fresco." },
            { name: "Ensalada César", price: "$160", description: "Preparada en tu mesa con la receta original." },
            { name: "Club Sandwich Villa", price: "$210", description: "Tres pisos de sabor con pollo, tocino y aguacate." }
        ]
    }
];

const INITIAL_USER = {
    name: "Alejandro Baca",
    points: 0,
    tier: "Explorador" // Explorador, Gourmet, Terramarya Elite
};

export const ReservationProvider = ({ children }) => {
    const [restaurants] = useState(RESTAURANTS);
    const [reservations, setReservations] = useState([]);
    const [user, setUser] = useState(INITIAL_USER);

    // Load from local storage on mount (simulation of persistence)
    useEffect(() => {
        const savedReservations = localStorage.getItem('reservations');
        let parsedData = [];
        if (savedReservations) {
            try {
                parsedData = JSON.parse(savedReservations);
            } catch (e) {
                console.error("Failed to parse reservations", e);
            }
        }

        if (parsedData && parsedData.length > 0) {
            setReservations(parsedData);
        } else {
            // Seed with mock data for demo if empty
            // Using local date to ensure chart shows data for "Today"
            const today = new Date().toLocaleDateString('en-CA');
            const MOCK_RESERVATIONS = [
                // Lunch Rush (13:00 - 16:00)
                { id: 'mock-1', date: today, time: '13:00', pax: '4', name: 'Roberto Sanchez', phone: '627-555-0101', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-2', date: today, time: '13:00', pax: '2', name: 'Ana Garcia', phone: '627-555-0102', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-3', date: today, time: '13:00', pax: '6', name: 'Familia Lopez', phone: '627-555-0103', restaurantId: 3, restaurantName: 'Café de Villa (Restaurant)', status: 'confirmed' },
                { id: 'mock-4', date: today, time: '14:00', pax: '4', name: 'Lic. Martinez', phone: '627-555-0110', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-5', date: today, time: '14:00', pax: '8', name: 'Grupo Empresarial', phone: '627-555-0111', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-6', date: today, time: '14:00', pax: '2', name: 'Carlos Ruiz', phone: '627-555-0104', restaurantId: 3, restaurantName: 'Café de Villa (Restaurant)', status: 'confirmed' },
                { id: 'mock-7', date: today, time: '15:00', pax: '4', name: 'Amigos Futbol', phone: '627-555-0112', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' },
                { id: 'mock-8', date: today, time: '15:00', pax: '2', name: 'Pareja Joven', phone: '627-555-0113', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-9', date: today, time: '15:00', pax: '5', name: 'Reunión Trabajo', phone: '627-555-0114', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' },
                { id: 'mock-10', date: today, time: '16:00', pax: '3', name: 'Tardía Comida', phone: '627-555-0115', restaurantId: 3, restaurantName: 'Café de Villa (Restaurant)', status: 'confirmed' },

                // Happy Hour / Pre-Dinner (17:00 - 19:00)
                { id: 'mock-11', date: today, time: '17:00', pax: '2', name: 'Cerveza Tarde', phone: '627-555-0116', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' },
                { id: 'mock-12', date: today, time: '18:00', pax: '4', name: 'Precopeo', phone: '627-555-0117', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' },
                { id: 'mock-13', date: today, time: '18:00', pax: '2', name: 'Cita Temprana', phone: '627-555-0118', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },

                // Dinner Rush (19:00 - 22:00)
                { id: 'mock-14', date: today, time: '19:00', pax: '4', name: 'Maria Rodriguez', phone: '627-555-0105', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-15', date: today, time: '19:00', pax: '2', name: 'Cena Romántica', phone: '627-555-0120', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-16', date: today, time: '19:00', pax: '6', name: 'Familia Grande', phone: '627-555-0124', restaurantId: 3, restaurantName: 'Café de Villa (Restaurant)', status: 'confirmed' },
                { id: 'mock-17', date: today, time: '20:00', pax: '8', name: 'Cumpleaños Jorge', phone: '627-555-0107', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-18', date: today, time: '20:00', pax: '2', name: 'Juan Perez', phone: '627-555-0106', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-19', date: today, time: '20:00', pax: '6', name: 'Reunión Ex-Alumnos', phone: '627-555-0121', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' },
                { id: 'mock-20', date: today, time: '20:00', pax: '4', name: 'Cena Negocios', phone: '627-555-0125', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-21', date: today, time: '21:00', pax: '3', name: 'Luis Torres', phone: '627-555-0108', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' },
                { id: 'mock-22', date: today, time: '21:00', pax: '4', name: 'Visitantes Chihuahua', phone: '627-555-0122', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-23', date: today, time: '21:00', pax: '2', name: 'Cena Tardia', phone: '627-555-0126', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-24', date: today, time: '21:00', pax: '5', name: 'Amigos Cena', phone: '627-555-0127', restaurantId: 3, restaurantName: 'Café de Villa (Restaurant)', status: 'confirmed' },

                // Late Night (22:00 - 00:00)
                { id: 'mock-25', date: today, time: '22:00', pax: '2', name: 'Cierre Negocios', phone: '627-555-0123', restaurantId: 1, restaurantName: 'Terramarya', status: 'confirmed' },
                { id: 'mock-26', date: today, time: '22:00', pax: '4', name: 'Copas Finales', phone: '627-555-0128', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' },
                { id: 'mock-27', date: today, time: '23:00', pax: '2', name: 'Última Llamada', phone: '627-555-0129', restaurantId: 2, restaurantName: 'Café de Villa (SportBar)', status: 'confirmed' }
            ];
            setReservations(MOCK_RESERVATIONS);
        }

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('reservations', JSON.stringify(reservations));
    }, [reservations]);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const checkAvailability = (restaurantId, date, time) => {
        // Logic: Max 12 tables per hour per restaurant
        const count = reservations.filter(r =>
            r.restaurantId === restaurantId &&
            r.date === date &&
            r.time === time
        ).length;

        return count < 12;
    };

    const addReservation = (reservationData) => {
        // Basic validation
        if (!checkAvailability(reservationData.restaurantId, reservationData.date, reservationData.time)) {
            throw new Error("Horario Completo");
        }

        const newReservation = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            status: 'confirmed',
            ...reservationData
        };

        setReservations(prev => [...prev, newReservation]);

        // Add Happy Points (150 per reservation)
        addPoints(150);

        return newReservation;
    };

    const addPoints = (amount) => {
        setUser(prev => {
            const newPoints = prev.points + amount;
            let newTier = "Explorador";
            if (newPoints >= 1500) newTier = "Terramarya Elite";
            else if (newPoints >= 500) newTier = "Gourmet";

            return { ...prev, points: newPoints, tier: newTier };
        });
    };

    const getReservationsByRestaurant = (restaurantId) => {
        return reservations.filter(r => r.restaurantId === restaurantId);
    };

    return (
        <ReservationContext.Provider value={{
            restaurants,
            reservations,
            user,
            checkAvailability,
            addReservation,
            getReservationsByRestaurant
        }}>
            {children}
        </ReservationContext.Provider>
    );
};

export const useReservation = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservation must be used within a ReservationProvider');
    }
    return context;
};
