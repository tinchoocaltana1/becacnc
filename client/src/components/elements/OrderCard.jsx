import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Package } from "lucide-react";

export function OrderCard({ order, onClick }) {
  const statusText = order.status === 'pending' ? 'Pendiente' : 'Completado';

  // function to get formatted date (19-01-2025)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // function to get formatted price (20000 to 20.000)
  function formatPrice(number) {
    return number.toLocaleString('de-DE'); // 'de-DE' usa el punto como separador de miles
  }

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 ${order.status === 'pending' ? 'border-orange-400' : 'border-secondary'}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-card-foreground font-poppins">{order.client_name}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${order.status === 'pending' ? 'border-orange-400 text-orange-400' : 'border-secondary text-secondary'}`}
          >
            {statusText}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDate(order.created_at)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{order.completion_percentage}%</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <span>$ {formatPrice(order.total_price)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}