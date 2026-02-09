export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted/30 rounded mt-2 animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress card skeleton */}
          <div className="card-glass p-6 rounded-2xl">
            <div className="flex justify-between mb-4">
              <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
              <div className="h-6 w-24 bg-muted/30 rounded animate-pulse" />
            </div>
            <div className="h-2 w-full bg-muted/30 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="h-8 w-12 mx-auto bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 w-16 mx-auto bg-muted/30 rounded mt-2 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Register trade skeleton */}
          <div className="card-glass p-6 rounded-2xl">
            <div className="h-6 w-32 bg-muted/50 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-muted/30 rounded-xl animate-pulse" />
              <div className="h-32 bg-muted/30 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div className="card-glass p-6 rounded-2xl">
            <div className="h-6 w-32 bg-muted/50 rounded mb-4 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
