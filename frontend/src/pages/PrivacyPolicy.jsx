import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="bg-light w-full h-hfull flex flex-col items-center justify-center pt-5 font-pops">
      <div className=" font-bold text-greens text-5xl pb-5">PRIVACY POLICY</div>
      <div className="bg-white w-[80%] rounded-md p-5 text-lg px-10">
        <p>
          <span className="font-semibold">Effective Date</span>: October 1st,
          2024 <br /> <br /> YourGross, from the name itself, it is a website
          designed to help small business owners track their personal and
          business income. This Privacy Policy outlines how YourGross collects,
          uses, and protects your personal information when you visit our
          website yourgross.ph. <br /> <br />{" "}
          <span className="flex justify-center font-semibold text-xl py-1">
            Information Collection
          </span>{" "}
          <div className="px-10 py-3 bg-subCon rounded-lg">
            We collect personal information, including your name, email address,
            and financial data, when you register for and use our services.
          </div>{" "}
          <br /> <span className="font-semibold">Use of Information</span>{" "}
          <br /> <br />
          Your information may be used to: <br /> • Provide our services <br />{" "}
          • Notify users when needed <br /> • Deliver customer support <br /> •
          Identify, prevent, and resolve technical issues <br /> • Improve our
          service <br /> <br />{" "}
          <span className="flex justify-center font-semibold text-xl py-1">
            Data Sharing and Security
          </span>{" "}
          <div className="px-10 py-3 bg-subCon rounded-lg">
            {" "}
            We are committed to ensuring the security of your personal
            information in compliance with the Data Privacy Act of 2012 (RA
            10173). To protect your data from unauthorized access, alteration,
            or disclosure, we implement comprehensive security measures,
            including encryption, secure server environments, and regular
            security assessments. <br /> <br /> We adhere to industry-standard
            protocols to safeguard your information during transmission and
            storage. Our team conducts periodic reviews and updates of our
            security practices to address emerging threats and ensure the
            continued protection of your data. <br /> <br /> As part of our
            services, we utilize Google AdSense for advertising purposes. We
            want to inform you that Google may collect and use certain
            information about your browsing behavior for ad personalization. We
            encourage you to review Google’s privacy policies and settings to
            manage your preferences. <br /> <br /> Your privacy is our priority.
            We assure you that your personal information will be handled with
            the utmost care and will only be shared with authorized third
            parties when necessary, and with your explicit consent. We are
            committed to maintaining transparency about how your data is used
            and stored.
          </div>{" "}
          <br /> <br />{" "}
          <span className="flex justify-center font-semibold text-xl">
            User Rights
          </span>{" "}
          <br /> As a user of our services, you have certain rights regarding
          your personal information in accordance with the Data Privacy Act of
          2012. <br /> These rights include: <br /> <br /> 1.{" "}
          <span className="font-semibold">Right to Access</span>: You have the
          right to request access to the personal information we hold about you.
          This includes the ability to obtain information about how your data is
          being processed, the purposes for which it is being used, and any
          third parties with whom it may be shared. <br /> <br /> 2.{" "}
          <span className="font-semibold">Right to Correct</span>: If you
          believe that any of your personal information is inaccurate,
          incomplete, or outdated, you have the right to request correction. We
          encourage you to keep your information updated to ensure accuracy.{" "}
          <br /> <br /> 3.{" "}
          <span className="font-semibold">Right to Erasure</span>: You have the
          right to request the deletion of your personal information in certain
          circumstances, such as when the data is no longer necessary for the
          purposes for which it was collected, or if you withdraw your consent.{" "}
          <br /> <br />
          4. <span className="font-semibold">Right to Object</span>: You have
          the right to object to the processing of your personal information for
          direct marketing purposes or any processing that is not based on
          legitimate interests. If you wish to exercise this right, please
          contact us. <br /> <br /> 5.{" "}
          <span className="font-semibold">Right to Data Portability</span>: You
          have the right to request a copy of your personal information in a
          structured, commonly used, and machine-readable format. This allows
          you to transfer your data to another service provider if you wish.{" "}
          <br /> <br /> 6.{" "}
          <span className="font-semibold">Right to Withdraw Consent</span>: If
          you have provided consent for us to process your personal information,
          you have the right to withdraw that consent at any time. This
          withdrawal will not affect the lawfulness of any processing carried
          out before your withdrawal. <br /> <br /> 7.{" "}
          <span className="font-semibold">
            Right to Delete Account and Clear Data
          </span>
          : You have the right to delete your account and clear your data
          through the settings page on our website. When you choose to delete
          your account, all associated personal information will be permanently
          removed from our systems, unless retention is required by law or
          legitimate business purposes. <br /> <br />
          To exercise any of these rights, please contact us at
          support@yourgross.ph. We will respond to your request within a
          reasonable timeframe and in accordance with applicable laws. Your
          rights are important to us, and we are committed to ensuring that they
          are respected and upheld. <br /> <br />
          <span className="flex justify-center font-semibold text-xl py-1">
            Contact Us
          </span>{" "}
          <div className="px-10 py-3 bg-subCon rounded-lg">
            If you have any questions, concerns, or if you would like to know
            what kind of information we are storing regarding your user, about
            this Privacy Policy, please contact us at: <br />
            <span className="font-semibold">Email</span>:{" "}
            <a href="mailto:admin@yourgross.ph" className="text-[#399CB4]">
              support@yourgross.ph
            </a>
          </div>
          <br />
        </p>
      </div>
      <div className="w-full mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
