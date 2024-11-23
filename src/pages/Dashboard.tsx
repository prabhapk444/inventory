import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Plus,
  FileText,
  AlertCircle
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa'; 
import { useProductStore } from '../lib/store';

export default function Dashboard() {
  const products = useProductStore((state) => state.products);

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.stock <= p.minStock).length,
    totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0),
    categories: new Set(products.map(p => p.category)).size
  };

  const recentActivity = products
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  const lowStockItems = products
    .filter(p => p.stock <= p.minStock)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{stats.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FaRupeeSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.categories}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/products"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-50 rounded-full">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-700">Add Product</span>
          </Link>

          <Link
            to="/reports"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-50 rounded-full">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-700">Generate Report</span>
          </Link>

          <Link
            to="/products"
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-red-50 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-medium text-gray-700">View </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(product.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Stock: {product.stock}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-red-600">
                      Current Stock: {product.stock} (Min: {product.minStock})
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="px-3 py-1 text-sm font-medium text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
                  >
                    Update
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No low stock alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}