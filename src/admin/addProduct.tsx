import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { Image } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: "",
    price: "",
    comparePrice: "",
    sku: "",
    stock: "",
    category: "",
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    navigate("/products");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {isEditing ? "Edit Product" : "Add New Juice"}
        </h1>
        <p className="text-slate-600 mt-2">
          {isEditing ? "Update product information" : "Create a new juice product"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">Juice Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Green Goddess"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the juice, its benefits, and taste profile..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:bg-white min-h-24"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ingredients" className="text-slate-700">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    placeholder="List all ingredients separated by commas..."
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Pricing & Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-700">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="15.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comparePrice" className="text-slate-700">Compare at Price</Label>
                    <Input
                      id="comparePrice"
                      type="number"
                      step="0.01"
                      placeholder="19.99"
                      value={formData.comparePrice}
                      onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                      className="bg-gray-50 border-gray-200 focus:bg-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-200 flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">Upload product image</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-slate-700">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="JU-GG-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-slate-700">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-700">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Green Juices</SelectItem>
                      <SelectItem value="fruit">Fruit Juices</SelectItem>
                      <SelectItem value="detox">Detox Blends</SelectItem>
                      <SelectItem value="immunity">Immunity Boosters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="text-slate-700">
                    Product is active
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6"
          >
            {isEditing ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  </AdminLayout>
  );
};

export default AddProduct;
