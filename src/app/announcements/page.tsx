'use client';

import { useState, useMemo, useEffect } from 'react';
import { getPublishedAnnouncements, type Announcement } from '@/lib/announcements';
import AnnouncementCard from '@/components/AnnouncementCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const ITEMS_PER_PAGE = 6;

export default function AnnouncementsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const announcements = await getPublishedAnnouncements();
        setAllAnnouncements(announcements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    let filtered = allAnnouncements;

    if (searchQuery) {
      // Filter by search query
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPriority) {
      filtered = filtered.filter(announcement => announcement.priority === selectedPriority);
    }

    return filtered.sort((a, b) => {
      // Sort by priority first (urgent > important > normal)
      const priorityOrder = { urgent: 3, important: 2, normal: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Then sort by date (newest first)
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
  }, [allAnnouncements, searchQuery, selectedPriority]);

  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const currentAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16" style={{backgroundColor: '#791218'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                School Announcements
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
                Stay informed with important announcements and updates from Blossom International School. From policy changes to event notifications, find all essential information here.
              </p>
              
              {/* Search Field */}
              <div className="flex justify-center">
                <form onSubmit={handleSearch} className="w-full max-w-lg">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-20 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-300 bg-white/90 focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bottom-2 px-4 py-1 bg-white text-red-600 text-xs rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Priority Filter Section */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="w-full">
              <div className="flex flex-wrap gap-2 justify-start">
                <button
                  onClick={() => handlePriorityChange('')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedPriority === '' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  All Priorities
                </button>
                <button
                  onClick={() => handlePriorityChange('urgent')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedPriority === 'urgent' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  Urgent
                </button>
                <button
                  onClick={() => handlePriorityChange('important')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedPriority === 'important' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  Important
                </button>
                <button
                  onClick={() => handlePriorityChange('normal')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedPriority === 'normal' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  Normal
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredAnnouncements.length === 0 
                ? 'No announcements found matching your criteria.' 
                : `Showing ${Math.min(ITEMS_PER_PAGE, filteredAnnouncements.length - (currentPage - 1) * ITEMS_PER_PAGE)} of ${filteredAnnouncements.length} announcements`
              }
            </p>
          </div>

          {/* Announcements Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading announcements...</p>
            </div>
          ) : currentAnnouncements.length > 0 ? (
            <div className="news-grid">
              {currentAnnouncements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.id} 
                  announcement={announcement} 
                  showExcerpt={true} 
                  showCategory={false} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No announcements found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page 
                      ? 'text-white' 
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                  style={currentPage === page ? {backgroundColor: '#791218'} : {}}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
          </div>
        </section>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}