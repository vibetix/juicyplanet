import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Archive } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Green Goddess",
    sku: "JU-GG-001",
    stock: 45,
    price: "$15.99",
    status: "active",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Tropical Blast",
    sku: "JU-TB-002",
    stock: 23,
    price: "$11.99",
    status: "active",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Immunity Boost",
    sku: "JU-IB-003",
    stock: 8,
    price: "$16.99",
    status: "low_stock",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Detox Delight",
    sku: "JU-DD-004",
    stock: 0,
    price: "$13.99",
    status: "out_of_stock",
    image: "/placeholder.svg"
  },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "low_stock":
        return "bg-yellow-100 text-yellow-700";
      case "out_of_stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "low_stock":
        return "Low Stock";
      case "out_of_stock":
        return "Out of Stock";
      default:
        return status;
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Inventory</h1>
          <p className="text-slate-600 mt-2">Manage your juice products and inventory</p>
        </div>
        <Link to="/admin/add-product">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900">
            Add New Juice
          </Button>
        </Link>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 bg-white border-gray-200"
          />
        </div>
        
        <Button variant="outline" size="sm">
          <Archive className="w-4 h-4 mr-2" />
          Export Inventory
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-square bg-yellow-50 rounded-lg mb-3 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg text-slate-900">{product.name}</CardTitle>
                <p className="text-sm text-slate-600">{product.sku}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Stock:</span>
                  <span className="font-medium text-slate-900">{product.stock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Price:</span>
                  <span className="font-medium text-slate-900">{product.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status:</span>
                  <Badge className={getStatusColor(product.status)}>
                    {getStatusText(product.status)}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link to={`/products/edit/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-slate-600">
                    Archive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </AdminLayout>
  );
};

export default Products;
