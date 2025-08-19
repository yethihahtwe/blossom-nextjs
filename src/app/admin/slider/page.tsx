'use client';

import { useState, useEffect } from 'react';
import { SliderImage } from '@/lib/slider';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface SliderFormData {
  title: string;
  alt_text: string;
  image_url: string;
  is_active: boolean;
}

export default function SliderManagement() {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null);
  const [formData, setFormData] = useState<SliderFormData>({
    title: '',
    alt_text: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/slider');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingImage 
        ? `/api/admin/slider/${editingImage.id}`
        : '/api/admin/slider';
      
      const method = editingImage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          display_order: editingImage?.display_order || images.length + 1
        }),
      });

      if (response.ok) {
        await fetchImages();
        setShowForm(false);
        setEditingImage(null);
        setFormData({
          title: '',
          alt_text: '',
          image_url: '',
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleEdit = (image: SliderImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      alt_text: image.alt_text,
      image_url: image.image_url,
      is_active: image.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/admin/slider/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchImages();
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [reorderedItem] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, reorderedItem);

    setImages(reorderedImages);

    try {
      await fetch('/api/admin/slider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reorder',
          imageIds: reorderedImages.map(img => img.id)
        }),
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      fetchImages();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Slider Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Add New Image
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingImage ? 'Edit Image' : 'Add New Image'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingImage(null);
                    setFormData({
                      title: '',
                      alt_text: '',
                      image_url: '',
                      is_active: true
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingImage ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Slider Images</h2>
          <p className="text-sm text-gray-600">Drag and drop to reorder images</p>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slider-images">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 border-b flex items-center space-x-4 ${
                          snapshot.isDragging ? 'bg-blue-50' : 'bg-white'
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="text-gray-400 hover:text-gray-600 cursor-grab"
                        >
                          ⋮⋮
                        </div>
                        
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={image.image_url}
                            alt={image.alt_text}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{image.title}</h3>
                          <p className="text-sm text-gray-600">{image.alt_text}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            image.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {image.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(image)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-300 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}