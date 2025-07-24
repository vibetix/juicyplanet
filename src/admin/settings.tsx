import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@juicyplanet.com"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="pt-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-slate-700">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-700">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <div className="pt-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Order Alerts</p>
                  <p className="text-sm text-slate-600">Get notified when new orders are placed</p>
                </div>
                <Switch
                  checked={orderAlerts}
                  onCheckedChange={setOrderAlerts}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Inventory Alerts</p>
                  <p className="text-sm text-slate-600">Get notified when inventory is low</p>
                </div>
                <Switch
                  checked={inventoryAlerts}
                  onCheckedChange={setInventoryAlerts}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Marketing Emails</p>
                  <p className="text-sm text-slate-600">Receive marketing and promotional emails</p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentProvider" className="text-slate-700">Payment Provider</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-slate-700">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-slate-700">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  placeholder="8.25"
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Delivery Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryZones" className="text-slate-700">Delivery Zones</Label>
                <Textarea
                  id="deliveryZones"
                  placeholder="Enter zip codes or areas you deliver to..."
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee" className="text-slate-700">Standard Delivery Fee</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    step="0.01"
                    placeholder="5.99"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeDeliveryThreshold" className="text-slate-700">Free Delivery Threshold</Label>
                  <Input
                    id="freeDeliveryThreshold"
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Email Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderConfirmation" className="text-slate-700">Order Confirmation</Label>
                <Textarea
                  id="orderConfirmation"
                  placeholder="Thank you for your order! Your order #{order_id} has been confirmed..."
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingNotification" className="text-slate-700">Shipping Notification</Label>
                <Textarea
                  id="shippingNotification"
                  placeholder="Your order has been shipped! Track your package using..."
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryConfirmation" className="text-slate-700">Delivery Confirmation</Label>
                <Textarea
                  id="deliveryConfirmation"
                  placeholder="Your order has been delivered! We hope you enjoy your fresh juices..."
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                  rows={4}
                />
              </div>
              <div className="pt-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Save Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </AdminLayout>
  );
};

export default Settings;
