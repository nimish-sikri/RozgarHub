import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/h1";
import { JobFilterValues } from "@/lib/validation";
import { Metadata } from "next";
import './globals.css';
import 'tailwindcss/tailwind.css';
/*PageProps: Defines the shape of the props that the Home component will receive. This includes optional search parameters like q, type, location, remote, and page. */
interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
}

/**getTitle: A function that generates the page title based on the provided filter values.
titlePrefix: Determines the prefix of the title based on the presence of q, type, and remote values.
titleSuffix: Adds a suffix to the title if a location is provided.
Return: Combines titlePrefix and titleSuffix to form the complete title.
 */
function getTitle({ q, type, location, remote }: JobFilterValues) {
  const titlePrefix = q
    ? `${q} jobs`
    : type
      ? `${type} developer jobs`
      : remote
        ? "Remote developer jobs"
        : "All developer jobs";

  const titleSuffix = location ? ` in ${location}` : "";

  return `${titlePrefix}${titleSuffix}`;
}
/*
generateMetadata: Generates metadata for the page based on search parameters.
Parameters: Destructures searchParams from PageProps.
Return: Returns an object with a title property that uses the getTitle function to create a descriptive page title and appends | Dev Naukri.
*/
export function generateMetadata({
  searchParams: { q, type, location, remote },
}: PageProps): Metadata {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
    })} | Rozgar Hub`,
  };
}

/*
 Home: The main component of the page.
Parameters: Destructures searchParams from PageProps to get q, type, location, remote, and page.
filterValues: Constructs a JobFilterValues object with the search parameters, converting remote to a boolean.
Return: Returns the JSX for the main content of the page.
<main>: The main container with some styling classes.
<div>: Contains the page title and a subtitle.
<H1>: Uses the getTitle function to display the title.
<p>: Displays a subtitle.
<section>: A flex container for the sidebar and job results.
<JobFilterSidebar>: Renders the sidebar component with defaultValues.
<JobResults>: Renders the job results component with filterValues and the parsed page number.
 */
export default async function Home({
  searchParams: { q, type, location, remote, page },
}: PageProps) {
  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: remote === "true",
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3 min-h-full">
      <div className="space-y-5 text-center">
        <H1>{getTitle(filterValues)}</H1>
        <p className="text-muted-foreground">Black & White that can fill colours in your life</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults filterValues={filterValues} page={page ? parseInt(page) : undefined}/>
      </section>
      <div className="space-y-5 text-center">
  <p className="text-muted-foreground font-bold">Join the community of 1000s of satisfied Job Seekers...</p>
</div>

    </main>
  );
}
