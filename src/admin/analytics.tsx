import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 12500, orders: 89 },
  { month: 'Feb', sales: 15200, orders: 102 },
  { month: 'Mar', sales: 18400, orders: 134 },
  { month: 'Apr', sales: 22100, orders: 156 },
  { month: 'May', sales: 19800, orders: 145 },
  { month: 'Jun', sales: 25300, orders: 178 },
];

const topProducts = [
  { name: 'Green Goddess', value: 35, color: '#a3d9a5' },
  { name: 'Tropical Blast', value: 28, color: '#facc15' },
  { name: 'Immunity Boost', value: 22, color: '#fca5a5' },
  { name: 'Detox Delight', value: 15, color: '#bfdbfe' },
];

const customerGrowth = [
  { month: 'Jan', new: 45, returning: 134 },
  { month: 'Feb', new: 52, returning: 156 },
  { month: 'Mar', new: 67, returning: 189 },
  { month: 'Apr', new: 73, returning: 203 },
  { month: 'May', new: 68, returning: 198 },
  { month: 'Jun', new: 81, returning: 234 },
];

const Analytics = () => {
  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-2">Track your business performance and growth</p>
        </div>
        <Select defaultValue="6months">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">$113,400</p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                  +14.2%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900">904</p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                  +8.7%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Average Order Value</p>
                <p className="text-2xl font-bold text-slate-900">$125.44</p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                  +4.1%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Customer Retention</p>
                <p className="text-2xl font-bold text-slate-900">76.8%</p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                  +2.3%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Sales & Orders Trend</CardTitle>
            <CardDescription className="text-slate-600">Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="sales" stroke="#a3d9a5" strokeWidth={3} />
                <Line type="monotone" dataKey="orders" stroke="#facc15" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Top-Selling Products</CardTitle>
            <CardDescription className="text-slate-600">Product performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: product.color }}
                    ></div>
                    <span className="text-sm text-slate-700">{product.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{product.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-900">Customer Growth</CardTitle>
            <CardDescription className="text-slate-600">New vs returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="new" fill="#a3d9a5" name="New Customers" />
                <Bar dataKey="returning" fill="#facc15" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </AdminLayout>
  );
};

export default Analytics;
