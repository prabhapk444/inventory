import React, { useState } from 'react';
import { useProductStore } from '../lib/store';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download, Filter } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function Reports() {
  const products = useProductStore((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [reportType, setReportType] = useState('stock');

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    const productDate = new Date(product.lastUpdated);
    const cutoffDate = subDays(new Date(), parseInt(dateRange));
    return productDate >= cutoffDate;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    const title = `${reportType === 'stock' ? 'Stock Levels' : 'Low Stock'} Report`;
    const subtitle = `Category: ${selectedCategory} | Date Range: Last ${dateRange} days`;
    doc.setFontSize(20);
    doc.text(title, 14, 20);
    doc.setFontSize(12);
    doc.text(subtitle, 14, 30);
    const tableData = filteredProducts
      .filter((p) => reportType === 'stock' || p.stock <= p.minStock)
      .map((product, index) => [
        index + 1, 
        product.name,
        product.category,
        product.stock.toString(),
        product.minStock.toString(),
        `Rs ${product.price.toFixed(2)}`,
        format(new Date(product.lastUpdated), 'MM/dd/yyyy')
      ]);
  
    autoTable(doc, {
      head: [['S.No', 'Name', 'Category', 'Stock', 'Min Stock', 'Price', 'Last Updated']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });
 
    doc.save('inventory-report.pdf');
  };
  
  
  
  const getReportSummary = () => {
    const total = filteredProducts.length;
    const lowStock = filteredProducts.filter(p => p.stock <= p.minStock).length;
    const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    return { total, lowStock, totalValue };
  };

  const summary = getReportSummary();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="stock">Stock Levels</option>
              <option value="lowStock">Low Stock Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generatePDF}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.lowStock}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <Filter className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{summary.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Download className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <h2 className="text-xl font-semibold mb-4">Report Preview</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            S.No
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Min Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Updated
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredProducts
          .filter((p) => reportType === 'stock' || p.stock <= p.minStock)
          .map((product, index) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.stock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.minStock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(product.lastUpdated), 'MM/dd/yyyy')}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
</div>
</div>
  );
}