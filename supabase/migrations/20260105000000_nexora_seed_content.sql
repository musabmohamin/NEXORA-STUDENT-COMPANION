-- NEXORA seed: units, projects, hackathon announcement, points rules.
-- All rows are real DB records, editable/deletable by Admin via RLS.
-- Idempotent via NOT EXISTS guards on natural keys.

insert into public.units (course_id, title, kind, order_index)
select c.id, v.title, 'lesson', v.ord
from (values
 ('INS101','Information as a resource',1),('INS101','Records and provenance',2),('INS101','Information lifecycle',3),
 ('INS103','Variables and control flow',1),('INS103','Functions and modularity',2),('INS103','Files and error handling',3),
 ('INS105','Sets and logic',1),('INS105','Relations and functions',2),('INS105','Counting and probability',3),
 ('INS102','Linear structures',1),('INS102','Trees and graphs',2),('INS102','Algorithmic complexity',3),
 ('INS104','Data representation',1),('INS104','Processor and memory',2),('INS104','I/O and interrupts',3),
 ('INS108','Semantic markup',1),('INS108','Responsive layout',2),('INS108','Client-side behaviour',3),
 ('INS201','Divide and conquer',1),('INS201','Greedy strategies',2),('INS201','Dynamic programming',3),
 ('INS203','Relational model',1),('INS203','SQL querying',2),('INS203','Transactions and indexing',3),
 ('INS205','Classes and objects',1),('INS205','Inheritance hierarchies',2),('INS205','Design by contract',3),
 ('INS202','Processes and threads',1),('INS202','Scheduling',2),('INS202','Memory and storage',3),
 ('INS204','Layered protocols',1),('INS204','Routing and addressing',2),('INS204','Network troubleshooting',3),
 ('INS206','Requirements and design',1),('INS206','Version control workflow',2),('INS206','Testing strategy',3),
 ('INS208','Descriptive statistics',1),('INS208','Probability distributions',2),('INS208','Statistical inference',3),
 ('INS301','Index construction',1),('INS301','Ranking models',2),('INS301','Retrieval evaluation',3),
 ('INS303','Usability heuristics',1),('INS303','Prototyping and testing',2),('INS303','Accessibility in practice',3),
 ('INS305','Replication',1),('INS305','Consistency tradeoffs',2),('INS305','Distributed coordination',3),
 ('INS307','Research questions',1),('INS307','Evidence and instruments',2),('INS307','Ethics and reporting',3),
 ('INS302','Compute and storage services',1),('INS302','Resilience patterns',2),('INS302','Observability and cost',3),
 ('INS304','Feature engineering',1),('INS304','Model training',2),('INS304','Evaluation and bias checks',3),
 ('INS306','Data preparation',1),('INS306','Pattern discovery',2),('INS306','Interpreting results',3),
 ('INS308','Threat modelling',1),('INS308','Authentication and access control',2),('INS308','Secure data handling',3),
 ('INS401','Query optimisation',1),('INS401','Distributed storage',2),('INS401','Concurrency control',3),
 ('INS403','Batch pipelines',1),('INS403','Stream processing',2),('INS403','Partitioning and tuning',3),
 ('INS405','Scope and schedule',1),('INS405','Risk and quality',2),('INS405','Stakeholder communication',3),
 ('INS407','Metadata and standards',1),('INS407','Repository services',2),('INS407','Preservation workflows',3),
 ('INS402','Problem definition',1),('INS402','Build and validate',2),('INS402','Communicate results',3),
 ('INS404','Knowledge capture',1),('INS404','Sharing mechanisms',2),('INS404','Measuring impact',3),
 ('INS406','Professional codes',1),('INS406','Copyright and licensing',2),('INS406','Responsible innovation',3),
 ('INS408','Capability mapping',1),('INS408','Integration architecture',2),('INS408','Governance and evolution',3)
) as v(code, title, ord)
join public.courses c on c.code = v.code
where not exists (select 1 from public.units u where u.course_id = c.id and u.order_index = v.ord);

insert into public.projects (course_id, title, level, requirements, deliverables, status)
select c.id, v.title, v.level, v.req, v.deliv, 'published'
from (values
 ('INS103','Student Grade Tracker','Beginner','Read CSV, compute statistics, write report.','CLI program, sample data, README'),
 ('INS102','Library Catalog Search Engine','Intermediate','Implement search and sort over a catalog dataset.','Data structures, tests, complexity notes'),
 ('INS108','Departmental Website Redesign','Beginner','Responsive multi-page site with accessibility checks.','Deployed site, screenshots, checklist'),
 ('INS203','Course Enrollment Database','Intermediate','Normalised schema with realistic queries.','ER diagram, SQL, seed data'),
 ('INS205','Campus Event Management System','Intermediate','OOP design for events, venues and registration.','Class diagram, source, tests'),
 ('INS206','Version Controlled Team Project','Intermediate','Git branching, code review, CI basics.','Repo history, PR notes, CI config'),
 ('INS301','Digital Library Search Prototype','Advanced','Index and rank a document collection.','Index, ranking code, evaluation report'),
 ('INS303','Usability Study of a Campus App','Advanced','Run tasks, collect metrics, propose fixes.','Study protocol, findings, redesign'),
 ('INS306','Research Data Mining Report','Advanced','Cluster and mine a real dataset.','Notebook, patterns, interpretation'),
 ('INS402','Capstone Research or Build','Advanced','Full project with defence.','Report, demo, documentation'),
 ('INS403','Distributed Analytics Pipeline','Advanced','Batch and stream processing on a dataset.','Pipeline, config, performance report'),
 ('INS405','IT Project Plan and Prototype','Intermediate','Plan and prototype a stakeholder need.','Project plan, prototype, risk log'),
 ('INS407','Digital Repository Metadata Model','Intermediate','Metadata schema and ingest workflow.','Schema, sample records, docs'),
 ('INS406','Open Knowledge Licensing Guide','Beginner','Compare licences and recommend one.','Guide, decision matrix, sources'),
 ('INS408','Enterprise Architecture Case Study','Advanced','Map capabilities and integration needs.','Architecture doc, diagrams, roadmap')
) as v(code, title, level, req, deliv)
join public.courses c on c.code = v.code
where not exists (select 1 from public.projects p where p.course_id = c.id and p.title = v.title);

insert into public.announcements (title, category, description, status, featured, external_url, deadline, location)
select 'Jimma University Hackathon 2026', 'hackathon',
 'A 48-hour build sprint for Information Science and Common Year students. Form teams, ship a working prototype, and present to judges. Open to all enrolled students.',
 'published', true, 'https://ju.edu.et', '2026-12-15T23:59:00+00:00', 'Jimma University Main Campus'
where not exists (select 1 from public.announcements a where a.title = 'Jimma University Hackathon 2026');

insert into public.points_rules (name, category, points, description) values
 ('Project Submitted', 'project', 20, 'Awarded when a project submission is created.'),
 ('Project Approved', 'project', 50, 'Awarded when a submission is approved.'),
 ('Unit Completed', 'learning', 5, 'Awarded for completing a learning unit.'),
 ('Team Joined', 'community', 10, 'Awarded when a collaboration join request is accepted.')
on conflict do nothing;
