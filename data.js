// Mock Data for Job Application Platform

const mockData = {
    jobs: [
        {
            id: 1,
            company: "TechCorp Solutions",
            title: "Développeur Full Stack Senior",
            location: "Paris, France (Remote)",
            contractType: "CDI",
            salary: "55k - 70k €",
            source: "LinkedIn",
            compatibility: 92,
            description: "Nous recherchons un développeur Full Stack passionné pour rejoindre notre équipe. Vous travaillerez sur des projets innovants utilisant React, Node.js et PostgreSQL.",
            skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
            postedDate: "2026-01-15",
            remote: true
        },
        {
            id: 2,
            company: "DataFlow Analytics",
            title: "Ingénieur Data Senior",
            location: "Lyon, France (Hybride)",
            contractType: "CDI",
            salary: "60k - 75k €",
            source: "Welcome to the Jungle",
            compatibility: 88,
            description: "Rejoignez notre équipe data pour construire des pipelines de données robustes et des solutions d'analyse avancées.",
            skills: ["Python", "Spark", "AWS", "SQL"],
            postedDate: "2026-01-14",
            remote: false
        },
        {
            id: 3,
            company: "CloudNative Inc",
            title: "DevOps Engineer",
            location: "Remote (EU)",
            contractType: "CDI",
            salary: "50k - 65k €",
            source: "Indeed",
            compatibility: 85,
            description: "Nous cherchons un DevOps engineer pour améliorer notre infrastructure cloud et nos processus CI/CD.",
            skills: ["Kubernetes", "Docker", "Terraform", "AWS"],
            postedDate: "2026-01-13",
            remote: true
        },
        {
            id: 4,
            company: "FinTech Innovations",
            title: "Lead Frontend Developer",
            location: "Paris, France",
            contractType: "CDI",
            salary: "65k - 80k €",
            source: "LinkedIn",
            compatibility: 90,
            description: "Dirigez notre équipe frontend et créez des interfaces utilisateur exceptionnelles pour nos produits financiers.",
            skills: ["React", "TypeScript", "Next.js", "Tailwind"],
            postedDate: "2026-01-12",
            remote: false
        },
        {
            id: 5,
            company: "AI Startup Lab",
            title: "Machine Learning Engineer",
            location: "Remote (France)",
            contractType: "CDI",
            salary: "70k - 90k €",
            source: "Welcome to the Jungle",
            compatibility: 78,
            description: "Développez des modèles de ML innovants pour nos produits d'intelligence artificielle.",
            skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
            postedDate: "2026-01-11",
            remote: true
        },
        {
            id: 6,
            company: "E-Commerce Giants",
            title: "Backend Developer",
            location: "Bordeaux, France",
            contractType: "CDI",
            salary: "45k - 60k €",
            source: "Indeed",
            compatibility: 82,
            description: "Construisez des APIs scalables pour notre plateforme e-commerce en forte croissance.",
            skills: ["Java", "Spring Boot", "MongoDB", "Redis"],
            postedDate: "2026-01-10",
            remote: false
        },
        {
            id: 7,
            company: "Mobile First Studio",
            title: "React Native Developer",
            location: "Nantes, France (Hybride)",
            contractType: "CDI",
            salary: "48k - 62k €",
            source: "LinkedIn",
            compatibility: 86,
            description: "Créez des applications mobiles cross-platform pour nos clients prestigieux.",
            skills: ["React Native", "JavaScript", "iOS", "Android"],
            postedDate: "2026-01-09",
            remote: false
        },
        {
            id: 8,
            company: "Security Shield",
            title: "Cybersecurity Specialist",
            location: "Remote (France)",
            contractType: "CDI",
            salary: "58k - 75k €",
            source: "Welcome to the Jungle",
            compatibility: 75,
            description: "Protégez nos systèmes et nos données contre les menaces cybersécurité.",
            skills: ["Security", "Penetration Testing", "SIEM", "Python"],
            postedDate: "2026-01-08",
            remote: true
        }
    ],
    
    recruiters: [
        {
            id: 1,
            name: "Sophie Martin",
            email: "sophie.martin@techcorp.com",
            linkedin: "linkedin.com/in/sophiemartin",
            company: "TechCorp Solutions",
            position: "Tech Recruiter"
        },
        {
            id: 2,
            name: "Thomas Dubois",
            email: "t.dubois@dataflow.fr",
            linkedin: "linkedin.com/in/thomasdubois",
            company: "DataFlow Analytics",
            position: "Talent Acquisition Manager"
        },
        {
            id: 3,
            name: "Marie Laurent",
            email: "marie.l@cloudnative.io",
            linkedin: "linkedin.com/in/marielaurent",
            company: "CloudNative Inc",
            position: "HR Manager"
        }
    ],
    
    applications: [
        {
            id: 1,
            jobId: 1,
            status: "pending",
            createdDate: "2026-01-16",
            sentDate: null,
            responseDate: null,
            coverLetter: "Madame, Monsieur,\n\nJe me permets de vous adresser ma candidature...",
            customEmail: "Bonjour Sophie,\n\nJe suis très intéressé par le poste de Développeur Full Stack...",
            notes: "Entreprise très intéressante, stack moderne"
        },
        {
            id: 2,
            jobId: 2,
            status: "sent",
            createdDate: "2026-01-15",
            sentDate: "2026-01-16",
            responseDate: null,
            coverLetter: "Madame, Monsieur,\n\nPassionné par la data science...",
            customEmail: "Bonjour Thomas,\n\nVotre offre d'Ingénieur Data a retenu toute mon attention...",
            notes: "Relance prévue le 23/01"
        },
        {
            id: 3,
            jobId: 4,
            status: "responded",
            createdDate: "2026-01-14",
            sentDate: "2026-01-15",
            responseDate: "2026-01-17",
            coverLetter: "Madame, Monsieur,\n\nFort de mes expériences en développement frontend...",
            customEmail: "Bonjour,\n\nJe souhaite postuler au poste de Lead Frontend Developer...",
            notes: "Entretien prévu le 25/01 à 14h"
        },
        {
            id: 4,
            jobId: 3,
            status: "draft",
            createdDate: "2026-01-17",
            sentDate: null,
            responseDate: null,
            coverLetter: "",
            customEmail: "",
            notes: "À finaliser - vérifier les compétences Kubernetes"
        },
        {
            id: 5,
            jobId: 6,
            status: "draft",
            createdDate: "2026-01-18",
            sentDate: null,
            responseDate: null,
            coverLetter: "",
            customEmail: "",
            notes: ""
        }
    ],
    
    activityTimeline: [
        {
            date: "2026-01-19",
            time: "10:30",
            type: "job_found",
            title: "Nouvelle offre découverte",
            description: "Développeur Full Stack Senior chez TechCorp Solutions"
        },
        {
            date: "2026-01-18",
            time: "15:45",
            title: "Candidature préparée",
            description: "Brouillon créé pour DevOps Engineer chez CloudNative Inc"
        },
        {
            date: "2026-01-17",
            time: "09:15",
            title: "Réponse reçue",
            description: "FinTech Innovations a répondu à votre candidature"
        },
        {
            date: "2026-01-16",
            time: "14:20",
            title: "Candidature envoyée",
            description: "Ingénieur Data Senior chez DataFlow Analytics"
        },
        {
            date: "2026-01-15",
            time: "11:00",
            title: "Recruteur identifié",
            description: "Marie Laurent ajoutée pour CloudNative Inc"
        }
    ]
};

// Helper functions
function getJobById(id) {
    return mockData.jobs.find(job => job.id === id);
}

function getApplicationsByStatus(status) {
    return mockData.applications.filter(app => app.status === status);
}

function getApplicationWithJob(applicationId) {
    const application = mockData.applications.find(app => app.id === applicationId);
    if (!application) return null;
    
    const job = getJobById(application.jobId);
    return { ...application, job };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function formatDateTime(dateString, timeString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
    })} à ${timeString}`;
}

// Statistics calculations
function getStats() {
    const uniqueCompanies = new Set(mockData.jobs.map(job => job.company)).size;
    const totalApplications = mockData.applications.length;
    const draftCount = getApplicationsByStatus('draft').length;
    const pendingCount = getApplicationsByStatus('pending').length;
    const sentCount = getApplicationsByStatus('sent').length;
    const respondedCount = getApplicationsByStatus('responded').length;
    
    return {
        totalJobs: mockData.jobs.length,
        totalCompanies: uniqueCompanies,
        totalRecruiters: mockData.recruiters.length,
        totalApplications,
        draftCount,
        pendingCount,
        sentCount,
        respondedCount
    };
}
