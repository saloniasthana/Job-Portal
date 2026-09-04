import LegalLayout from '../../components/layout/LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 2026">
      <p>
        Hirely is a student/portfolio project built to demonstrate a full-stack job portal. This page is a
        placeholder describing, in plain terms, what data the demo app stores and why — it isn't a
        legally-binding policy for a real company.
      </p>

      <section>
        <h2>What we store</h2>
        <ul>
          <li>Account info: name, email, hashed password, and account role (candidate or recruiter)</li>
          <li>Candidate profile: headline, bio, skills, and an uploaded resume file</li>
          <li>Recruiter profile: company name, description, and website</li>
          <li>Activity: jobs you post or apply to, and jobs you save for later</li>
        </ul>
      </section>

      <section>
        <h2>How it's used</h2>
        <p>
          Data is used only to run the app's features — matching candidates to jobs, showing recruiters
          their applicants, and keeping you logged in. Nothing is sold or shared with third parties.
        </p>
      </section>

      <section>
        <h2>Your control</h2>
        <p>
          You can update your profile at any time, and can ask for your account and its data to be removed.
        </p>
      </section>
    </LegalLayout>
  );
}
