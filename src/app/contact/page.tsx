"use client"
// import React, { useState } from "react";

// interface ContactFormData {
//   name: string;
//   email: string;
//   message: string;
// }

// const ContactUs: React.FC = () => {
//   const [formData, setFormData] = useState<ContactFormData>({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Here you can handle form submission, e.g., send data to backend
//     console.log(formData);
//     // Reset form data after submission
//     setFormData({ name: "", email: "", message: "" });
//   };

//   return (
//     <div>
//       <h1>Contact Us</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="message">Message:</label>
//           <textarea
//             id="message"
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default ContactUs;
import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import ContactForm from "@/components/contactForm/ContactFormWrapper"; // Changed import path and removed curly braces
import H1 from "@/components/ui/h1";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <H1 className="text-6xl text-center my-10">
          Contact Us
        </H1>
        <div className="container mx-auto my-10 max-w-7xl cpx-4 sm:px-6 lg:px-60">
          <ContactForm /> {/* Changed component name to ContactForm */}
        </div>
      </main>
    </div>
  );
};

export default Home;
