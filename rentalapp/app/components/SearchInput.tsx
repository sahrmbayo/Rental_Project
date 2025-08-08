'use client';

import { Search } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // This function is "debounced". It waits for the user to stop
  // typing for 300ms before it runs. This is very efficient because
  // it prevents sending a new search request on every single keystroke.
  const handleSearch = useDebouncedCallback((term: string) => {
    // Create a URLSearchParams object to easily manage the query string
    const params = new URLSearchParams(searchParams);

    // If the user typed something, set the 'search' parameter
    if (term) {
      params.set('search', term);
    } else {
      // If the input is empty, remove the 'search' parameter
      params.delete('search');
    }

    // Update the browser's URL without a full page reload
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id="search"
        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
        type="search"
        onChange={(e) => handleSearch(e.target.value)}
        // This makes sure the search bar shows the current search term
        // if the user reloads the page or navigates back.
        defaultValue={searchParams.get('search')?.toString()}
      />
    </div>
  );
}
