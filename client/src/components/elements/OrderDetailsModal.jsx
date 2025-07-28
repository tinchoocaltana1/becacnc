import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Check, User, Calendar, Package } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

export function OrderDetailsModal({ isOpen, onClose, order, token }) {
  const [orderProducts, setOrderProducts] = useState([]);

  const fetchProducts = async () => {
    if (!order) return;

    try {
      const response = await axios.get(`http://localhost:4000/api/products/${order.order_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log("Fetched products:", response.data);
      setOrderProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // useEffect to fetch products by order_id when the component mounts
  useEffect(() => {
    fetchProducts();
  }, [order]);

  if (!order) return null;

  const handleToggleProductStatus = async (productId) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/products/${productId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log("Product status updated:", response.data);
      // Update the local state to reflect the change using the previous useEffect
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      alert("Error al actualizar el estado del producto. Por favor, inténtelo de nuevo.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log("Product deleted: ", response.data);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert("Error al eliminar el producto. Por favor, inténtelo de nuevo.");
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/orders/${order.order_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("Order completed:", response.data);
      onClose();
      window.location.reload(); // reload the page to reflect changes
    } catch (error) {
      console.error('Error completing order:', error);
      alert("Error al completar el pedido. Por favor, inténtelo de nuevo.");
    }
  }

  const handleDeleteOrder = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/orders/${order.order_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log("Order deleted:", response.data);
      onClose();
      window.location.reload(); // reload the page to reflect changes
    } catch (error) {
      console.error('Error deleting order:', error);
      alert("Error al eliminar el pedido. Por favor, inténtelo de nuevo.");
    }
  };

  const statusText = order.status === 'pending' ? 'Pendiente' : 'Completado';

  // function to get formatted date (19/01/2025)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // function to get formatted price (20000 to 20.000 or 9000 to 9.000)
  function formatPrice(number) {
    return number.toLocaleString('de-DE'); // 'de-DE' usa el punto como separador de miles
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-poppins">
            Pedido #{order.order_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 font-space">
          {/* order information */}
          <div className={`grid grid-cols-1 ${order.status === 'completed' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 p-4 bg-muted rounded-lg`}>
            <div className="flex items-top gap-2">
              <User className="w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{order.client_name}</p>
              </div>
            </div>

            <div className="flex items-top gap-2">
              <Calendar className="w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Creación</p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
            </div>

            <div className={`items-top gap-2 ${order.status === 'pending' ? 'hidden' : 'flex'}`}>
              <Calendar className="w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Finalización</p>
                <p className="font-medium">{formatDate(order.completed_at)}</p>
              </div>
            </div>

            <div className="flex items-top gap-2">
              <Package className="w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge
                  variant="outline"
                  className={`${order.status === 'pending' ? 'border-orange-400 text-orange-400' : 'border-secondary text-secondary'}`}
                >
                  {statusText}
                </Badge>
              </div>
            </div>
          </div>

          {/* products list */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins">Productos del pedido</h3>
            <div className="space-y-3">
              {Array.isArray(orderProducts) && orderProducts.map((product) => (
                <div key={product.product_id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={product.is_done}
                        className={`
                        ${order.status === 'pending' ? 'block' : 'hidden'}
                        mt-1`}
                        onCheckedChange={() => handleToggleProductStatus(product.product_id)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          Tamaño: {product.size} | Cantidad: {product.quantity}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className={`
                      ${order.status === 'pending' ? 'block' : 'hidden'}
                      text-destructive hover:text-destructive`}
                      onClick={() => handleDeleteProduct(product.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Costo unitario</p>
                      <p className="font-medium">${formatPrice(product.unit_cost)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Precio unitario</p>
                      <p className="font-medium">${formatPrice(product.unit_price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Costo total</p>
                      <p className="font-medium">${formatPrice(product.unit_cost * product.quantity)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Precio total</p>
                      <p className="font-medium text-primary">${formatPrice(product.unit_price * product.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* order total price */}
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="font-poppins">Total del pedido:</span>
            <span className="text-primary">$ {formatPrice(order.total_price)}</span>
          </div>

          {/* action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 text-white bg-destructive hover:bg-destructive/80 transition-all duration-300 font-poppins"
              onClick={() => handleDeleteOrder()}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar pedido
            </Button>

            {order.status === 'pending' && (
              <Button 
                className="flex-1 bg-secondary hover:bg-secondary/80 transition-all duration-300 font-poppins"
                onClick={() => handleCompleteOrder()}
              >
                <Check className="h-4 w-4 mr-2" />
                Marcar como completado
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}