import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <section className="bg-white py-16" style={{backgroundColor: '#791218'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Skeleton className="h-10 w-64 mx-auto mb-4 bg-white/20" />
              <div className="max-w-3xl mx-auto mb-8">
                <Skeleton className="h-5 w-full mb-2 bg-white/20" />
                <Skeleton className="h-5 w-3/4 mx-auto bg-white/20" />
              </div>
              
              {/* Search Field Skeleton */}
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  <Skeleton className="h-12 w-full rounded-lg bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Section Skeleton */}
        <section className="py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter Section Skeleton */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-full">
                <div className="flex flex-wrap gap-2 justify-start">
                  <Skeleton className="h-9 w-28 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-32 rounded-lg" />
                  <Skeleton className="h-9 w-28 rounded-lg" />
                  <Skeleton className="h-9 w-20 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Results Info Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-48" />
            </div>

            {/* News Grid Skeleton */}
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
          </div>
        </section>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  )
}