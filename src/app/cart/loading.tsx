export default function CartLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-secondary-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 py-4">
                <div className="w-20 h-20 bg-secondary-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary-200 rounded w-3/4" />
                  <div className="h-4 bg-secondary-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="h-48 bg-secondary-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
