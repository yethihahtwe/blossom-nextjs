'use client';

import { useState, useMemo, useEffect } from 'react';
import { getPublishedNews, getNewsCategories, searchNews, getNewsByCategory } from '@/lib/news';
import { type News } from '@/lib/supabase';
import NewsCard from '@/components/NewsCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allNews, setAllNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [newsData, categoriesData] = await Promise.all([
          getPublishedNews(),
          getNewsCategories()
        ]);
        setAllNews(newsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading news data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const [filteredNews, setFilteredNews] = useState<News[]>([]);

  // Handle filtering
  useEffect(() => {
    const filterNews = async () => {
      try {
        let filtered: News[] = [];

        if (searchQuery) {
          // Use search function for search queries
          filtered = await searchNews(searchQuery);
          
          // Apply category filter to search results if category is selected
          if (selectedCategory) {
            filtered = filtered.filter(news => news.category === selectedCategory);
          }
        } else if (selectedCategory) {
          // Use category function if only category is selected
          filtered = await getNewsByCategory(selectedCategory);
        } else {
          // Use all news if no filters
          filtered = allNews;
        }

        setFilteredNews(filtered);
      } catch (error) {
        console.error('Error filtering news:', error);
        setFilteredNews([]);
      }
    };

    if (!loading) {
      filterNews();
    }
  }, [allNews, searchQuery, selectedCategory, loading]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const currentNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
                School News
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
                Stay updated with the latest news and events at Blossom International School. From academic achievements to school announcements, discover what's happening in our vibrant school community.
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
                      placeholder="Search articles..."
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

        {/* News Section */}
        <section className="py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Section */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="w-full">
              <div className="flex flex-wrap gap-2 justify-start">
                {loading ? (
                  <>
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        selectedCategory === '' 
                          ? 'bg-red-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          selectedCategory === category 
                            ? 'bg-red-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {category}
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
                {filteredNews.length === 0 
                  ? 'No news found matching your criteria.' 
                  : `Showing ${Math.min(ITEMS_PER_PAGE, filteredNews.length - (currentPage - 1) * ITEMS_PER_PAGE)} of ${filteredNews.length} articles`
                }
              </p>
            )}
          </div>

          {/* News Grid */}
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
                    
                    {/* Category and reading time skeleton */}
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentNews.length > 0 ? (
            <div className="news-grid">
              {currentNews.map((news) => (
                <NewsCard 
                  key={news.id} 
                  news={news} 
                  showExcerpt={true} 
                  showCategory={true} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No news articles found.</p>
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
