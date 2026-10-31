-- NEXORA seed: departments, academic years, semesters, courses.
-- Seeded as real rows so Admin can edit/delete everything (no frontend hardcode).
-- Idempotent: ON CONFLICT DO NOTHING on natural keys.

insert into public.departments (id, name, slug, description, icon, status) values
  ('00000000-0000-4000-8000-0000000000d1', 'Freshman (Common Year 1)', 'freshman', 'Shared first-year common programme for all first-cycle students. Year I Semester I + Semester II.', 'Users', 'active'),
  ('00000000-0000-4000-8000-0000000000d2', 'Information Science', 'information-science', 'BSc in Information Science: retrieval, databases, digital libraries and data systems across Years II to IV.', 'BookOpenText', 'active'),
  ('00000000-0000-4000-8000-0000000000d3', 'Computer Science', 'computer-science', 'BSc in Computer Science. Programme page opens soon.', 'Code', 'coming_soon'),
  ('00000000-0000-4000-8000-0000000000d4', 'Software Engineering', 'software-engineering', 'BSc in Software Engineering. Programme page opens soon.', 'Terminal', 'coming_soon'),
  ('00000000-0000-4000-8000-0000000000d5', 'Economics', 'economics', 'BA in Economics. Programme page opens soon.', 'ChartBar', 'coming_soon')
on conflict (slug) do nothing;

insert into public.academic_years (id, department_id, name, year_number) values
  ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000d1', 'Year I (Common)', 1),
  ('00000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-0000000000d2', 'Year II', 2),
  ('00000000-0000-4000-8000-0000000000a3', '00000000-0000-4000-8000-0000000000d2', 'Year III', 3),
  ('00000000-0000-4000-8000-0000000000a4', '00000000-0000-4000-8000-0000000000d2', 'Year IV', 4)
on conflict do nothing;

insert into public.semesters (id, academic_year_id, name, semester_number) values
  ('00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000a1', 'Semester I', 1),
  ('00000000-0000-4000-8000-0000000000b2', '00000000-0000-4000-8000-0000000000a1', 'Semester II', 2),
  ('00000000-0000-4000-8000-0000000000b3', '00000000-0000-4000-8000-0000000000a2', 'Semester I', 1),
  ('00000000-0000-4000-8000-0000000000b4', '00000000-0000-4000-8000-0000000000a2', 'Semester II', 2),
  ('00000000-0000-4000-8000-0000000000b5', '00000000-0000-4000-8000-0000000000a3', 'Semester I', 1),
  ('00000000-0000-4000-8000-0000000000b6', '00000000-0000-4000-8000-0000000000a3', 'Semester II', 2),
  ('00000000-0000-4000-8000-0000000000b7', '00000000-0000-4000-8000-0000000000a4', 'Semester I', 1),
  ('00000000-0000-4000-8000-0000000000b8', '00000000-0000-4000-8000-0000000000a4', 'Semester II', 2)
on conflict do nothing;

insert into public.courses (code, title, department_id, semester_id, description, difficulty, prerequisites, status, sort_order) values
  ('INS101', 'Foundations of Information Science', '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000b1', 'Scope and professional identity of information science, from archives to digital platforms.', 'Core', '', 'published', 1),
  ('INS103', 'Programming Fundamentals', '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000b1', 'Problem decomposition and control flow using Python, from variables to file handling.', 'Core', '', 'published', 2),
  ('INS105', 'Mathematics for Computing', '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000b1', 'Sets, logic, relations and probability that underpin computing and information systems.', 'Core', '', 'published', 3),
  ('INS102', 'Data Structures and Algorithms I', '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000b2', 'Arrays, stacks, queues, linked lists and trees with complexity analysis in practice.', 'Core', 'INS103', 'published', 4),
  ('INS104', 'Computer Organization', '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000b2', 'How processors, memory hierarchies and instruction sets execute real programs.', 'Core', '', 'published', 5),
  ('INS108', 'Web Fundamentals', '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000b2', 'Semantic HTML, modern CSS layout and client-side scripting for responsive information sites.', 'Applied', 'INS101', 'published', 6),
  ('INS201', 'Algorithms and Complexity', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b3', 'Sorting, searching, greedy and dynamic programming with asymptotic reasoning.', 'Core', 'INS102', 'published', 7),
  ('INS203', 'Database Systems', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b3', 'Relational modelling, SQL, normalisation, transactions and query planning.', 'Core', 'INS102', 'published', 8),
  ('INS205', 'Object Oriented Programming', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b3', 'Encapsulation, inheritance and composition applied to maintainable TypeScript systems.', 'Applied', 'INS103', 'published', 9),
  ('INS202', 'Operating Systems', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b4', 'Processes, scheduling, memory management, file systems and concurrency primitives.', 'Core', 'INS104', 'published', 10),
  ('INS204', 'Computer Networks', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b4', 'The TCP/IP stack, routing, naming and network troubleshooting workflows.', 'Core', 'INS104', 'published', 11),
  ('INS206', 'Software Engineering', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b4', 'Lifecycle models, version control, testing pyramids and maintainable architecture.', 'Core', 'INS205', 'published', 12),
  ('INS208', 'Probability and Statistics', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b4', 'Descriptive statistics, distributions and hypothesis testing for data-driven decisions.', 'Core', 'INS105', 'published', 13),
  ('INS301', 'Information Retrieval', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b5', 'Indexing, ranking and evaluation of search systems from inverted files to vector models.', 'Advanced', 'INS201, INS203', 'published', 14),
  ('INS303', 'Human Computer Interaction', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b5', 'Usability principles, prototyping and accessibility evaluation of information interfaces.', 'Applied', 'INS203', 'published', 15),
  ('INS305', 'Distributed Systems', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b5', 'Replication, consistency models and message passing in multi-node architectures.', 'Advanced', 'INS202', 'published', 16),
  ('INS307', 'Research Methods in IS', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b5', 'Framing research questions, literature review, instrument design and ethical conduct.', 'Core', 'INS208', 'published', 17),
  ('INS302', 'Cloud Architecture', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b6', 'Deploying resilient applications with managed compute, storage and observability.', 'Advanced', 'INS204, INS305', 'published', 18),
  ('INS304', 'Machine Learning Foundations', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b6', 'Supervised learning workflow: features, training, evaluation and honest reporting.', 'Advanced', 'INS208', 'published', 19),
  ('INS306', 'Data Mining', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b6', 'Pattern discovery with clustering, association rules and text mining on real corpora.', 'Applied', 'INS203, INS304', 'published', 20),
  ('INS308', 'Information Security', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b6', 'Threat modelling, authentication, encryption and secure handling of personal data.', 'Core', 'INS204', 'published', 21),
  ('INS401', 'Advanced Database Systems', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b7', 'Distributed databases, query optimisation, transactions at scale and analytical stores.', 'Advanced', 'INS203', 'published', 22),
  ('INS403', 'Big Data Analytics', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b7', 'Batch and stream processing pipelines with partitioning and pragmatic performance tuning.', 'Advanced', 'INS306', 'published', 23),
  ('INS405', 'IT Project Management', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b7', 'Scoping, scheduling, risk and stakeholder communication for information projects.', 'Applied', 'INS206', 'published', 24),
  ('INS407', 'Digital Libraries', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b7', 'Metadata standards, repository architecture and long-term digital preservation.', 'Applied', 'INS301', 'published', 25),
  ('INS402', 'Capstone Project', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b8', 'A full research or build project delivered with defence, documentation and demo.', 'Advanced', 'INS307', 'published', 26),
  ('INS404', 'Knowledge Management', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b8', 'Capturing tacit knowledge, communities of practice and organisational learning loops.', 'Applied', 'INS101', 'published', 27),
  ('INS406', 'Professional Ethics and IP', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b8', 'Professional codes, intellectual property, licensing and responsible data practice.', 'Core', 'INS308', 'published', 28),
  ('INS408', 'Enterprise Architecture', '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000b8', 'Aligning business capability maps with systems, integration patterns and governance.', 'Advanced', 'INS303', 'published', 29)
on conflict do nothing;
