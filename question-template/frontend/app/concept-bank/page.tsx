import type { Metadata } from 'next';
import ConceptBankPage from '@/components/concept-bank/ConceptBankPage';

export const metadata: Metadata = {
  title: 'Concept Template Bank | Rankers League',
  description:
    'Browse 36 competitive exams, 8,000+ concepts and 200,000+ parameterized templates — the foundation of Rankers League question generation.',
  openGraph: {
    title: 'Concept Template Bank | Rankers League',
    description: 'The largest concept template library for Indian and international competitive exams.',
  },
};

export default function ConceptBankRoute() {
  return <ConceptBankPage />;
}
