import ApplicationsContent from '../components/services/ApplicationsContent';
import HostingEmailContent from '../components/services/HostingEmailContent';
import WebDevelopmentContent from '../components/services/WebDevelopmentContent';
import { services } from '../data/services';
import DetailLayout from './DetailLayout';
export default function ServiceDetailPage({ service }: { service: typeof services[number] }) {
  if (service.slug === 'aplicaciones') return <DetailLayout section="servicios"><ApplicationsContent/></DetailLayout>;
  if (service.slug === 'desarrollo-web') return <DetailLayout section="servicios"><WebDevelopmentContent/></DetailLayout>;
  return <DetailLayout section="servicios"><HostingEmailContent/></DetailLayout>;
}
