'use client';

import { useState, useEffect } from 'react';
import { announcementsService } from '@/lib/services/announcements.service';
import { type Announcement } from '@/lib/supabase';
import { Priority } from '@/lib/types/content';
import { ContentCard, announcementFormatters } from '@/components/ui/content-card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 6;

export default function AnnouncementsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriority, setSelectedPriority] = useState<Priority | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [announcementsData, prioritiesData] = await Promise.all([
          announcementsService.getOrderedByPriority(), // Use priority-ordered retrieval
          announcementsService.getPriorities()
        ]);
        setAllAnnouncements(announcementsData);
        setPriorities(prioritiesData);
      } catch (error) {
        console.error('Error loading announcements data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle filtering
  useEffect(() => {
    const filterAnnouncements = async () => {
      try {
        let filtered: Announcement[] = [];

        if (searchQuery) {
          // Use search function for search queries
          filtered = await announcementsService.search(searchQuery);
          
          // Apply priority filter to search results if priority is selected
          if (selectedPriority) {
            filtered = filtered.filter(announcement => announcement.priority === selectedPriority);
          }
        } else if (selectedPriority) {
          // Use priority function if only priority is selected
          filtered = await announcementsService.getByPriority(selectedPriority);
        } else {
          // Use all announcements if no filters
          filtered = allAnnouncements;
        }

        setFilteredAnnouncements(filtered);
      } catch (error) {
        console.error('Error filtering announcements:', error);
        setFilteredAnnouncements([]);
      }
    };

    if (!loading) {
      filterAnnouncements();
    }
  }, [allAnnouncements, searchQuery, selectedPriority, loading]);

  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const currentAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority: Priority | '') => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const getPriorityDisplayName = (priority: Priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getPriorityButtonClass = (priority: Priority | '', isSelected: boolean) => {
    const baseClass = 'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200';
    
    if (isSelected) {
      const selectedClasses = {
        '': 'bg-red-600 text-white shadow-md',
        'urgent': 'bg-red-600 text-white shadow-md',
        'important': 'bg-yellow-600 text-white shadow-md', 
        'normal': 'bg-blue-600 text-white shadow-md'
      };
      return `${baseClass} ${selectedClasses[priority]}`;
    }
    
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200`;
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
                {loading ? (
                  <>
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handlePriorityChange('')}
                      className={getPriorityButtonClass('', selectedPriority === '')}
                    >
                      All Priorities
                    </button>
                    {priorities.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handlePriorityChange(priority)}
                        className={getPriorityButtonClass(priority, selectedPriority === priority)}
                      >
                        {getPriorityDisplayName(priority)}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            {loading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <p className="text-gray-600">
                {filteredAnnouncements.length === 0 
                  ? 'No announcements found matching your criteria.' 
                  : `Showing ${Math.min(ITEMS_PER_PAGE, filteredAnnouncements.length - (currentPage - 1) * ITEMS_PER_PAGE)} of ${filteredAnnouncements.length} announcements`
                }
              </p>
            )}
          </div>

          {/* Announcements Grid */}
          {loading ? (
            <div className="news-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="news-card-article">
                  {/* Image skeleton */}
                  <Skeleton className="news-image-container" />
                  
                  {/* Content skeleton */}
                  <div className="news-content-container">
                    {/* Date skeleton */}
                    <Skeleton className="h-4 w-24 mb-3" />
                    
                    {/* Title skeleton */}
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    
                    {/* Excerpt skeleton */}
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    
                    {/* Priority badge skeleton */}
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentAnnouncements.length > 0 ? (
            <div className="news-grid">
              {currentAnnouncements.map((announcement) => (
                <ContentCard 
                  key={announcement.id} 
                  content={announcement} 
                  showExcerpt={true} 
                  formatters={announcementFormatters}
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