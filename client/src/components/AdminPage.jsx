import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, BarChart3, LogOut } from "lucide-react";
import { OrderCard } from "./elements/OrderCard";
import { OrderDetailsModal } from "./elements/OrderDetailsModal";
import { NewOrderModal } from "./elements/NewOrderModal";
import { StatsSection } from "./elements/StatsSection";
import axios from "axios";

const AdminPage = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);

    // useEffect to check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login"; // redirect to login if not authenticated
        } else {
            setToken(token);
            fetchPendingOrders(token);
            fetchCompletedOrders(token);
        }
    }, [token]);

    const fetchPendingOrders = async (token) => {
        try {
            const response = await fetch('http://localhost:4000/api/orders/pending', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching orders');
            }

            const data = await response.json();
            console.log("Fetched orders:", data);
            setPendingOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const fetchCompletedOrders = async (token) => {
        try {
            const response = await fetch('http://localhost:4000/api/orders/completed', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching completed orders');
            }

            const data = await response.json();
            console.log("Fetched completed orders:", data);
            setCompletedOrders(data);
        } catch (error) {
            console.error("Error fetching completed orders:", error);
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // redirect to login
    };

    return (
        <div className="min-h-screen bg-background font-space text-primary">
            {/* header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="font-poppins">
                            <h1 className="text-2xl font-bold text-card-foreground">Panel de Administración</h1>
                            <p className="text-muted-foreground">Gestión de pedidos y estadísticas</p>
                        </div>
                        <div className="flex justify-center gap-3">
                            <Button onClick={() => setIsNewOrderModalOpen(true)} className="bg-secondary hover:bg-secondary/80 transition-all duration-300 w-full sm:w-auto font-poppins">
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo pedido
                            </Button>

                            <Button onClick={() => handleLogout()} className="mt-2 sm:mt-0 w-full sm:w-auto font-poppins bg-destructive hover:bg-destructive/80 transition-all duration-300">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* main content */}
            <main className="container mx-auto px-4 py-6">
                <Tabs defaultValue="orders" className="space-y-6">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                        <TabsTrigger value="orders" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Pedidos
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Estadísticas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders" className="space-y-6">
                        {/* toggle */}
                        <Tabs defaultValue="pending" className="space-y-6">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                                <TabsTrigger value="pending">
                                    Pendientes ({pendingOrders.length})
                                </TabsTrigger>
                                <TabsTrigger value="completed">
                                    Completados ({completedOrders.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* pending orders */}
                            <TabsContent value="pending">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold font-poppins">Pedidos pendientes</h2>
                                    {pendingOrders.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {pendingOrders.map((order) => (
                                                <OrderCard
                                                    key={order.order_id}
                                                    order={order}
                                                    onClick={() => handleOrderClick(order)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-lg font-medium text-muted-foreground">
                                                No hay pedidos pendientes
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* completed orders */}
                            <TabsContent value="completed">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Pedidos completados</h2>
                                    {completedOrders.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {completedOrders.map((order) => (
                                                <OrderCard
                                                    key={order.order_id}
                                                    order={order}
                                                    onClick={() => handleOrderClick(order)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-lg font-medium text-muted-foreground">
                                                No hay pedidos completados
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    {/* stats section */}
                    <TabsContent value="stats">
                        <StatsSection token={token} />
                    </TabsContent>
                </Tabs>
            </main>

            {/* modals */}
            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={selectedOrder}
                token={token}
            />

            <NewOrderModal
                isOpen={isNewOrderModalOpen}
                onClose={() => setIsNewOrderModalOpen(false)}
                token={token}
            />
        </div>
    );
};

export default AdminPage;