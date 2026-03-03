import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    q: 'Comment calculer son salaire net à partir du brut ?',
    a: 'Votre salaire net = salaire brut − cotisations salariales (environ 21-23% hors mutuelle). En 2025 avec les taux URSSAF/AGIRC-ARRCO en vigueur : net ≈ brut × 0,78 en moyenne pour un salaire sous le Plafond Sécu (3 925 €/mois). Ce ratio baisse légèrement pour les hauts salaires (T2 AGIRC-ARRCO).',
  },
  {
    q: 'Quelle est la différence entre net imposable et net à payer ?',
    a: 'Le net imposable est la base de calcul de votre impôt sur le revenu (déclaré automatiquement). Le net à payer est la somme réellement virée sur votre compte — il peut différer si votre prélèvement à la source apparaît séparément.',
  },
  {
    q: 'Pourquoi un CDD coûte-t-il plus cher à l\'employeur ?',
    a: 'Pour tout CDD, l\'employeur verse une indemnité de précarité de 10% du brut total en fin de contrat. En plus, une majoration chômage patronale s\'applique sur les CDD courts : +3% si durée ≤ 1 mois, +1,5% si durée entre 1 et 3 mois. Aucune majoration au-delà de 3 mois.',
  },
  {
    q: 'Qu\'est-ce que la réduction Fillon ?',
    a: 'Un allègement de charges patronales pour les salaires ≤ 1,6 SMIC (~2 883€ brut/mois). Au niveau du SMIC, il peut atteindre ~32% du salaire brut, réduisant significativement le coût employeur.',
  },
  {
    q: 'La CSG est-elle déductible des impôts ?',
    a: 'Partiellement. La CSG déductible (6,80%) réduit votre revenu imposable automatiquement. La CSG non déductible (2,40%) et la CRDS (0,50%) ne sont pas déductibles — vous êtes imposé dessus.',
  },
];

const FAQ = () => {
  return (
    <section className="px-4 md:px-6 max-w-3xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Questions fréquentes</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="payfit-card !p-0 border border-border overflow-hidden">
            <AccordionTrigger className="px-5 py-4 text-left text-sm font-medium hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
