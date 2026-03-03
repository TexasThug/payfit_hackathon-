const CTASection = () => {
  return (
    <section className="bg-accent py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Automatisez votre paie avec PayFit
        </h2>
        <p className="text-text-secondary mb-8 max-w-lg mx-auto">
          Fiches de paie générées en 1 clic, déclarations URSSAF automatiques, conformité garantie.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://payfit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            Démarrer gratuitement →
          </a>
          <a
            href="https://payfit.com/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-accent transition-colors"
          >
            Voir une démo
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
