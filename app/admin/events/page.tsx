'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'football' | 'basketball' | 'concert';
  team1?: string | null;
  team2?: string | null;
  team1Flag?: string | null;
  team2Flag?: string | null;
  artistName?: string | null;
  artistImageUrl?: string | null;
  date: string;
  venue: string;
  price: number;
  description?: string | null;
  remainingQty: number;
  createdAt: string;
}

interface EventFormData {
  title: string;
  type: 'football' | 'basketball' | 'concert' | '';
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  artistName: string;
  artistImageUrl: string;
  date: string;
  venue: string;
  price: number | string;
  description: string;
  remainingQty: number | string;
}

interface FormErrors {
  title?: string;
  type?: string;
  date?: string;
  venue?: string;
  price?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    type: '',
    team1: '',
    team2: '',
    team1Flag: '',
    team2Flag: '',
    artistName: '',
    artistImageUrl: '',
    date: '',
    venue: '',
    price: '',
    description: '',
    remainingQty: 1000,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: '',
      type: '',
      team1: '',
      team2: '',
      team1Flag: '',
      team2Flag: '',
      artistName: '',
      artistImageUrl: '',
      date: '',
      venue: '',
      price: '',
      description: '',
      remainingQty: 1000,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (event: Event) => {
    setModalMode('edit');
    setSelectedEvent(event);
    // Format date for datetime-local input
    const dateObj = new Date(event.date);
    const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    setFormData({
      title: event.title,
      type: event.type,
      team1: event.team1 || '',
      team2: event.team2 || '',
      team1Flag: event.team1Flag || '',
      team2Flag: event.team2Flag || '',
      artistName: event.artistName || '',
      artistImageUrl: event.artistImageUrl || '',
      date: localDate,
      venue: event.venue,
      price: event.price,
      description: event.description || '',
      remainingQty: event.remainingQty,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      type: '',
      team1: '',
      team2: '',
      team1Flag: '',
      team2Flag: '',
      artistName: '',
      artistImageUrl: '',
      date: '',
      venue: '',
      price: '',
      description: '',
      remainingQty: 1000,
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.type) {
      errors.type = 'Type is required';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.venue.trim()) {
      errors.venue = 'Venue is required';
    }

    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum)) {
      errors.price = 'Price is required';
    } else if (priceNum <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        title: formData.title.trim(),
        type: formData.type,
        date: new Date(formData.date).toISOString(),
        venue: formData.venue.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        remainingQty: Number(formData.remainingQty),
      };

      // Add type-specific fields
      if (formData.type === 'football' || formData.type === 'basketball') {
        payload.team1 = formData.team1.trim() || null;
        payload.team2 = formData.team2.trim() || null;
        if (formData.type === 'football') {
          payload.team1Flag = formData.team1Flag.trim() || null;
          payload.team2Flag = formData.team2Flag.trim() || null;
        }
      } else if (formData.type === 'concert') {
        payload.artistName = formData.artistName.trim() || null;
        payload.artistImageUrl = formData.artistImageUrl.trim() || null;
      }

      let response;
      
      if (modalMode === 'create') {
        response = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/admin/events/${selectedEvent?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          setFormErrors(errorData.errors);
        } else {
          throw new Error(errorData.error || 'Failed to save event');
        }
        return;
      }

      // Success - refresh event list and close modal
      await fetchEvents();
      closeModal();
    } catch (err) {
      console.error('Error saving event:', err);
      setFormErrors({ title: 'Failed to save event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      const response = await fetch(`/api/admin/events/${eventToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Success - refresh event list and close modal
      await fetchEvents();
      closeDeleteConfirm();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'football':
        return 'bg-green-100 text-green-800';
      case 'basketball':
        return 'bg-orange-100 text-orange-800';
      case 'concert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-2">Manage football, basketball, and concert events</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No events found. Create your first event!
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    {event.type === 'concert' && event.artistName && (
                      <div className="text-sm text-gray-500">{event.artistName}</div>
                    )}
                    {(event.type === 'football' || event.type === 'basketball') && event.team1 && event.team2 && (
                      <div className="text-sm text-gray-500">{event.team1} vs {event.team2}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {event.venue}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    ${event.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit event"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(event)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Create Event' : 'Edit Event'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Event title"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="concert">Concert</option>
                  </select>
                  {formErrors.type && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                  )}
                </div>

                {/* Conditional Fields for Sports */}
                {(formData.type === 'football' || formData.type === 'basketball') && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team 1
                        </label>
                        <input
                          type="text"
                          value={formData.team1}
                          onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Team 1 name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team 2
                        </label>
                        <input
                          type="text"
                          value={formData.team2}
                          onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Team 2 name"
                        />
                      </div>
                    </div>

                    {formData.type === 'football' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Team 1 Flag URL
                          </label>
                          <input
                            type="text"
                            value={formData.team1Flag}
                            onChange={(e) => setFormData({ ...formData, team1Flag: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://flagcdn.com/w40/us.png"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Team 2 Flag URL
                          </label>
                          <input
                            type="text"
                            value={formData.team2Flag}
                            onChange={(e) => setFormData({ ...formData, team2Flag: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://flagcdn.com/w40/ca.png"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Conditional Fields for Concert */}
                {formData.type === 'concert' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artist Name
                      </label>
                      <input
                        type="text"
                        value={formData.artistName}
                        onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Artist or band name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artist Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.artistImageUrl}
                        onChange={(e) => setFormData({ ...formData, artistImageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/artist.jpg"
                      />
                    </div>
                  </>
                )}

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                  )}
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.venue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Stadium or venue name"
                  />
                  {formErrors.venue && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.venue}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                {/* Remaining Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remaining Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.remainingQty}
                    onChange={(e) => setFormData({ ...formData, remainingQty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Event description"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Event</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{eventToDelete.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
