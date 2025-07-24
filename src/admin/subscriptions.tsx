import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Clock } from "lucide-react";

const subscriptions = [
  {
    id: "SUB-001",
    customer: "Sarah Johnson",
    plan: "Weekly Green Pack",
    nextDelivery: "2024-01-22",
    frequency: "Weekly",
    status: "active",
    value: "$47.99"
  },
  {
    id: "SUB-002",
    customer: "Mike Chen",
    plan: "Bi-weekly Detox",
    nextDelivery: "2024-01-25",
    frequency: "Bi-weekly",
    status: "active",
    value: "$79.99"
  },
  {
    id: "SUB-003",
    customer: "Emma Davis",
    plan: "Monthly Variety Pack",
    nextDelivery: "2024-02-01",
    frequency: "Monthly",
    status: "paused",
    value: "$129.99"
  },
  {
    id: "SUB-004",
    customer: "Alex Rodriguez",
    plan: "Daily Immunity Boost",
    nextDelivery: "2024-01-21",
    frequency: "Daily",
    status: "active",
    value: "$19.99"
  },
];

const upcomingDeliveries = [
  { date: "2024-01-21", count: 8, revenue: "$387.92" },
  { date: "2024-01-22", count: 12, revenue: "$542.88" },
  { date: "2024-01-23", count: 5, revenue: "$234.95" },
  { date: "2024-01-24", count: 15, revenue: "$678.85" },
  { date: "2024-01-25", count: 9, revenue: "$423.91" },
];

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Subscription & Delivery Schedule</h1>
        <p className="text-slate-600 mt-2">Manage recurring subscriptions and delivery schedules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-slate-900">324</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Paused Subscriptions</p>
                <p className="text-2xl font-bold text-slate-900">28</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Deliveries Today</p>
                <p className="text-2xl font-bold text-slate-900">49</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900">$15,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriptions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search subscriptions..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Subscriptions ({filteredSubscriptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Plan</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Next Delivery</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((subscription) => (
                      <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-900">{subscription.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-700">{subscription.customer}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="text-slate-900">{subscription.plan}</span>
                            <p className="text-sm text-slate-600">{subscription.frequency} • {subscription.value}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-600">{subscription.nextDelivery}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(subscription.status)}>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700">
                              Pause
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deliveries */}
        <div>
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Upcoming Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeliveries.map((delivery, index) => (
                  <div key={delivery.date} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{delivery.date}</p>
                      <p className="text-sm text-slate-600">{delivery.count} deliveries</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{delivery.revenue}</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Revenue
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default Subscriptions;
