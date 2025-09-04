import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Archive, FileText } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    products: "Green Goddess x2, Detox Delight x1",
    status: "delivered",
    amount: "$47.99",
    date: "2024-01-20",
  },
  {
    id: "ORD-002",
    customer: "Mike Chen",
    products: "Tropical Blast x3",
    status: "processing",
    amount: "$35.97",
    date: "2024-01-20",
  },
  {
    id: "ORD-003",
    customer: "Emma Davis",
    products: "Immunity Boost x1, Green Goddess x1",
    status: "shipped",
    amount: "$31.98",
    date: "2024-01-19",
  },
  {
    id: "ORD-004",
    customer: "Alex Rodriguez",
    products: "Detox Delight x2",
    status: "pending",
    amount: "$27.98",
    date: "2024-01-19",
  },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Orders Management</h1>
        <p className="text-slate-600 mt-2">Track and manage all customer orders</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-white border-gray-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Recent Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Products</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{order.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700">{order.customer}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600 text-sm">{order.products}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{order.amount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600">{order.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
  );
};

export default Orders;
