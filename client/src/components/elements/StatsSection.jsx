import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSignIcon,
  Boxes,
  Box,
  ShoppingCart
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

export function StatsSection({ token }) {
  const [monthStatsData, setMonthStatsData] = useState([]);
  const [weekStatsData, setWeekStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // function to get formatted price (20000 to 20.000 or 9000 to 9.000)
  function formatPrice(number) {
    return number.toLocaleString('de-DE'); // 'de-DE' usa el punto como separador de miles
  }

  // function to get the current month number
  function getCurrentMonthNumber() {
    const date = new Date();
    return date.getMonth() + 1; // getMonth() returns 0-11, so we add 1
  }

  // function to get the current year
  function getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  // function to get the current month name
  function getCurrentMonthName() {
    const currentMonthNumber = getCurrentMonthNumber();

    if (currentMonthNumber === 1) return "Enero";
    if (currentMonthNumber === 2) return "Febrero";
    if (currentMonthNumber === 3) return "Marzo";
    if (currentMonthNumber === 4) return "Abril";
    if (currentMonthNumber === 5) return "Mayo";
    if (currentMonthNumber === 6) return "Junio";
    if (currentMonthNumber === 7) return "Julio";
    if (currentMonthNumber === 8) return "Agosto";
    if (currentMonthNumber === 9) return "Septiembre";
    if (currentMonthNumber === 10) return "Octubre";
    if (currentMonthNumber === 11) return "Noviembre";
    if (currentMonthNumber === 12) return "Diciembre";
  }

  // function to get the month number from a complete date string
  function getMonthNumberFromDate(dateString) {
    const date = new Date(dateString);
    return date.getMonth() + 1; // getMonth() returns 0-11, so we add 1
  }

  // function to get the year from a complete date string
  function getYearFromDate(dateString) {
    const date = new Date(dateString);
    return date.getFullYear();
  }

  // function to get the difference in days between two dates
  function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(new Date(date1) - new Date(date2));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert milliseconds to days
  }

  // fetch all orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {

      try {
        const ordersResponse = await axios.get('http://localhost:4000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const productsResponse = await axios.get('http://localhost:4000/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Orders and products fetched successfully:', ordersResponse.data, productsResponse.data);
        await makeMonthStats(ordersResponse.data, productsResponse.data);

        console.log('Stats data:', monthStatsData);
        await setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [token]);

  const makeMonthStats = (orders, products) => {
    // previous month stats
    let previousMonthIncome = 0;
    let previousMonthCosts = 0;
    let previousMonthProfit = 0;
    let previousMonthCompletedOrders = 0;
    let previousMonthClients = 0;

    // current month stats
    let monthTotalIncome = 0;
    let monthTotalCosts = 0;
    let monthTotalProfit = 0;
    let monthCompletedOrders = 0;
    let monthPendingOrders = 0;
    let monthClients = 0;

    // total products sold
    let productsSold = 0;

    // week stats
    const currentDate = new Date();

    let previousWeekIncome = 0;
    let previousWeekCosts = 0;
    let previousWeekProfit = 0;

    let weekTotalIncome = 0;
    let weekTotalCosts = 0;
    let weekTotalProfit = 0;

    orders.forEach((order) => {
      const orderMonth = getMonthNumberFromDate(order.created_at);
      const orderYear = getYearFromDate(order.created_at);
      let differenceInDays = getDaysDifference(order.created_at, currentDate);

      // previous month stats
      if (orderMonth === getCurrentMonthNumber() - 1 && orderYear === getCurrentYear()) {
        previousMonthIncome += order.total_price;
        previousMonthCosts += order.total_cost;
        previousMonthProfit += order.total_price - order.total_cost;
        previousMonthCompletedOrders += order.status === 'completed' ? 1 : 0;
        previousMonthClients++;
      }

      // current month stats
      if (orderMonth === getCurrentMonthNumber() && orderYear === getCurrentYear()) {
        monthTotalIncome += order.total_price;
        monthTotalCosts += order.total_cost;
        monthTotalProfit += order.total_price - order.total_cost;
        monthCompletedOrders += order.status === 'completed' ? 1 : 0;
        monthPendingOrders += order.status === 'pending' ? 1 : 0;
        monthClients++;
      }

      // previous week stats
      if (differenceInDays <= 14 && differenceInDays > 7) {
        previousWeekIncome += order.total_price;
        previousWeekCosts += order.total_cost;
        previousWeekProfit += order.total_price - order.total_cost;
      }

      // current week stats
      if (differenceInDays <= 7) {
        weekTotalIncome += order.total_price;
        weekTotalCosts += order.total_cost;
        weekTotalProfit += order.total_price - order.total_cost;
      }
    });

    // calculate total products sold
    products.forEach((product) => {
      productsSold += product.quantity;
    });

    const monthData = [
      {
        value: monthTotalIncome,
        previousValue: previousMonthIncome,
        change: Math.ceil(((monthTotalIncome - previousMonthIncome) / previousMonthIncome) * 100),
        trend: monthTotalIncome > previousMonthIncome ? "up" : "down", // if up it means income is higher
      },
      {
        value: monthTotalCosts,
        previousValue: previousMonthCosts,
        change: ((previousMonthCosts - monthTotalCosts) / previousMonthCosts) * 100,
        trend: monthTotalCosts < previousMonthCosts ? "down" : "up", // if down it means costs are lower
      },
      {
        value: monthTotalProfit,
        previousValue: previousMonthProfit,
        change: ((monthTotalProfit - previousMonthProfit) / previousMonthProfit) * 100,
        trend: monthTotalProfit > previousMonthProfit ? "up" : "down", // if up it means profit is higher
      },
      {
        value: monthCompletedOrders,
        previousValue: previousMonthCompletedOrders,
        change: monthCompletedOrders - previousMonthCompletedOrders,
        trend: monthCompletedOrders > previousMonthCompletedOrders ? "up" : "down",
      },
      {
        value: monthPendingOrders,
      },
      {
        value: productsSold,
      }
    ];

    const weekData = [
      {
        value: weekTotalIncome,
        previousValue: previousWeekIncome,
        change: Math.ceil(((weekTotalIncome - previousWeekIncome) / previousWeekIncome) * 100),
        trend: weekTotalIncome >= previousWeekIncome ? "up" : "down", // if up it means income is higher
      },
      {
        value: weekTotalCosts,
        previousValue: previousWeekCosts,
        change: ((previousWeekCosts - weekTotalCosts) / previousWeekCosts) * 100,
        trend: weekTotalCosts <= previousWeekCosts ? "down" : "up", // if down it means costs are lower
      },
      {
        value: weekTotalProfit,
        previousValue: previousWeekProfit,
        change: ((weekTotalProfit - previousWeekProfit) / previousWeekProfit) * 100,
        trend: weekTotalProfit >= previousWeekProfit ? "up" : "down", // if up it means profit is higher
      },
    ];

    setMonthStatsData(monthData);
    setWeekStatsData(weekData);
  }

  if (!loading) {
    return (
      <div className="space-y-6">
        <div className="font-poppins">
          <h2 className="text-2xl font-bold tracking-tight">Estadísticas de {getCurrentMonthName()}</h2>
          <p className="text-muted-foreground">
            Resumen de tu negocio en el mes corriente.
          </p>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* INGRESO TOTAL */}
          <Card className={`${monthStatsData[0].trend === "up" ? "border-secondary text-secondary" : "border-destructive text-destructive"} border`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingreso total
              </CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatPrice(monthStatsData[0].value)}</div>

              {Number.isFinite(monthStatsData[0].change) && (
                <p className="text-xs flex items-center gap-1">
                  {monthStatsData[0].trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {monthStatsData[0].change > 0 ? `${monthStatsData[0].change.toFixed(0)}% más` : `${(monthStatsData[0].change.toFixed(0) * -1)}% menos`} que el mes pasado ( ${formatPrice(monthStatsData[0].previousValue)} )
                </p>
              )}
            </CardContent>
          </Card>

          <Card className={`${monthStatsData[1].trend === "up" ? "border-secondary text-secondary" : "border-destructive text-destructive"} border`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gasto total
              </CardTitle>
              <TrendingDown className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatPrice(monthStatsData[1].value)}</div>

              {Number.isFinite(monthStatsData[1].change) && (
                <p className="text-xs flex items-center gap-1">
                  {monthStatsData[1].trend === "down" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {monthStatsData[1].change > 0 ? `${monthStatsData[1].change.toFixed(0)}% más` : `${(monthStatsData[1].change.toFixed(0) * -1)}% menos`} que el mes pasado ( ${formatPrice(monthStatsData[1].previousValue)} )
                </p>
              )}
            </CardContent>
          </Card>

          {/* GANANCIA TOTAL */}
          <Card className={`${monthStatsData[2].trend === "up" ? "border-secondary text-secondary" : "border-destructive text-destructive"} border`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ganancia total
              </CardTitle>
              <DollarSignIcon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatPrice(monthStatsData[2].value)}</div>

              {Number.isFinite(monthStatsData[2].change) && (
                <p className="text-xs flex items-center gap-1">
                  {monthStatsData[2].trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {monthStatsData[2].change > 0 ? `${monthStatsData[2].change.toFixed(0)}% más` : `${(monthStatsData[2].change.toFixed(0) * -1)}% menos`} que el mes pasado ( ${formatPrice(monthStatsData[2].previousValue)} )
                </p>
              )}
            </CardContent>
          </Card>

          {/* PEDIDOS COMPLETADOS */}
          <Card className={`${monthStatsData[3].trend === "up" ? "border-secondary text-secondary" : "border-destructive text-destructive"} border`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos completados
              </CardTitle>
              <Boxes className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthStatsData[3].value}</div>
              { monthStatsData[3].previousValue > 0 ? (
                <p className="text-xs flex items-center gap-1">
                {monthStatsData[3].trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {monthStatsData[3].change > 0 ? `${monthStatsData[3].change} más` : `${(monthStatsData[3].change * -1)} menos`} que el mes pasado ( {monthStatsData[3].previousValue} )
                </p>
              ) : null }
            </CardContent>
          </Card>

          {/* PEDIDOS PENDIENTES */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos pendientes
              </CardTitle>
              <Box className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthStatsData[4].value}</div>
            </CardContent>
          </Card>

          {/* PRODUCTOS TOTALES VENDIDOS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Productos totales vendidos
              </CardTitle>
              <ShoppingCart className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthStatsData[5].value}</div>
            </CardContent>
          </Card>
        </div>


        {/* Gráficos placeholder */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="font-poppins">
            <CardTitle>Ingresos mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de ingresos mensuales</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="font-poppins">
            <CardTitle>Pedidos por día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de pedidos diarios</p>
            </div>
          </CardContent>
        </Card>
      </div> */}

        {/* Resumen semanal */}
        <Card>
          <CardHeader className="font-poppins">
            <CardTitle>Resumen de la semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${weekStatsData[0].trend === "up" ? "text-secondary" : "text-destructive"}`}>
                <p className="text-sm text-muted-foreground mb-2">Ingreso total</p>
                <p className="text-2xl font-bold">$<span>{formatPrice(weekStatsData[0].value)}</span></p>
                { weekStatsData[0].previousValue > 0 ? (
                <p className="text-xs flex items-center gap-1">
                {weekStatsData[0].trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {weekStatsData[0].change > 0 ? `${weekStatsData[0].change} más` : `${(weekStatsData[0].change * -1)} menos`} que la semana pasada ( {weekStatsData[0].previousValue} )
                </p>
              ) : null }
              </div>

              <div className={`${weekStatsData[1].trend === "down" ? "text-secondary" : "text-destructive"}`}>
                <p className="text-sm text-muted-foreground mb-2">Gasto total</p>
                <p className="text-2xl font-bold">$<span>{formatPrice(weekStatsData[1].value)}</span></p>
                { weekStatsData[1].previousValue > 0 ? (
                <p className="text-xs flex items-center gap-1">
                {weekStatsData[1].trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {weekStatsData[1].change > 0 ? `${weekStatsData[1].change} más` : `${(weekStatsData[1].change * -1)} menos`} que la semana pasada ( {weekStatsData[1].previousValue} )
                </p>
              ) : null }
              </div>

              <div className={`${weekStatsData[2].trend === "up" ? "text-secondary" : "text-destructive"}`}>
                <p className="text-sm text-muted-foreground mb-2">Ganancia total</p>
                <p className="text-2xl font-bold">$<span>{formatPrice(weekStatsData[2].value)}</span></p>
                { weekStatsData[2].previousValue > 0 ? (
                <p className="text-xs flex items-center gap-1">
                {weekStatsData[2].trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {weekStatsData[2].change > 0 ? `${weekStatsData[2].change} más` : `${(weekStatsData[2].change * -1)} menos`} que la semana pasada ( {weekStatsData[2].previousValue} )
                </p>
              ) : null }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return <p>Cargando...</p>;
  }
}