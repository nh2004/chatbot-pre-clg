import React from "react";

export const FooterDesktop = (): JSX.Element => {
  // Footer link data for mapping (Corrected a duplicate "Quora" link for clarity)
  const footerSections = [
    {
      title: "About",
      links: [
        { text: "Who are we?", href: "#" },
        { text: "Business Relation", href: "#" },
        { text: "Contact Us", href: "#" },
      ],
    },
    {
      title: "Socials",
      links: [
        { text: "Instagram", href: "#" },
        { text: "Reddit", href: "#" },
        { text: "Facebook", href: "#" },
        { text: "Quora", href: "#" },
      ],
    },
    {
      title: "Policies",
      links: [
        { text: "Privacy Policy", href: "#" },
        { text: "Terms & Conditions", href: "#" },
        { text: "Cancellation & Refund", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#020b13] flex justify-center w-full">
      {/* 
        - We use padding (py-16) instead of a fixed height (h-[344px]) to let content define the height.
        - max-w-[1512px] is kept to constrain width on very large screens.
        - px-6 provides horizontal padding on all screen sizes.
      */}
      <div className="w-full max-w-[1512px] h-auto px-6 py-16 md:py-20">
        {/* 
          Main container using Flexbox.
          - Mobile (default): 'flex-col' stacks items vertically and 'items-center' centers them. 'gap-10' adds space.
          - Large screens ('lg:'): 'flex-row' arranges items horizontally, 'justify-between' pushes them to the edges, and 'items-start' aligns them to the top.
        */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 lg:gap-8">

          {/* Logo and tagline section */}
          <div className="flex flex-col items-center lg:items-start gap-3.5 text-center lg:text-left">
            <img
              className="relative w-32 h-[34px] object-cover"
              alt="Precollege Logo"
              src="/image.png" // Make sure this path is correct
            />
            <p className="font-['Inter',Helvetica] font-normal text-[#a0a9be] text-sm leading-[18.9px]">
              Get started by booking a call
              <br />
              with our mentors
            </p>
            <button

              className="text-yellow-500 hover:text-yellow-600 font-semibold cursor-pointer focus:outline-none"
            >
              BOOK A CALL
            </button>
          </div>

          {/* 
            Footer links container.
            - Mobile (default): 'flex-col' stacks the sections vertically with 'gap-10'.
            - Medium screens ('md:'): 'flex-row' arranges sections side-by-side with 'gap-12'.
          */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-10 md:gap-12">
            {footerSections.map((section) => (
              <div
                key={section.title}
                className="flex flex-col items-center md:items-start gap-4"
              >
                <h3 className="font-['Inter',Helvetica] font-semibold text-white text-lg leading-[18px]">
                  {section.title}
                </h3>
                <div className="flex flex-col items-center md:items-start gap-4">
                  {section.links.map((link) => (
                    <a
                      key={link.text}
                      href={link.href}
                      className="font-['Inter',Helvetica] font-normal text-[#a0a9be] text-base leading-4 hover:text-white transition-colors duration-200"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};