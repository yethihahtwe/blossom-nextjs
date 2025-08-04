'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />
}

interface ViewPageProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  data: {
    title: string
    excerpt?: string
    content: string
    status: string
    published_at: string
    updated_at?: string
    view_count?: number
    category?: string
    priority?: string
  }
  onEdit?: () => void
  getStatusBadge: (status: string) => React.ReactNode
  formatDate: (date: string) => string
}

const ViewPage: React.FC<ViewPageProps> = ({
  title,
  description,
  isOpen,
  onClose,
  data,
  onEdit,
  getStatusBadge,
  formatDate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[90vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 admin-panel" data-admin-panel>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white admin-panel">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-gray-600 dark:text-gray-400 admin-panel">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-6 admin-panel">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Title</h3>
            <p className="text-gray-700 dark:text-gray-300">{data.title}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excerpt</h3>
            <p className="text-gray-700 dark:text-gray-300">{data.excerpt || 'No excerpt available.'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content</h3>
            <div 
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-white dark:bg-white px-4 py-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Status</h3>
              <div>{getStatusBadge(data.status)}</div>
            </div>
            {data.view_count !== undefined && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Views</h3>
                <p className="text-gray-700 dark:text-gray-300">{data.view_count || 0}</p>
              </div>
            )}
            {data.category && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Category</h3>
                <p className="text-gray-700 dark:text-gray-300">{data.category}</p>
              </div>
            )}
            {data.priority && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Priority</h3>
                <p className="text-gray-700 dark:text-gray-300">{data.priority}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Published Date</h3>
              <p className="text-gray-700 dark:text-gray-300">{formatDate(data.published_at)}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Last Updated</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {data.updated_at ? formatDate(data.updated_at) : 'Never'}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="admin-panel"
          >
            Close
          </Button>
          {onEdit && (
            <Button 
              onClick={() => {
                onClose()
                onEdit()
              }}
              className="bg-green-600 hover:bg-green-700 text-white admin-panel"
            >
              Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ViewPage }

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' container={document.body} {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot='dialog-portal'>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          'admin-panel bg-white dark:bg-gray-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot='dialog-close'
            className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className='sr-only'>Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-header'
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('text-lg leading-none font-semibold text-gray-900 dark:text-white', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn('text-gray-600 dark:text-gray-300 text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
