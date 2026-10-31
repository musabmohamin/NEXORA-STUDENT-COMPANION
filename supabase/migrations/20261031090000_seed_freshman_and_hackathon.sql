-- Seed Freshman courses and Cursor Hackathon Jimma
DELETE FROM public.courses WHERE department_id = '00000000-0000-4000-8000-0000000000d1';

INSERT INTO public.courses (
  id, department_id, semester_id, code, title, description,
  cr_hr, ects, lecture_hours, lab_hours, tutorial_hours, category,
  difficulty, status, sort_order, prerequisites, cover_image, outcomes
) VALUES
(
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b1',
  'FLEn 1011',
  'Communicative English Language Skills I',
  'Developing receptive and productive academic English skills with focus on reading comprehension, vocabulary expansion, and formal written discourse.',
  3, 5, 3, 0, 0, 'General', 'beginner', 'published', 11, NULL,
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
  ARRAY['Extract main ideas and critical nuances from academic texts', 'Construct cohesive paragraphs with clear topic sentences', 'Deliver organized spoken academic presentations']
),
(
  '00000000-0000-4000-8000-000000000102',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b1',
  'Phys 1011',
  'General Physics',
  'Classical mechanics, thermodynamics, wave motion, and electromagnetism principles coupled with practical laboratory experimentation.',
  3, 5, 2, 3, 0, 'Core', 'beginner', 'published', 12, NULL,
  'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
  ARRAY['Apply Newton''s laws and conservation theorems to particle kinematics', 'Compute thermodynamic cycles and heat transfer metrics', 'Conduct controlled laboratory measurements with error margins']
),
(
  '00000000-0000-4000-8000-000000000103',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b1',
  'Math 1011',
  'Mathematics for Natural Sciences',
  'Propositional calculus, set theory, real functions, limits, continuity, single-variable differentiation, and practical optimization.',
  3, 5, 3, 0, 0, 'Core', 'beginner', 'published', 13, NULL,
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
  ARRAY['Formulate rigorous logical proofs using propositional truth tables', 'Calculate limits and evaluate continuity for piecewise curves', 'Determine extrema and inflection points using derivatives']
),
(
  '00000000-0000-4000-8000-000000000104',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b1',
  'Psyc 1011',
  'General Psychology',
  'Scientific study of mental processes, behavioral mechanisms, cognition, memory retention, motivation, and developmental psychology.',
  3, 5, 3, 0, 0, 'General', 'beginner', 'published', 14, NULL,
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80',
  ARRAY['Contrast biological, cognitive, and psychodynamic models of behavior', 'Explain memory encoding, consolidation, and retrieval failures', 'Apply psychological theories to interpersonal and collaborative scenarios']
),
(
  '00000000-0000-4000-8000-000000000105',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b1',
  'LoCT 1011',
  'Critical Thinking',
  'Deductive and inductive argumentation, identification of logical fallacies, cognitive biases, and systematic problem formulation.',
  3, 5, 3, 0, 0, 'General', 'beginner', 'published', 15, NULL,
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
  ARRAY['Differentiate valid deductive structures from inductive generalizations', 'Identify formal and informal fallacies in everyday discourse', 'Construct sound arguments supported by verifiable premises']
),
(
  '00000000-0000-4000-8000-000000000106',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b1',
  'SpSc 1011',
  'Physical Fitness',
  'Principles of cardiovascular health, biomechanical conditioning, wellness ergonomics, and lifetime athletic maintenance.',
  2, 3, 1, 2, 0, 'General', 'beginner', 'published', 16, NULL,
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  ARRAY['Design personalized aerobic and strength conditioning routines', 'Understand physiological adaptations to regular exercise', 'Apply ergonomic practices for prolonged computer workstation tasks']
),
(
  '00000000-0000-4000-8000-000000000107',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b2',
  'FLEn 1012',
  'Communicative English Language Skills II',
  'Advanced academic writing, technical summaries, citation mechanics, research synthesis, and persuasive presentation delivery.',
  3, 5, 3, 0, 0, 'General', 'beginner', 'published', 21, 'FLEn 1011',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  ARRAY['Draft research-grade essays adhering to APA/IEEE formatting', 'Synthesize multi-source literature into coherent topic briefs', 'Defend complex technical theses in seminar discussions']
),
(
  '00000000-0000-4000-8000-000000000108',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b2',
  'CoSc 1012',
  'Introduction to Computing',
  'Computational thinking, binary representation, computer system architectures, algorithm design, and structured programming fundamentals in Python.',
  3, 5, 2, 3, 0, 'Core', 'beginner', 'published', 22, NULL,
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  ARRAY['Decompose procedural challenges into algorithmic flowcharts', 'Write modular scripts utilizing loops, arrays, and file I/O', 'Debug runtime and logic errors using interactive debuggers']
),
(
  '00000000-0000-4000-8000-000000000109',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b2',
  'Math 1012',
  'Applied Mathematics',
  'Integral calculus, techniques of integration, multivariable partial differentiation, systems of linear equations, matrices, and determinants.',
  3, 5, 3, 0, 0, 'Core', 'beginner', 'published', 23, 'Math 1011',
  'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
  ARRAY['Solve definite integrals using substitution and parts', 'Compute determinants and inverse matrices for linear systems', 'Apply partial derivatives to multivariable optimization challenges']
),
(
  '00000000-0000-4000-8000-000000000110',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b2',
  'Anth 1012',
  'Social Anthropology',
  'Cultural diversity, kinship systems, ethnographic methods, indigenous knowledge systems, and social change in the Horn of Africa.',
  2, 3, 2, 0, 0, 'General', 'beginner', 'published', 24, NULL,
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
  ARRAY['Analyze social phenomena through comparative anthropological lenses', 'Recognize the cultural relevance of indigenous knowledge systems', 'Appreciate ethnic plurality and community resilience']
),
(
  '00000000-0000-4000-8000-000000000111',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b2',
  'MCED 1012',
  'Moral and Civic Education',
  'Constitutional democracy, rule of law, human rights frameworks, civic responsibilities, professional ethics, and public integrity.',
  2, 3, 2, 0, 0, 'General', 'beginner', 'published', 25, NULL,
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
  ARRAY['Explain constitutional rights and institutional checks and balances', 'Evaluate ethical dilemmas using moral philosophy frameworks', 'Promote civic engagement and responsible digital citizenship']
),
(
  '00000000-0000-4000-8000-000000000112',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b2',
  'EmTe 1012',
  'Emerging Technologies',
  'Exploration of the Fourth Industrial Revolution: Artificial Intelligence, Internet of Things (IoT), Cloud Computing, Blockchain, and Cybersecurity fundamentals.',
  3, 5, 2, 2, 0, 'Applied', 'beginner', 'published', 26, NULL,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
  ARRAY['Understand core architectures of IoT sensors and cloud backends', 'Identify real-world applications of machine learning models', 'Evaluate security and ethical implications of decentralized tech']
),
(
  '00000000-0000-4000-8000-000000000113',
  '00000000-0000-4000-8000-0000000000d1',
  '00000000-0000-4000-8000-0000000000b2',
  'Incl 1012',
  'Inclusiveness',
  'Promoting social justice, universal accessibility, assistive technologies, and inclusive institutional policies for persons with disabilities.',
  2, 3, 2, 0, 0, 'General', 'beginner', 'published', 27, NULL,
  'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&auto=format&fit=crop&q=80',
  ARRAY['Identify physical, educational, and digital barriers to inclusion', 'Recommend assistive software and universal design modifications', 'Advocate for equitable policies in university and workplace environments']
);

-- Seed Cursor Hackathon Jimma in announcements
INSERT INTO public.announcements (
  id, title, description, category, event_date, deadline, location, external_url, image_url, department_id, featured, status
) VALUES (
  '00000000-0000-4000-8000-0000000000a1',
  'Cursor Hackathon Jimma — 24-Hour Build Event',
  'Join Jimma University tech builders for a high-intensity 24-hour hackathon powered by Cursor and modern AI-first engineering. Build production-grade software, compete for prizes, network with faculty and industry mentors, and showcase your solutions.',
  'hackathon',
  '2026-11-21 05:00:00+00',
  '2026-11-20 20:59:00+00',
  'Jimma University, Jimma',
  'https://lu.ma/cursor-hackathon-jimma',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
  NULL,
  true,
  'active'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  event_date = EXCLUDED.event_date,
  deadline = EXCLUDED.deadline,
  location = EXCLUDED.location,
  external_url = EXCLUDED.external_url,
  image_url = EXCLUDED.image_url,
  featured = true,
  status = 'active';
