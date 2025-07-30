import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-12" />
                <span className="text-gray-500">/</span>
                <Skeleton className="h-4 w-12" />
                <span className="text-gray-500">/</span>
                <Skeleton className="h-4 w-48" />
              </div>
            </nav>
          </div>
        </div>

        {/* Article Content Skeleton */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Skeleton */}
            <div className="p-8">
              {/* Category Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              
              {/* Title Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-3/4" />
              </div>
              
              {/* Meta info Skeleton */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Skeleton className="h-4 w-24" />
                <span>•</span>
                <Skeleton className="h-4 w-32" />
                <span>•</span>
                <Skeleton className="h-4 w-20" />
              </div>
              
              {/* Excerpt Skeleton */}
              <div className="mb-8">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </div>

            {/* Featured Image Skeleton */}
            <Skeleton className="h-96 w-full" />

            {/* Content Skeleton */}
            <div className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                
                <div className="py-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>

          {/* Related Articles Skeleton */}
          <div className="mt-12">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to News Button Skeleton */}
          <div className="mt-8 text-center">
            <Skeleton className="h-12 w-40 mx-auto rounded-lg" />
          </div>
        </article>
      </div>
      <Footer />
    </div>
  )
}