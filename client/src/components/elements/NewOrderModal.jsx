import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import axios from "axios";

export function NewOrderModal({ isOpen, onClose, token }) {
  const [client_name, setClient_name] = useState("");
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    description: "",
    size: "",
    quantity: 1,
    unit_cost: 0,
    unit_price: 0,
  });

  const addProduct = () => {
    if (capitalize(currentProduct.description) && currentProduct.size) {
      currentProduct.description = capitalize(currentProduct.description);
      
      const newProduct = {
        id: Date.now().toString(),
        ...currentProduct,
      };

      setProducts([...products, newProduct]);

      setCurrentProduct({
        description: "",
        size: "",
        quantity: 1,
        unit_cost: 0,
        unit_price: 0,
      });
    }
  };

  const cancel = () => {
    setClient_name("");
    setProducts([]);
    setCurrentProduct({
      description: "",
      size: "",
      quantity: 1,
      unit_cost: 0,
      unit_price: 0,
    });
    onClose();
  }

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + (product.unit_price * product.quantity), 0);
  };

  function capitalize(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const handleSubmit = () => {
    // prepare data for submission
    const productsWithoutId = products.map(({ id, ...rest }) => rest);

    const orderData = {
      client_name: capitalize(client_name),
      products: productsWithoutId,
    }

    // console.log("Se intenta subir este pedido:", orderData);

    axios.post('http://localhost:4000/api/orders', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log("Order created successfully:", response.data);
      // reset form after successful submission
      setClient_name("");
      setProducts([]);
      setCurrentProduct({
        description: "",
        size: "",
        quantity: 1,
        unit_cost: 0,
        unit_price: 0,
      });
      // reload the page to reflect changes
      window.location.reload();
    })
    .catch(error => {
      console.error("Client error - creating order:", error);
      alert("Error al crear el pedido. Por favor, inténtelo de nuevo.");
    });

    onClose();
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
            Crear nuevo pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 font-space">
          {/* client name */}
          <div className="space-y-2">
            <Label htmlFor="client_name">Nombre del cliente</Label>
            <Input
              id="client_name"
              placeholder="Ingrese el nombre del cliente"
              value={client_name}
              onChange={(e) => setClient_name(e.target.value)}
            />
          </div>

          {/* add product */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-poppins">Agregar productos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  placeholder="Descripción"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Tamaño (cm)</Label>
                <Input
                  id="size"
                  placeholder="Tamaño"
                  value={currentProduct.size}
                  onChange={(e) => setCurrentProduct({...currentProduct, size: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={currentProduct.quantity}
                  onChange={(e) => setCurrentProduct({...currentProduct, quantity: parseInt(e.target.value) || 1})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_cost">Costo unitario</Label>
                <Input
                  id="unit_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentProduct.unit_cost}
                  onChange={(e) => setCurrentProduct({...currentProduct, unit_cost: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_price">Precio unitario</Label>
                <div className="flex gap-2">
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={currentProduct.unit_price}
                    onChange={(e) => setCurrentProduct({...currentProduct, unit_price: parseFloat(e.target.value) || 0})}
                  />
                  <Button onClick={addProduct} size="sm" className="bg-secondary hover:bg-secondary/80 transition-all duration-300">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* products list */}
          {products.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-poppins">Productos agregados</h3>
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{product.description}</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeProduct(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Tamaño:</span> {product.size}
                      </div>
                      <div>
                        <span className="font-medium">Cantidad:</span> {product.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Costo unit.:</span> ${formatPrice(product.unit_cost)}
                      </div>
                      <div>
                        <span className="font-medium">Precio unit.:</span> ${formatPrice(product.unit_price)}
                      </div>
                      <div className="text-primary font-medium">
                        <span className="font-medium">Total:</span> ${formatPrice(product.unit_price * product.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* order total price */}
              <div className="flex justify-between items-center text-lg font-semibold p-4 bg-muted rounded-lg">
                <span className="font-poppins">Total del pedido:</span>
                <span className="text-primary">${formatPrice(calculateTotal())}</span>
              </div>
            </div>
          )}

          {/* action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={() => cancel()} className="flex-1 bg-destructive hover:bg-destructive/80 transition-all duration-300 font-poppins">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-secondary hover:bg-secondary/80 transition-all duration-300 font-poppins"
              disabled={!client_name || products.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar pedido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}