const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const CardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            <div className="h-3 bg-surface-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="h-3 bg-surface-200 rounded"></div>
          <div className="h-3 bg-surface-200 rounded w-5/6"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-8 bg-surface-200 rounded flex-1"></div>
          <div className="h-8 bg-surface-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="bg-white rounded-lg shadow-card border border-surface-200 p-4">
      <div className="animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            <div className="h-3 bg-surface-200 rounded w-1/2"></div>
          </div>
          <div className="w-16 h-6 bg-surface-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {type === 'card' ? <CardSkeleton /> : <ListSkeleton />}
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader