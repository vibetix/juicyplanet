import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mail, Clock, User } from "lucide-react";

const messages = [
  {
    id: 1,
    customer: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    subject: "Issue with my recent order",
    status: "new",
    priority: "high",
    lastMessage: "Hi, I received my order but one of the juices was missing...",
    date: "2024-01-20 14:30",
  },
  {
    id: 2,
    customer: "Mike Chen",
    email: "mike.chen@email.com",
    subject: "Subscription delivery schedule",
    status: "replied",
    priority: "medium",
    lastMessage: "Thank you for the quick response! That helps clarify...",
    date: "2024-01-20 11:15",
  },
  {
    id: 3,
    customer: "Emma Davis",
    email: "emma.davis@email.com",
    subject: "Dietary restrictions question",
    status: "closed",
    priority: "low",
    lastMessage: "Perfect, thank you for confirming the ingredients list.",
    date: "2024-01-19 16:45",
  },
];

const cannedResponses = [
  "Thank you for contacting us. We're looking into your issue and will get back to you shortly.",
  "We apologize for any inconvenience. Let me help you resolve this issue right away.",
  "Your order has been processed and should arrive within 2-3 business days.",
  "We'd be happy to help you modify your subscription preferences.",
];

const Support = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-700";
      case "replied":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Support & Messages</h1>
        <p className="text-slate-600 mt-2">Manage customer inquiries and support tickets</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">New Messages</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
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
                <p className="text-sm text-slate-600">Pending Response</p>
                <p className="text-2xl font-bold text-slate-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Resolved Today</p>
                <p className="text-2xl font-bold text-slate-900">15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-slate-900">2.3h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Messages ({filteredMessages.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedMessage.id === message.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-slate-900 text-sm">{message.customer}</h4>
                      <div className="flex gap-1">
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">{message.subject}</p>
                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">{message.lastMessage}</p>
                    <p className="text-xs text-slate-500">{message.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Detail & Reply */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">{selectedMessage.subject}</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    From: {selectedMessage.customer} ({selectedMessage.email})
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(selectedMessage.status)}>
                    {selectedMessage.status}
                  </Badge>
                  <Badge className={getPriorityColor(selectedMessage.priority)}>
                    {selectedMessage.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-slate-700">{selectedMessage.lastMessage}</p>
                <p className="text-sm text-slate-500 mt-2">{selectedMessage.date}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Quick Responses</label>
                <div className="flex flex-wrap gap-2">
                  {cannedResponses.map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyText(response)}
                      className="text-xs"
                    >
                      Response {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:bg-white min-h-32"
                rows={6}
              />
              <div className="flex items-center justify-between">
                <Select defaultValue="replied">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="replied">Mark as Replied</SelectItem>
                    <SelectItem value="closed">Mark as Closed</SelectItem>
                    <SelectItem value="new">Keep as New</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Send Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default Support;
