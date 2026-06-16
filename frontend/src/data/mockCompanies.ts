// Mock Company Data for Fund Manager
export type Department = 'Infrastructure' | 'Health' | 'Education';

export interface Company {
    id: string;
    name: string;
    email: string;
    department: Department;
    isVerified: boolean;
}

const infrastructureCompanies: Company[] = [
    { id: 'inf-001', name: 'Navayuga Engineering', email: 'contact@navayuga.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-002', name: 'L&T Roads Division', email: 'roads@lnt.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-003', name: 'GMR Infrastructure', email: 'projects@gmr.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-004', name: 'IVRCL Constructions', email: 'info@ivrcl.com', department: 'Infrastructure', isVerified: false },
    { id: 'inf-005', name: 'Ashoka Buildcon', email: 'bids@ashoka.co.in', department: 'Infrastructure', isVerified: true },
    { id: 'inf-006', name: 'IRB Infrastructure', email: 'contracts@irb.co.in', department: 'Infrastructure', isVerified: true },
    { id: 'inf-007', name: 'Dilip Buildcon', email: 'tender@dilipbuild.com', department: 'Infrastructure', isVerified: false },
    { id: 'inf-008', name: 'PNC Infratech', email: 'contact@pncinfra.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-009', name: 'Sadbhav Engineering', email: 'projects@sadbhav.in', department: 'Infrastructure', isVerified: true },
    { id: 'inf-010', name: 'KNR Constructions', email: 'info@knrcl.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-011', name: 'Gayatri Projects', email: 'gayatri@projects.com', department: 'Infrastructure', isVerified: false },
    { id: 'inf-012', name: 'NCC Limited', email: 'contracts@ncc.co.in', department: 'Infrastructure', isVerified: true },
    { id: 'inf-013', name: 'JMC Projects', email: 'bids@jmcprojects.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-014', name: 'Hindustan Construction', email: 'hcc@construction.in', department: 'Infrastructure', isVerified: true },
    { id: 'inf-015', name: 'Afcons Infrastructure', email: 'afcons@infra.com', department: 'Infrastructure', isVerified: false },
    { id: 'inf-016', name: 'Welspun Enterprises', email: 'roads@welspun.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-017', name: 'Simplex Infrastructure', email: 'simplex@infra.co.in', department: 'Infrastructure', isVerified: true },
    { id: 'inf-018', name: 'Apco Infratech', email: 'contact@apco.in', department: 'Infrastructure', isVerified: false },
    { id: 'inf-019', name: 'Oriental Structural', email: 'orient@structural.com', department: 'Infrastructure', isVerified: true },
    { id: 'inf-020', name: 'BL Kashyap Sons', email: 'blk@construction.in', department: 'Infrastructure', isVerified: true },
];

const healthCompanies: Company[] = [
    { id: 'hlt-001', name: 'Apollo Health Projects', email: 'projects@apollo.com', department: 'Health', isVerified: true },
    { id: 'hlt-002', name: 'Max Healthcare Infra', email: 'infra@maxhealth.in', department: 'Health', isVerified: true },
    { id: 'hlt-003', name: 'Fortis Building Corp', email: 'construction@fortis.com', department: 'Health', isVerified: true },
    { id: 'hlt-004', name: 'Narayana Health Build', email: 'builds@narayana.org', department: 'Health', isVerified: false },
    { id: 'hlt-005', name: 'Manipal Infra Group', email: 'projects@manipal.edu', department: 'Health', isVerified: true },
    { id: 'hlt-006', name: 'KIMS Construction', email: 'build@kims.co.in', department: 'Health', isVerified: true },
    { id: 'hlt-007', name: 'Medanta Facilities', email: 'facilities@medanta.org', department: 'Health', isVerified: false },
    { id: 'hlt-008', name: 'Aster DM Projects', email: 'projects@asterdm.com', department: 'Health', isVerified: true },
    { id: 'hlt-009', name: 'Global Hospitals Infra', email: 'infra@globalhospitals.in', department: 'Health', isVerified: true },
    { id: 'hlt-010', name: 'Care Hospital Build', email: 'build@carehospitals.com', department: 'Health', isVerified: true },
    { id: 'hlt-011', name: 'Yashoda Health Infra', email: 'infra@yashodahospitals.com', department: 'Health', isVerified: false },
    { id: 'hlt-012', name: 'Columbia Asia Projects', email: 'projects@columbiaasia.com', department: 'Health', isVerified: true },
    { id: 'hlt-013', name: 'Shalby Hospital Build', email: 'construction@shalby.org', department: 'Health', isVerified: true },
    { id: 'hlt-014', name: 'Sterling Hospitals', email: 'build@sterlinghospitals.com', department: 'Health', isVerified: true },
    { id: 'hlt-015', name: 'Rainbow Children Infra', email: 'infra@rainbowhospitals.in', department: 'Health', isVerified: false },
    { id: 'hlt-016', name: 'Cloudnine Healthcare', email: 'projects@cloudnine.co.in', department: 'Health', isVerified: true },
    { id: 'hlt-017', name: 'Sahyadri Hospitals', email: 'build@sahyadri.in', department: 'Health', isVerified: true },
    { id: 'hlt-018', name: 'AMRI Hospitals Infra', email: 'infra@amrihospitals.in', department: 'Health', isVerified: false },
    { id: 'hlt-019', name: 'Wockhardt Build Corp', email: 'construction@wockhardt.com', department: 'Health', isVerified: true },
    { id: 'hlt-020', name: 'Paras Healthcare', email: 'projects@parashospitals.com', department: 'Health', isVerified: true },
];

const educationCompanies: Company[] = [
    { id: 'edu-001', name: 'Byju\'s Infra Division', email: 'infra@byjus.com', department: 'Education', isVerified: true },
    { id: 'edu-002', name: 'Narayana Edu Build', email: 'build@narayanaedu.in', department: 'Education', isVerified: true },
    { id: 'edu-003', name: 'Chaitanya Construction', email: 'projects@srichaitanya.net', department: 'Education', isVerified: true },
    { id: 'edu-004', name: 'FIITJEE Infrastructure', email: 'infra@fiitjee.com', department: 'Education', isVerified: false },
    { id: 'edu-005', name: 'Allen Career Builds', email: 'construction@allen.ac.in', department: 'Education', isVerified: true },
    { id: 'edu-006', name: 'Resonance Edu Infra', email: 'build@resonance.ac.in', department: 'Education', isVerified: true },
    { id: 'edu-007', name: 'Aakash Institute Projects', email: 'projects@aakash.ac.in', department: 'Education', isVerified: false },
    { id: 'edu-008', name: 'Vedantu Campus Build', email: 'campus@vedantu.com', department: 'Education', isVerified: true },
    { id: 'edu-009', name: 'Unacademy Facilities', email: 'facilities@unacademy.com', department: 'Education', isVerified: true },
    { id: 'edu-010', name: 'Amity Construction', email: 'build@amity.edu', department: 'Education', isVerified: true },
    { id: 'edu-011', name: 'Shiv Nadar Edu Infra', email: 'infra@shivnadar.org', department: 'Education', isVerified: false },
    { id: 'edu-012', name: 'BITS Pilani Projects', email: 'projects@bits-pilani.ac.in', department: 'Education', isVerified: true },
    { id: 'edu-013', name: 'Manipal Edu Build', email: 'construction@manipal.edu', department: 'Education', isVerified: true },
    { id: 'edu-014', name: 'VIT Infrastructure', email: 'infra@vit.ac.in', department: 'Education', isVerified: true },
    { id: 'edu-015', name: 'SRM Edu Projects', email: 'projects@srmist.edu.in', department: 'Education', isVerified: false },
    { id: 'edu-016', name: 'Lovely Professional', email: 'build@lpu.co.in', department: 'Education', isVerified: true },
    { id: 'edu-017', name: 'Christ University', email: 'infra@christuniversity.in', department: 'Education', isVerified: true },
    { id: 'edu-018', name: 'Symbiosis Constructions', email: 'construction@symbiosis.ac.in', department: 'Education', isVerified: false },
    { id: 'edu-019', name: 'IIIT Infra Projects', email: 'projects@iiit.ac.in', department: 'Education', isVerified: true },
    { id: 'edu-020', name: 'Kalinga Institute Build', email: 'build@kiit.ac.in', department: 'Education', isVerified: true },
];

export const mockCompanies: Company[] = [
    ...infrastructureCompanies,
    ...healthCompanies,
    ...educationCompanies,
];

export const getCompaniesByDepartment = (department: Department): Company[] => {
    return mockCompanies.filter(c => c.department === department);
};
