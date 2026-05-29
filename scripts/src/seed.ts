import { db } from "@workspace/db";
import {
  slidesTable, newsTable, eventsTable, galleryAlbumsTable, galleryItemsTable,
  staffTable, classesTable, downloadsTable, siteSettingsTable, adminUsersTable,
} from "@workspace/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Admin user
  const passwordHash = await bcrypt.hash("ESH@Admin2025!", 12);
  await db.insert(adminUsersTable).values({
    name: "Super Admin",
    email: "admin@ecolesainthannibal.rw",
    passwordHash,
    role: "super",
    isActive: true,
  }).onConflictDoNothing();
  console.log("✓ Admin user created");

  // Site settings
  const defaultSettings = [
    { key: "schoolNameFr", value: "Ecole Saint Hannibal" },
    { key: "schoolNameEn", value: "Saint Hannibal School" },
    { key: "taglineFr", value: "Excellence, Intégrité, Compassion" },
    { key: "taglineEn", value: "Excellence, Integrity, Compassion" },
    { key: "phone1", value: "+250 788 123 456" },
    { key: "phone2", value: "+250 722 987 654" },
    { key: "emailGeneral", value: "info@ecolesainthannibal.rw" },
    { key: "emailAdmissions", value: "admissions@ecolesainthannibal.rw" },
    { key: "addressFr", value: "KG 123 St, Kacyiru, Kigali, Rwanda" },
    { key: "addressEn", value: "KG 123 St, Kacyiru, Kigali, Rwanda" },
    { key: "facebookUrl", value: "https://facebook.com/ecolesainthannibal" },
    { key: "youtubeUrl", value: "https://youtube.com/@ecolesainthannibal" },
    { key: "whatsappNumber", value: "+250788123456" },
    { key: "officeHoursFr", value: "Lun–Ven: 7h00–17h00 | Sam: 8h00–12h00" },
    { key: "officeHoursEn", value: "Mon–Fri: 7:00–17:00 | Sat: 8:00–12:00" },
    { key: "admissionsOpen", value: "true" },
    { key: "currentAcademicYear", value: "2025–2026" },
    { key: "totalStudentsDisplay", value: "290" },
    { key: "announcementBanner", value: "Les inscriptions 2025–2026 sont maintenant ouvertes! Contactez-nous dès aujourd'hui." },
    { key: "announcementActive", value: "true" },
    { key: "mapsEmbedUrl", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4778754263!2d30.1127!3d-1.9800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTgnNDguMCJTIDMwwrAwNic0NS43IkU!5e0!3m2!1sfr!2srw!4v1617000000000!5m2!1sfr!2srw" },
    { key: "directorMessageFr", value: "Au nom de toute la communauté scolaire d'Ecole Saint Hannibal, je vous souhaite la bienvenue sur notre site. Notre école est un lieu d'excellence où chaque enfant est accompagné avec amour et rigueur pour devenir la meilleure version de lui-même." },
    { key: "directorMessageEn", value: "On behalf of the entire school community at Ecole Saint Hannibal, I welcome you to our website. Our school is a place of excellence where every child is guided with love and rigor to become the best version of themselves." },
    { key: "directorNameFr", value: "Sr. Marie-Claire Nkurunziza" },
    { key: "directorTitleFr", value: "Directrice Générale" },
    { key: "directorTitleEn", value: "General Director" },
  ];
  for (const s of defaultSettings) {
    await db.insert(siteSettingsTable).values(s).onConflictDoNothing();
  }
  console.log("✓ Site settings created");

  // Slides
  await db.insert(slidesTable).values([
    {
      imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
      headingFr: "Bienvenue à l'Ecole Saint Hannibal",
      headingEn: "Welcome to Ecole Saint Hannibal",
      subtextFr: "Une éducation d'excellence pour chaque enfant",
      subtextEn: "Quality education for every child",
      cta1Text: "Découvrir l'école",
      cta1Url: "/about",
      cta2Text: "S'inscrire",
      cta2Url: "/admissions",
      orderIndex: 1,
      isActive: true,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80",
      headingFr: "Maternelle & Primaire",
      headingEn: "Nursery & Primary",
      subtextFr: "De la Maternelle 1 à la Primaire 6 — 27 classes, 290 élèves",
      subtextEn: "From Nursery 1 to Primary 6 — 27 classes, 290 students",
      cta1Text: "Nos programmes",
      cta1Url: "/academics/nursery",
      cta2Text: "Nos classes",
      cta2Url: "/academics/primary",
      orderIndex: 2,
      isActive: true,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80",
      headingFr: "Inscriptions 2025–2026 Ouvertes",
      headingEn: "2025–2026 Admissions Now Open",
      subtextFr: "Rejoignez notre communauté scolaire dès aujourd'hui",
      subtextEn: "Join our school community today",
      cta1Text: "Faire une demande",
      cta1Url: "/admissions",
      cta2Text: "En savoir plus",
      cta2Url: "/about",
      orderIndex: 3,
      isActive: true,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&q=80",
      headingFr: "Excellence Académique",
      headingEn: "Academic Excellence",
      subtextFr: "Un curriculum bilingue Français–Anglais rigoureux",
      subtextEn: "A rigorous bilingual French–English curriculum",
      cta1Text: "Le curriculum",
      cta1Url: "/academics/curriculum",
      cta2Text: "Galerie",
      cta2Url: "/gallery",
      orderIndex: 4,
      isActive: true,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&q=80",
      headingFr: "Développement de l'Enfant",
      headingEn: "Child Development",
      subtextFr: "Sport, arts, culture — un épanouissement complet",
      subtextEn: "Sports, arts, culture — complete development",
      cta1Text: "Actualités",
      cta1Url: "/news",
      cta2Text: "Événements",
      cta2Url: "/events",
      orderIndex: 5,
      isActive: true,
    },
  ]).onConflictDoNothing();
  console.log("✓ Slides created");

  // Staff
  const staffMembers = [
    { fullName: "Sr. Marie-Claire Nkurunziza", roleFr: "Directrice Générale", roleEn: "General Director", department: "direction", orderIndex: 1, bioFr: "Sr. Marie-Claire dirige l'école avec passion depuis 2008.", bioEn: "Sr. Marie-Claire has led the school with passion since 2008.", photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80", isActive: true },
    { fullName: "M. Jean-Paul Hakizimana", roleFr: "Directeur Adjoint", roleEn: "Deputy Director", department: "direction", orderIndex: 2, bioFr: "M. Hakizimana supervise les programmes académiques.", bioEn: "Mr. Hakizimana oversees academic programs.", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", isActive: true },
    { fullName: "Mme Aline Uwimana", roleFr: "Responsable de la Section Maternelle", roleEn: "Head of Nursery", department: "nursery", orderIndex: 3, bioFr: "Spécialiste de la petite enfance avec 12 ans d'expérience.", bioEn: "Early childhood specialist with 12 years of experience.", photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", isActive: true },
    { fullName: "M. Patrick Ndayisaba", roleFr: "Responsable de la Section Primaire", roleEn: "Head of Primary", department: "primary", orderIndex: 4, bioFr: "Pédagogue dévoué avec une vision claire du développement de l'élève.", bioEn: "Dedicated educator with a clear vision of student development.", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", isActive: true },
    { fullName: "Mme Grace Mukamana", roleFr: "Enseignante N1-A", roleEn: "Teacher N1-A", department: "nursery", orderIndex: 5, photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80", isActive: true },
    { fullName: "M. Eric Habimana", roleFr: "Enseignant P6-A", roleEn: "Teacher P6-A", department: "primary", orderIndex: 6, photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80", isActive: true },
    { fullName: "Mme Diane Iradukunda", roleFr: "Coordinatrice des Ressources", roleEn: "Resources Coordinator", department: "administration", orderIndex: 7, photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80", isActive: true },
    { fullName: "M. Samuel Nsabimana", roleFr: "Responsable des Sports", roleEn: "Sports Coordinator", department: "activities", orderIndex: 8, photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", isActive: true },
  ];
  const staffIds: string[] = [];
  for (const s of staffMembers) {
    const [inserted] = await db.insert(staffTable).values(s).onConflictDoNothing().returning();
    staffIds.push(inserted?.id || "");
  }
  console.log("✓ Staff created");

  // Classes — 27 total
  const classDefs = [
    // Nursery
    { classCode: "N1-A", division: "nursery", studentCount: 12 },
    { classCode: "N1-B", division: "nursery", studentCount: 11 },
    { classCode: "N1-C", division: "nursery", studentCount: 12 },
    { classCode: "N2-A", division: "nursery", studentCount: 13 },
    { classCode: "N2-B", division: "nursery", studentCount: 12 },
    { classCode: "N2-C", division: "nursery", studentCount: 11 },
    { classCode: "N3-A", division: "nursery", studentCount: 14 },
    { classCode: "N3-B", division: "nursery", studentCount: 13 },
    { classCode: "N3-C", division: "nursery", studentCount: 12 },
    // Primary
    { classCode: "P1-A", division: "primary", studentCount: 20 },
    { classCode: "P1-B", division: "primary", studentCount: 19 },
    { classCode: "P2-A", division: "primary", studentCount: 22 },
    { classCode: "P2-B", division: "primary", studentCount: 21 },
    { classCode: "P3-A", division: "primary", studentCount: 23 },
    { classCode: "P3-B", division: "primary", studentCount: 22 },
    { classCode: "P4-A", division: "primary", studentCount: 24 },
    { classCode: "P4-B", division: "primary", studentCount: 23 },
    { classCode: "P5-A", division: "primary", studentCount: 25 },
    { classCode: "P5-B", division: "primary", studentCount: 24 },
    { classCode: "P6-A", division: "primary", studentCount: 26 },
    { classCode: "P6-B", division: "primary", studentCount: 25 },
  ];
  for (const c of classDefs) {
    await db.insert(classesTable).values({
      classCode: c.classCode,
      division: c.division,
      studentCount: c.studentCount,
      descFr: `Classe ${c.classCode} — programme bilingue Français–Anglais`,
      descEn: `Class ${c.classCode} — bilingual French–English program`,
      showOnWebsite: true,
    }).onConflictDoNothing();
  }
  console.log("✓ Classes created");

  // News articles
  await db.insert(newsTable).values([
    {
      slug: `rentree-scolaire-2025-2026-${Date.now()}`,
      titleFr: "Rentrée Scolaire 2025–2026 : Une Nouvelle Année Pleine de Promesses",
      titleEn: "Back to School 2025–2026: A New Year Full of Promise",
      excerptFr: "L'Ecole Saint Hannibal a accueilli ses 290 élèves avec enthousiasme pour une nouvelle année académique.",
      excerptEn: "Ecole Saint Hannibal welcomed its 290 students enthusiastically for a new academic year.",
      bodyFr: "<p>Le lundi 2 septembre 2025, l'Ecole Saint Hannibal a ouvert ses portes pour une nouvelle année scolaire pleine d'espoir et de promesses. La directrice, Sr. Marie-Claire Nkurunziza, a accueilli chaleureusement élèves, parents et enseignants.</p><p>Cette année marque un tournant important avec l'introduction de nouvelles ressources numériques et l'enrichissement du programme bilingue.</p>",
      bodyEn: "<p>On Monday, September 2, 2025, Ecole Saint Hannibal opened its doors for a new school year full of hope and promise. Director Sr. Marie-Claire Nkurunziza warmly welcomed students, parents and teachers.</p><p>This year marks an important turning point with the introduction of new digital resources and the enrichment of the bilingual program.</p>",
      featuredImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
      category: "actualites",
      author: "Administration ESH",
      tags: ["rentrée", "2025-2026", "élèves"],
      status: "published",
      publishedAt: new Date("2025-09-02"),
    },
    {
      slug: `fete-nationale-rwanda-2025-${Date.now() + 1}`,
      titleFr: "Célébration de la Fête Nationale du Rwanda à l'ESH",
      titleEn: "Rwanda National Day Celebration at ESH",
      excerptFr: "Nos élèves ont célébré avec fierté la Fête Nationale du Rwanda avec chants, danses et discours patriotiques.",
      excerptEn: "Our students proudly celebrated Rwanda National Day with songs, dances and patriotic speeches.",
      bodyFr: "<p>Le 1er juillet 2025, l'Ecole Saint Hannibal s'est parée de drapeaux rwandais pour célébrer dignement la Fête Nationale. Les élèves des différentes classes ont présenté des spectacles culturels magnifiques.</p>",
      bodyEn: "<p>On July 1, 2025, Ecole Saint Hannibal was adorned with Rwandan flags to dignifiedly celebrate National Day. Students from various classes presented magnificent cultural performances.</p>",
      featuredImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
      category: "evenements",
      author: "Département Culturel",
      tags: ["fête nationale", "Rwanda", "culture"],
      status: "published",
      publishedAt: new Date("2025-07-03"),
    },
    {
      slug: `prix-excellence-primaire-2025-${Date.now() + 2}`,
      titleFr: "Remise des Prix d'Excellence de la Section Primaire",
      titleEn: "Primary Excellence Awards Ceremony",
      excerptFr: "12 élèves de la section primaire ont été récompensés pour leurs performances académiques exceptionnelles.",
      excerptEn: "12 primary students were recognized for their exceptional academic performance.",
      bodyFr: "<p>La cérémonie de remise des prix d'excellence s'est tenue dans notre salle polyvalente devant un public nombreux. Douze élèves particulièrement méritants ont reçu trophées et certificats.</p>",
      bodyEn: "<p>The excellence awards ceremony was held in our multipurpose hall before a large audience. Twelve particularly deserving students received trophies and certificates.</p>",
      featuredImage: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800&q=80",
      category: "recompenses",
      author: "M. Patrick Ndayisaba",
      tags: ["prix", "excellence", "primaire"],
      status: "published",
      publishedAt: new Date("2025-06-20"),
    },
    {
      slug: `tournoi-football-interscolaire-${Date.now() + 3}`,
      titleFr: "L'ESH Remporte le Tournoi de Football Interscolaire",
      titleEn: "ESH Wins Interschool Football Tournament",
      excerptFr: "L'équipe de football de l'ESH a brillamment remporté la finale du tournoi interscolaire de Kigali.",
      excerptEn: "ESH's football team brilliantly won the Kigali interschool tournament final.",
      bodyFr: "<p>Quelle fierté pour notre école! L'équipe de football de la section primaire a remporté le tournoi régional avec un score de 3-1 en finale. Bravo à nos champions!</p>",
      bodyEn: "<p>What pride for our school! The primary football team won the regional tournament with a 3-1 score in the final. Congratulations to our champions!</p>",
      featuredImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      category: "sports",
      author: "M. Samuel Nsabimana",
      tags: ["football", "sport", "victoire"],
      status: "published",
      publishedAt: new Date("2025-05-15"),
    },
    {
      slug: `nouveau-laboratoire-informatique-${Date.now() + 4}`,
      titleFr: "Inauguration du Nouveau Laboratoire Informatique",
      titleEn: "New Computer Lab Inauguration",
      excerptFr: "L'ESH inaugure son nouveau laboratoire informatique équipé de 30 postes modernes pour les élèves du primaire.",
      excerptEn: "ESH inaugurates its new computer lab equipped with 30 modern workstations for primary students.",
      bodyFr: "<p>Un grand jour pour l'Ecole Saint Hannibal! Notre nouveau laboratoire informatique a été officiellement inauguré en présence de représentants du Ministère de l'Education. Cet équipement de pointe permettra à nos élèves de développer les compétences numériques essentielles pour leur avenir.</p>",
      bodyEn: "<p>A great day for Ecole Saint Hannibal! Our new computer lab was officially inaugurated in the presence of representatives from the Ministry of Education. This state-of-the-art equipment will enable our students to develop essential digital skills for their future.</p>",
      featuredImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      category: "infrastructure",
      author: "Administration ESH",
      tags: ["informatique", "technologie", "innovation"],
      status: "published",
      publishedAt: new Date("2025-04-10"),
    },
  ]).onConflictDoNothing();
  console.log("✓ News created");

  // Events
  const now = new Date();
  await db.insert(eventsTable).values([
    {
      titleFr: "Réunion Parents-Enseignants du 1er Trimestre",
      titleEn: "1st Term Parent-Teacher Meeting",
      eventType: "meeting",
      startDatetime: new Date(now.getFullYear(), now.getMonth() + 1, 10, 8, 0),
      endDatetime: new Date(now.getFullYear(), now.getMonth() + 1, 10, 12, 0),
      locationFr: "Salle polyvalente de l'ESH, Kacyiru",
      locationEn: "ESH Multipurpose Hall, Kacyiru",
      descriptionFr: "Rencontre entre les parents et les enseignants pour discuter des progrès des élèves au cours du premier trimestre.",
      descriptionEn: "Meeting between parents and teachers to discuss student progress during the first term.",
      audience: ["parents", "teachers"],
      status: "upcoming",
      showOnHomepage: true,
    },
    {
      titleFr: "Compétition Sportive Annuelle",
      titleEn: "Annual Sports Day",
      eventType: "sports",
      startDatetime: new Date(now.getFullYear(), now.getMonth() + 1, 20, 7, 30),
      endDatetime: new Date(now.getFullYear(), now.getMonth() + 1, 20, 17, 0),
      locationFr: "Terrain de sport de l'ESH",
      locationEn: "ESH Sports Ground",
      descriptionFr: "Grande journée sportive annuelle : football, course, saut en longueur, tir à la corde et bien plus.",
      descriptionEn: "Annual sports day: football, running, long jump, tug of war and much more.",
      audience: ["all"],
      status: "upcoming",
      showOnHomepage: true,
    },
    {
      titleFr: "Fête de Noël et de Fin d'Année",
      titleEn: "Christmas & End of Year Festival",
      eventType: "cultural",
      startDatetime: new Date(now.getFullYear(), 11, 19, 9, 0),
      endDatetime: new Date(now.getFullYear(), 11, 19, 16, 0),
      locationFr: "Cour principale de l'ESH",
      locationEn: "ESH Main Courtyard",
      descriptionFr: "Grande fête de fin d'année avec spectacles culturels, remise de bulletins et célébration des succès.",
      descriptionEn: "Year-end festival with cultural shows, report card distribution and celebration of achievements.",
      audience: ["all"],
      status: "upcoming",
      showOnHomepage: true,
    },
    {
      titleFr: "Visite Éducative: Musée National du Rwanda",
      titleEn: "Educational Visit: Rwanda National Museum",
      eventType: "trip",
      startDatetime: new Date(now.getFullYear(), now.getMonth() + 2, 5, 7, 0),
      endDatetime: new Date(now.getFullYear(), now.getMonth() + 2, 5, 16, 0),
      locationFr: "Musée National, Butare",
      locationEn: "National Museum, Butare",
      descriptionFr: "Excursion éducative au Musée National du Rwanda pour les élèves de P4, P5 et P6.",
      descriptionEn: "Educational trip to Rwanda National Museum for P4, P5 and P6 students.",
      audience: ["p4", "p5", "p6"],
      status: "upcoming",
      showOnHomepage: false,
    },
    {
      titleFr: "Journée Portes Ouvertes — Admissions 2026",
      titleEn: "Open Day — 2026 Admissions",
      eventType: "academic",
      startDatetime: new Date(now.getFullYear(), now.getMonth() + 1, 15, 9, 0),
      endDatetime: new Date(now.getFullYear(), now.getMonth() + 1, 15, 13, 0),
      locationFr: "Campus principal de l'ESH, Kacyiru",
      locationEn: "ESH Main Campus, Kacyiru",
      descriptionFr: "Journée portes ouvertes pour les familles souhaitant inscrire leur enfant à l'ESH pour l'année 2025-2026.",
      descriptionEn: "Open day for families wishing to enroll their child at ESH for the 2025-2026 academic year.",
      audience: ["prospective_parents"],
      status: "upcoming",
      showOnHomepage: true,
    },
  ]).onConflictDoNothing();
  console.log("✓ Events created");

  // Gallery albums
  const [album1] = await db.insert(galleryAlbumsTable).values({
    nameFr: "Rentrée Scolaire 2025",
    nameEn: "Back to School 2025",
    category: "academic",
    eventDate: "2025-09-02",
    descriptionFr: "Photos de la rentrée scolaire 2025-2026.",
    descriptionEn: "Photos from the 2025-2026 back to school.",
    isVisible: true,
    coverImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
  }).onConflictDoNothing().returning();

  const [album2] = await db.insert(galleryAlbumsTable).values({
    nameFr: "Fête Nationale 2025",
    nameEn: "National Day 2025",
    category: "cultural",
    eventDate: "2025-07-01",
    descriptionFr: "Célébration de la Fête Nationale du Rwanda.",
    descriptionEn: "Rwanda National Day celebration.",
    isVisible: true,
    coverImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80",
  }).onConflictDoNothing().returning();

  if (album1?.id) {
    await db.insert(galleryItemsTable).values([
      { albumId: album1.id, mediaUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80", mediaType: "photo", captionFr: "Accueil des élèves", captionEn: "Student welcome", orderIndex: 1 },
      { albumId: album1.id, mediaUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", mediaType: "photo", captionFr: "La salle de classe", captionEn: "The classroom", orderIndex: 2 },
      { albumId: album1.id, mediaUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", mediaType: "photo", captionFr: "Atelier informatique", captionEn: "Computer workshop", orderIndex: 3 },
    ]).onConflictDoNothing();
  }

  if (album2?.id) {
    await db.insert(galleryItemsTable).values([
      { albumId: album2.id, mediaUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80", mediaType: "photo", captionFr: "Défilé patriotique", captionEn: "Patriotic parade", orderIndex: 1 },
      { albumId: album2.id, mediaUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80", mediaType: "photo", captionFr: "Danses culturelles", captionEn: "Cultural dances", orderIndex: 2 },
      { albumId: album2.id, mediaUrl: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800&q=80", mediaType: "photo", captionFr: "Remise de prix", captionEn: "Awards ceremony", orderIndex: 3 },
    ]).onConflictDoNothing();
  }
  console.log("✓ Gallery created");

  // Downloads
  await db.insert(downloadsTable).values([
    {
      titleFr: "Calendrier Scolaire 2025–2026",
      titleEn: "Academic Calendar 2025–2026",
      fileUrl: "/files/calendrier-2025-2026.pdf",
      fileType: "pdf",
      category: "calendrier",
      audience: ["all"],
      publishDate: "2025-09-01",
      isActive: true,
    },
    {
      titleFr: "Dossier d'Inscription 2025–2026",
      titleEn: "2025–2026 Enrollment Form",
      fileUrl: "/files/dossier-inscription.pdf",
      fileType: "pdf",
      category: "admissions",
      audience: ["parents"],
      publishDate: "2025-08-01",
      isActive: true,
    },
    {
      titleFr: "Règlement Intérieur de l'Ecole",
      titleEn: "School Rules and Regulations",
      fileUrl: "/files/reglement-interieur.pdf",
      fileType: "pdf",
      category: "reglement",
      audience: ["parents", "students"],
      publishDate: "2025-09-01",
      isActive: true,
    },
    {
      titleFr: "Emploi du Temps — Section Maternelle",
      titleEn: "Timetable — Nursery Section",
      fileUrl: "/files/emploi-temps-maternelle.pdf",
      fileType: "pdf",
      category: "emplois-du-temps",
      audience: ["nursery"],
      publishDate: "2025-09-02",
      isActive: true,
    },
    {
      titleFr: "Emploi du Temps — Section Primaire",
      titleEn: "Timetable — Primary Section",
      fileUrl: "/files/emploi-temps-primaire.pdf",
      fileType: "pdf",
      category: "emplois-du-temps",
      audience: ["primary"],
      publishDate: "2025-09-02",
      isActive: true,
    },
    {
      titleFr: "Prospectus de l'Ecole Saint Hannibal",
      titleEn: "Ecole Saint Hannibal Prospectus",
      fileUrl: "/files/prospectus-esh.pdf",
      fileType: "pdf",
      category: "prospectus",
      audience: ["all"],
      publishDate: "2025-08-15",
      isActive: true,
    },
  ]).onConflictDoNothing();
  console.log("✓ Downloads created");

  console.log("\n🎉 Seeding complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
