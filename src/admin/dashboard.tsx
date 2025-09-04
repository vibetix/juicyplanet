import { AdminLayout } from "@/components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { day: "Mon", revenue: 2400 },
  { day: "Tue", revenue: 1398 },
  { day: "Wed", revenue: 9800 },
  { day: "Thu", revenue: 3908 },
  { day: "Fri", revenue: 4800 },
  { day: "Sat", revenue: 3800 },
  { day: "Sun", revenue: 4300 },
];

const topJuices = [
  { name: "Green Goddess", sales: 145, trend: "+12%" },
  { name: "Tropical Blast", sales: 132, trend: "+8%" },
  { name: "Immunity Boost", sales: 98, trend: "+15%" },
  { name: "Detox Delight", sales: 87, trend: "+5%" },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-4 overflow-x-hidden space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Welcome back! Here's what's happening with your juice business
            today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Orders Today",
              value: "47",
              badge: "+12%",
              badgeColor: "bg-green-100 text-green-700",
              sub: "vs yesterday",
            },
            {
              title: "Revenue This Week",
              value: "$12,426",
              badge: "+8%",
              badgeColor: "bg-green-100 text-green-700",
              sub: "vs last week",
            },
            {
              title: "Active Subscriptions",
              value: "324",
              badge: "+3%",
              badgeColor: "bg-green-100 text-green-700",
              sub: "this month",
            },
          ].map((item, i) => (
            <Card key={i} className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-600">
                  {item.title}
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {item.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className={item.badgeColor}>
                    {item.badge}
                  </Badge>
                  <span className="text-sm text-slate-600">{item.sub}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-600">
                Low Inventory Alerts
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-red-700">
                5
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1">
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-700"
                >
                  Action needed
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Revenue This Week
              </CardTitle>
              <CardDescription className="text-slate-600">
                Daily revenue breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#a3d9a5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Top-Selling Juices</CardTitle>
              <CardDescription className="text-slate-600">
                Best performers this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topJuices.map((juice, index) => (
                  <div
                    key={juice.name}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-yellow-800">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{juice.name}</p>
                        <p className="text-sm text-slate-600">
                          {juice.sales} sold
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      {juice.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
