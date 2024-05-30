import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link"; //Component for client-side navigation in Next.js.
import JobListItem from "./JobListItem";


///JobResults component
//JobResultsProps: Defines the props expected by JobResults component, including filterValues and an optional page number.
interface JobResultsProps {
    filterValues: JobFilterValues;
    page?: number;
}

// JobResults: The main component that fetches and displays job listings based on filter values and pagination.
export default async function JobResults({
    filterValues,
    page = 1,
} : JobResultsProps) {
    const {q, type, location, remote} = filterValues;
    const jobsPerPage = 6;
    const skip = (page - 1) * jobsPerPage;

    const searchString = q 
        ?.split(" ")
        .filter((word) => word.length > 0)
        .join(" & ");
    
//searchString: Converts the search query into a format suitable for a full-text search in Prisma.
//searchFilter: Constructs a filter for full-text search across multiple fields.
const searchFilter : Prisma.JobWhereInput = searchString
    ? {
        OR:[
            { title: { search: searchString } },
            { companyName: { search: searchString } },
            { type: { search: searchString } },
            { locationType: { search: searchString } },
            { location: { search: searchString } },
        ],
        }
    : {};
    // Constructs the main filter object combining various conditions.
    const where: Prisma.JobWhereInput = {
        AND: [
            searchFilter,
            type ? { type } : {},
            location ? { location } : {},
            remote ? { locationType: "Remote" } : {},
            { approved: true },
        ],
    };
    //Creates promises for fetching jobs and their count.
    const jobsPromise = prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: jobsPerPage,
        skip,
    });
    // Waits for both promises to resolve.
    const countPromise = prisma.job.count({ where });

    const [jobs, totalResults] = await Promise.all([jobsPromise, countPromise]);


    return (
        <div className="grow space-y-4">
            {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
                <JobListItem job={job} />
            </Link>
            ))}
            {jobs.length === 0 && (
            <p className="m-auto text-center">
                No jobs found. Try adjusting your search filters.
            </p>
            )}
            {jobs.length > 0 && (
            <Pagination
                currentPage={page}
                totalPages={Math.ceil(totalResults / jobsPerPage)}
                filterValues={filterValues}
            />
            )}
        </div>
    );
}


//Pagination Component
/**
 * PaginationProps: Defines the props expected by the Pagination component, including currentPage, totalPages, and filterValues.
Pagination: The component that handles pagination controls.
generatePageLink: Generates a link for a given page number, including all current filter values.
Return JSX: Renders the pagination controls.
Previous Page Link: Navigates to the previous page, hidden if on the first page.
Page Information: Displays the current page and total pages.
Next Page Link: Navigates to the next page, hidden if on the last page.

 */
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    filterValues: JobFilterValues;
  }
  
  function Pagination({
    currentPage,
    totalPages,
    filterValues: { q, type, location, remote },
  }: PaginationProps) {
    function generatePageLink(page: number) {
      const searchParams = new URLSearchParams({
        ...(q && { q }),
        ...(type && { type }),
        ...(location && { location }),
        ...(remote && { remote: "true" }),
        page: page.toString(),
      });
  
      return `/?${searchParams.toString()}`;
    }
  
    return (
      <div className="flex justify-between">
        <Link
          href={generatePageLink(currentPage - 1)}
          className={cn(
            "flex items-center gap-2 font-semibold",
            currentPage <= 1 && "invisible",
          )}
        >
          <ArrowLeft size={16} />
          Previous page
        </Link>
        <span className="font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Link
          href={generatePageLink(currentPage + 1)}
          className={cn(
            "flex items-center gap-2 font-semibold",
            currentPage >= totalPages && "invisible",
          )}
        >
          Next page
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }
  