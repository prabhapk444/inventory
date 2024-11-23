import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit,
  ArrowUpDown,
  AlertTriangle 
} from 'lucide-react';
import { useProductStore } from '../lib/store';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  lastUpdated: string;
}

export default function Products() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  const { products, addProduct, updateProduct, deleteProduct, bulkDeleteProducts } = useProductStore();

  const handleSort = (key: keyof Product) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    return [...products]
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [products, searchTerm, sortConfig]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete selected products?')) {
      bulkDeleteProducts(selectedProducts);
      setSelectedProducts([]);
      toast.success('Selected products deleted successfully');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredAndSortedProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Product }) => (
    <ArrowUpDown
      size={16}
      className={`inline ml-1 cursor-pointer ₹{
        sortConfig.key === columnKey ? 'text-blue-600' : 'text-gray-400'
      }`}
      onClick={() => handleSort(columnKey)}
    />
  );

  const formatPrice = (price: number) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Selected
            </button>
          )}
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredAndSortedProducts.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name <SortIcon columnKey="name" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category <SortIcon columnKey="category" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price <SortIcon columnKey="price" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock <SortIcon columnKey="stock" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{formatPrice(product.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.stock <= product.minStock ? (
                    <span className="flex items-center text-red-600">
                      <AlertTriangle size={16} className="mr-1" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-green-600">In Stock</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          onSubmit={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
            } else {
              addProduct(data);
            }
            setShowForm(false);
          }}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}