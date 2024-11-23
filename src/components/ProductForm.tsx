import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onClose: () => void;
  initialData?: ProductFormData;
}

export default function ProductForm({ onSubmit, onClose, initialData }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: initialData ? {
      ...initialData,
      price: Number(initialData.price),
      stock: Number(initialData.stock),
      minStock: Number(initialData.minStock),
    } : undefined,
  });

  const onFormSubmit = (data: ProductFormData) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      minStock: Number(data.minStock),
    };
    onSubmit(formattedData);
    toast.success(`Product ₹{initialData ? 'updated' : 'added'} successfully`);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={20} />
        </button>
  
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {initialData ? 'Edit Product' : 'Add New Product'}
        </h2>
  
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
  
          {/* Category Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
              placeholder="Enter product category"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
  
          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' },
                  valueAsNumber: true,
                })}
                className="mt-1 block w-full rounded-md pl-10 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                placeholder="Enter price"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
  
          {/* Stock Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' },
                valueAsNumber: true,
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
              placeholder="Enter stock quantity"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>
  
          {/* Minimum Stock Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
            <input
              type="number"
              {...register('minStock', {
                required: 'Minimum stock is required',
                min: { value: 0, message: 'Minimum stock cannot be negative' },
                valueAsNumber: true,
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
              placeholder="Enter minimum stock"
            />
            {errors.minStock && (
              <p className="mt-1 text-sm text-red-600">{errors.minStock.message}</p>
            )}
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
            >
              {initialData ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}