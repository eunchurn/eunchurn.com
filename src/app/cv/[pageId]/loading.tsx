import React from "react";

export default function CVPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Loading CV Section</h2>
        <p className="text-gray-600">Please wait while we load this section...</p>
      </div>
    </div>
  );
}
