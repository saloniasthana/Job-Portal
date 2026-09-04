import LegalLayout from '../../components/layout/LegalLayout';

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="September 2026">
      <p>
        These terms are placeholder content for Hirely, a demo job portal built as a portfolio/learning
        project. By creating an account you agree to use the app as intended — a working example, not a
        production hiring platform.
      </p>

      <section>
        <h2>Accounts</h2>
        <p>
          You're responsible for the accuracy of the information in your profile and job postings. Don't
          use another person's identity or post misleading job listings.
        </p>
      </section>

      <section>
        <h2>Content</h2>
        <p>
          Job postings, resumes, and profile content should be your own and not infringe on anyone else's
          rights. Content may be removed if it violates this.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          This is a demo application provided as-is, without guarantees of uptime, data retention, or
          fitness for real hiring decisions.
        </p>
      </section>
    </LegalLayout>
  );
}
