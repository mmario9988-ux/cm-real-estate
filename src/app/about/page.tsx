export const metadata = {
  title: "About Us | Chiang Mai Estates",
  description: "Learn about our real estate agency based in Chiang Mai.",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">About Chiang Mai Estates</h1>
        
        <div className="bg-white dark:bg-primary-900/10 p-8 md:p-12 rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 dark:border-primary-800/50">
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
            <p className="lead text-xl text-primary-700 font-medium mb-6">
              Founded with a passion for both modern architecture and traditional Lanna heritage, Chiang Mai Estates is the premier real estate agency in Northern Thailand.
            </p>
            
            <p className="mb-4">
              Our team consists of lifelong locals and expats who fell in love with this city. We understand the nuances of the Chiang Mai property market, from the bustling streets of Nimman to the tranquil mountains of Hang Dong and Mae Rim.
            </p>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Mission</h3>
            <p className="mb-4">
              To curate the finest living experiences for our clients by blending local expertise with an international standard of service. We don't just find houses; we find homes that match your desired lifestyle in the Rose of the North.
            </p>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Choose Us</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>Deep Local Knowledge:</strong> We know every soi, every view, and the future development plans for the city.</li>
              <li><strong>Legal Expertise:</strong> Navigating Thai property law can be complex. Our partnered legal team ensures a safe and transparent transaction.</li>
              <li><strong>Curated Portfolio:</strong> We selectively accept listings to ensure our portfolio represents the true quality of Chiang Mai living.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
