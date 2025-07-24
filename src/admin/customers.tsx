import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User } from "lucide-react";

const customers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    orders: 12,
    lastPurchase: "2024-01-20",
    totalSpent: "$287.45",
    status: "active",
    joinDate: "2023-08-15"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    orders: 8,
    lastPurchase: "2024-01-18",
    totalSpent: "$156.32",
    status: "active",
    joinDate: "2023-11-02"
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@email.com",
    orders: 23,
    lastPurchase: "2024-01-15",
    totalSpent: "$445.67",
    status: "vip",
    joinDate: "2023-05-10"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@email.com",
    orders: 3,
    lastPurchase: "2023-12-20",
    totalSpent: "$89.97",
    status: "inactive",
    joinDate: "2023-12-01"
  },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-yellow-100 text-yellow-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
        <p className="text-slate-600 mt-2">View and manage your customer relationships</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">VIP Customers</p>
                <p className="text-2xl font-bold text-slate-900">87</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">New This Month</p>
                <p className="text-2xl font-bold text-slate-900">34</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Inactive</p>
                <p className="text-2xl font-bold text-slate-900">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
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
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customers Table */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Orders</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Total Spent</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Last Purchase</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600">{customer.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-900">{customer.orders}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{customer.totalSpent}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-600">{customer.lastPurchase}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        View Profile
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

export default Customers;
