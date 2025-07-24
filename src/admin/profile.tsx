// src/pages/Profile.tsx
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-600 mt-2">View and update your personal information</p>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
              <Input id="firstName" placeholder="John" className="bg-gray-50 border-gray-200 focus:bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
              <Input id="lastName" placeholder="Doe" className="bg-gray-50 border-gray-200 focus:bg-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Email Address</Label>
            <Input id="email" type="email" placeholder="admin@juicyplanet.com" className="bg-gray-50 border-gray-200 focus:bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
            <Input id="phone" placeholder="+1 (555) 123-4567" className="bg-gray-50 border-gray-200 focus:bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-700">Short Bio</Label>
            <Textarea id="bio" placeholder="A few words about you..." className="bg-gray-50 border-gray-200 focus:bg-white" rows={3} />
          </div>
          <div className="pt-4">
            <Button className="bg-green-500 hover:bg-green-600 text-white">Update Profile</Button>
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
            <Input id="currentPassword" type="password" className="bg-gray-50 border-gray-200 focus:bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-slate-700">New Password</Label>
            <Input id="newPassword" type="password" className="bg-gray-50 border-gray-200 focus:bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" className="bg-gray-50 border-gray-200 focus:bg-white" />
          </div>
          <div className="pt-4">
            <Button className="bg-green-500 hover:bg-green-600 text-white">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
  );
};

export default Profile;
