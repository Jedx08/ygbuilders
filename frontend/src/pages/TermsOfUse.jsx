import Footer from "../components/Footer";

const TermsOfUse = () => {
  return (
    <div className="bg-light w-full h-hfull flex flex-col items-center justify-center pt-5 font-pops">
      <div className="font-bold text-oranges text-5xl pb-5">TERMS OF USE</div>
      <div className="bg-white w-[80%] rounded-md p-5 text-lg px-10">
        <p>
          <span className="font-semibold">Effective Date</span>: October 1st,
          2024 <br /> <br />
          These Terms of Use govern your access to and use of the online
          platform and services provided by YourGross. By using our website, you
          agree to comply with and be bound by these terms. It is imperative
          that you read them carefully, as they outline your rights and
          responsibilities as a user. Your adherence to these terms is essential
          in maintaining a safe and positive experience for all users. <br />{" "}
          <br />
          By accessing or using our website, you agree to comply with and be
          bound by these Terms of Use. <br /> <br />
          <span className="flex justify-center font-semibold text-xl py-1">
            User Responsibilities
          </span>{" "}
          <div className="px-10 py-3 bg-subCon rounded-lg">
            As a user of our online platform, you agree to the following
            responsibilities: <br /> <br />
            1. <span className="font-semibold">Accurate Information</span>{" "}
            <br />
            You are responsible for providing accurate, current, and complete
            information when registering for an account or using our services.
            Please update your information promptly if it changes. <br /> <br />
            2.{" "}
            <span className="font-semibold">
              Confidentiality of Account Information
            </span>{" "}
            <br />
            Maintain the confidentiality of your account credentials, including
            your password. Notify us immediately of any unauthorized use of your
            account or any security breaches. We are not liable for any loss or
            damage resulting from your failure to do so. <br /> <br />
            3. <span className="font-semibold">Compliance with Laws</span>{" "}
            <br />
            Use our platform in compliance with all applicable laws and
            regulations. This includes refraining from engaging in any unlawful
            activities, such as fraud, harassment, or discrimination. <br />{" "}
            <br />
            4. <span className="font-semibold">Prohibited Activities</span>{" "}
            <br />
            Do not engage in activities that could harm, disrupt, or interfere
            with our platform or the experience of other users. This includes
            spamming, distributing malware, or attempting to gain unauthorized
            access to our systems. <br /> <br />
            5.{" "}
            <span className="font-semibold">
              Intellectual Property Rights
            </span>{" "}
            <br />
            Acknowledge that all content, trademarks, and intellectual property
            on our platform are owned by YourGross or our licensors. Do not use,
            reproduce, or distribute any content without the necessary
            permissions.
          </div>
          <br /> <br />
          <span className="flex justify-center font-semibold text-xl">
            Disclaimers and Limitation of Liability
          </span>{" "}
          <br /> • <span className="font-semibold">No Guarantees</span> <br />
          While we strive to provide accurate and reliable information on our
          platform, we make no guarantees regarding the completeness, accuracy,
          or reliability of any content. The information provided is for general
          informational purposes only and should not be considered professional
          advice. <br /> <br />•{" "}
          <span className="font-semibold">Limitation of Liability</span> <br />
          To the maximum extent permitted by applicable law, YourGross shall not
          be liable for any direct, indirect, incidental, special,
          consequential, or punitive damages arising from your access to or use
          of our platform, including but not limited to damages for loss of
          profits, data, or other intangible losses. <br /> <br />•{" "}
          <span className="font-semibold">Third-Party Links</span> <br />
          Our platform may contain links to third-party websites or services
          that are not owned or controlled by YourGross. We are not responsible
          for the content, privacy policies, or practices of these third-party
          sites. We encourage you to review the terms and policies of any
          third-party sites you visit. <br /> <br />•{" "}
          <span className="font-semibold">Indemnification</span> <br />
          You agree to indemnify and hold harmless YourGross, its affiliates,
          and their respective officers, directors, employees, and agents from
          any claims, losses, damages, liabilities, costs, or expenses
          (including reasonable attorneys&apos; fees) arising from your use of
          our platform, your violation of these Terms of Use, or your
          infringement of any rights of another party. <br /> <br />•{" "}
          <span className="font-semibold">Changes to Services</span> <br />
          We reserve the right to modify or discontinue our services at any
          time, without prior notice. We shall not be liable to you or any third
          party for any modification, suspension, or discontinuation of our
          services. <br /> <br />
          <span className="flex justify-center font-semibold text-xl py-1">
            Governing Law
          </span>{" "}
          <div className="px-10 py-3 bg-subCon rounded-lg">
            These Terms of Use shall be governed by and construed in accordance
            with the laws of the Republic of the Philippines, without regard to
            its conflict of law principles. By using our platform, you agree
            that any disputes arising out of or relating to these terms, your
            access to or use of our services, or any related matters shall be
            subject to the exclusive jurisdiction of the courts of Antipolo. You
            consent to the personal jurisdiction of such courts and waive any
            objections to their jurisdiction. Additionally, any claims or causes
            of action must be brought within one (1) year after the claim
            arises, or such claims will be barred. By using our services, you
            acknowledge that you have read and understood this Governing Law
            section and agree to its terms.
          </div>
        </p>
      </div>
      <div className="w-full mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default TermsOfUse;
