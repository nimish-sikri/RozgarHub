import { jobTypes } from "@/lib/job-types";
import prisma from "@/lib/prisma";
import { JobFilterValues, jobFilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import Image from 'next/image'
import logo from '@/assets/QR.png'

/*filterJobs: An asynchronous function that handles form submission.
"use server": Indicates this function should run on the server.
formData: Receives form data.
Object.fromEntries: Converts form data entries to an object.
jobFilterSchema.parse: Validates and parses form data.
searchParams: Constructs URL search parameters based on form inputs.
redirect: Redirects the user to the filtered job listings page. */
async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

/*Defines the props for the JobFilterSidebar component.
defaultValues: Initial values for the form fields, typed with JobFilterValues. */
interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}

/*JobFilterSidebar: An asynchronous functional component.
defaultValues: Receives initial form values as props.
distinctLocations: Queries the database for distinct approved job locations. */
export default async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  const distinctLocations = (await prisma?.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

/*aside: Wrapper element for the sidebar with styling classes.
form: HTML form element with an action that calls filterJobs on submission. */
  return (
    <aside className="lg:sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[250px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">

          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues?.q}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type" 
              defaultValue={defaultValues?.type || ""}
            >
              <option value="">All types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues?.location || ""}
            >
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues?.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full bg-black font-bold text-white">
            Filter jobs
          </FormSubmitButton>
          <h1 className="text-black font-bold text-center ">Donate Us</h1>
          <Image
          src={logo}
          width={500}
          height={500}
          alt="Picture of the author"
          />
          <h1 className="text-black text-center ">Help Us to manage this portal</h1>
        </div>
      </form>
    </aside>
  );
}
