"use server";


import prisma from "@/lib/prisma";
import { toSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validation";
import { put } from "@vercel/blob";  //Function to upload a file to Vercel Blob.
import { nanoid } from "nanoid"; // Function to generate unique IDs.
import { redirect } from "next/navigation";
import path from "path"; //Node.js module for working with file paths.


export async function createJobPosting(formData: FormData) { //This function is responsible for creating a new job posting.
    const values = Object.fromEntries(formData.entries()); //Convert the FormData object to a plain JavaScript object using Object.fromEntries. This allows easier access to form field values.

    //Destructure relevant form field values from the parsed FormData using the createJobSchema validation schema.
    const {
        title,
        type,
        companyName,
        companyLogo,
        locationType,
        location,
        applicationEmail,
        applicationUrl,
        description,
        salary,
      } = createJobSchema.parse(values);

      const slug = `${toSlug(title)}-${nanoid(10)}`; //Generate a unique slug for the job post by combining a slugified version of the job title with a random nanoid.

    //Check if a company logo file was provided. If so, upload it to Vercel Blob storage and obtain the URL.
      let companyLogoUrl: string | undefined = undefined;
      if (companyLogo) {
        //The file is uploaded to a folder named company_logos with a filename derived from the job's slug and the original file's extension.
        const blob = await put(
            `company_logos/${slug}${path.extname(companyLogo.name)}`,
            companyLogo,
            {
            access: "public",
            addRandomSuffix: false,
            },
        );
        companyLogoUrl = blob.url;
    }

    //Using Prisma, create a new job entry in the database with the provided data.
    await prisma.job.create({
        data: {
          slug,
          title: title.trim(),
          type,
          companyName: companyName.trim(),
          companyLogoUrl,
          locationType,
          location,
          applicationEmail: applicationEmail?.trim(),
          applicationUrl: applicationUrl,
          description: description?.trim(),
          salary: parseInt(salary),
        },
    });
      
    //Redirect the user to the "job-submitted" page after successfully creating the job post.
    redirect("/job-submitted");
}
