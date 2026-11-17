import { projects } from '../data/projects';
import { SectionHead } from './UI';
import ProjectCard from './ProjectCard';

export default function Portfolio() {
	return (
		<section id="proyectos" className="portfolio section portfolio-showcase">
			<div className="container">
				<SectionHead eyebrow="DEL CÓDIGO AL MUNDO REAL" title="Proyectos reales">
					Algunos negocios y empresas que ya cuentan con soluciones desarrolladas por RX23 Digital.
				</SectionHead>
				<div className="projects-grid portfolio-showcase-grid">
					{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.name} />)}
				</div>
			</div>
		</section>
	);
}
