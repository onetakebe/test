import {
  ClientStatus,
  DeadlineStatus,
  EventType,
  IntegrationProvider,
  IntegrationStatus,
  PerformanceStatus,
  Priority,
  PrismaClient,
  ProjectStatus,
  TaskStatus,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ONE TAKE OS database...');

  // Clear in dependency order so re-running the seed is idempotent.
  await prisma.activityLog.deleteMany();
  await prisma.aISummary.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.instagramMetrics.deleteMany();
  await prisma.metrics.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.file.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.deadline.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // ──────────────────────────── Users ────────────────────────────
  const passwordHash = await bcrypt.hash('onetake123', 10);

  const createUser = (name: string, email: string, role: UserRole) =>
    prisma.user.create({ data: { name, email, role, passwordHash } });

  const ana = await createUser('Ana Lima', 'ana@onetake.studio', UserRole.ADMIN);
  const bruno = await createUser('Bruno Costa', 'bruno@onetake.studio', UserRole.EDITOR);
  const carla = await createUser('Carla Souza', 'carla@onetake.studio', UserRole.MANAGER);
  const diana = await createUser('Diana Rocha', 'diana@onetake.studio', UserRole.CREATIVE);
  const eduardo = await createUser('Eduardo Melo', 'eduardo@onetake.studio', UserRole.CREATIVE);
  const fernanda = await createUser('Fernanda Santos', 'fernanda@onetake.studio', UserRole.SOCIAL_MEDIA);
  const gabriel = await createUser('Gabriel Nunes', 'gabriel@onetake.studio', UserRole.CREATIVE);
  const helena = await createUser('Helena Costa', 'helena@onetake.studio', UserRole.SOCIAL_MEDIA);
  const igor = await createUser('Igor Mendes', 'igor@onetake.studio', UserRole.CREATIVE);
  const julia = await createUser('Julia Ferreira', 'julia@onetake.studio', UserRole.MANAGER);

  console.log('Created 10 users (password for all: onetake123)');

  // ──────────────────────────── Clients ────────────────────────────
  const apex = await prisma.client.create({
    data: {
      name: 'Ricardo Apex',
      companyName: 'Apex Corp',
      email: 'ricardo@apexcorp.com.br',
      phone: '+55 11 9 8765-4321',
      instagram: '@apexcorp',
      status: ClientStatus.RECURRING,
      notes: 'Cliente VIP desde 2022. Prefere comunicação via WhatsApp.',
    },
  });
  const luxe = await prisma.client.create({
    data: {
      name: 'Sofia Luxe',
      companyName: 'Luxe Brands',
      email: 'sofia@luxebrands.com',
      phone: '+55 11 9 9876-5432',
      instagram: '@luxebrands',
      status: ClientStatus.ACTIVE_CLIENT,
      notes: 'Muito atenta aos detalhes de design. Revisar sempre antes de apresentar.',
    },
  });
  const nova = await prisma.client.create({
    data: {
      name: 'Marcos Nova',
      companyName: 'Nova Foods',
      email: 'marcos@novafoods.com.br',
      phone: '+55 21 9 8543-6789',
      instagram: '@novafoods_br',
      status: ClientStatus.RECURRING,
      notes: 'Foco em performance de Instagram. Valoriza métricas de engajamento.',
    },
  });
  const afterDrinks = await prisma.client.create({
    data: {
      name: 'Beatriz After',
      companyName: 'After Drinks Co',
      email: 'beatriz@afterdrinks.com',
      phone: '+55 11 9 7654-3210',
      instagram: '@afterdrinks',
      status: ClientStatus.ACTIVE_CLIENT,
      notes: 'Novo cliente. Em fase de planejamento do projeto inicial.',
    },
  });
  const techstart = await prisma.client.create({
    data: {
      name: 'Lucas Tech',
      companyName: 'TechStart',
      email: 'lucas@techstart.io',
      phone: '+55 11 9 5432-1098',
      instagram: '@techstart.io',
      status: ClientStatus.ACTIVE_CLIENT,
      notes: 'Startup em fase de captação. Projeto urgente para pitch de investidores.',
    },
  });
  const freshmart = await prisma.client.create({
    data: {
      name: 'Carolina Fresh',
      companyName: 'FreshMart',
      email: 'carolina@freshmart.com.br',
      phone: '+55 31 9 9876-5432',
      instagram: '@freshmart',
      status: ClientStatus.FINISHED,
      notes: 'Projeto concluído. Aguardando novo briefing para Q4.',
    },
  });
  await prisma.client.create({
    data: {
      name: 'Pedro Prospect',
      companyName: 'Horizon Studio',
      email: 'pedro@horizonstudio.com',
      phone: '+55 11 9 1234-5678',
      instagram: '@horizonstudio',
      status: ClientStatus.NEW_LEAD,
      notes: 'Prospect quente. Reunião de briefing agendada para 25/07.',
    },
  });

  console.log('Created 7 clients');

  // ──────────────────────────── Projects ────────────────────────────
  const apexFilm = await prisma.project.create({
    data: {
      clientId: apex.id,
      name: 'Apex Brand Film',
      description:
        "Full brand identity film showcasing Apex Corp's values and mission for Q4 campaign launch.",
      type: 'Video Production',
      status: ProjectStatus.EDITING,
      priority: Priority.HIGH,
      startDate: new Date('2024-06-01'),
      deadline: new Date('2024-07-28'),
      progress: 72,
      createdBy: ana.id,
    },
  });
  const luxeSite = await prisma.project.create({
    data: {
      clientId: luxe.id,
      name: 'Luxe.co Website',
      description:
        'Full website redesign and development for Luxe.co luxury fashion brand with e-commerce integration.',
      type: 'Web Development',
      status: ProjectStatus.PRE_PRODUCTION,
      priority: Priority.HIGH,
      startDate: new Date('2024-06-15'),
      deadline: new Date('2024-08-05'),
      progress: 65,
      createdBy: ana.id,
    },
  });
  const novaCampaign = await prisma.project.create({
    data: {
      clientId: nova.id,
      name: 'Nova Social Campaign',
      description:
        'Multi-platform social media campaign with 30+ assets for Instagram, TikTok, and YouTube.',
      type: 'Social Media',
      status: ProjectStatus.SHOOTING_SCHEDULED,
      priority: Priority.MEDIUM,
      startDate: new Date('2024-07-01'),
      deadline: new Date('2024-08-12'),
      progress: 48,
      createdBy: carla.id,
    },
  });
  const afterPack = await prisma.project.create({
    data: {
      clientId: afterDrinks.id,
      name: 'After Drinks Content Pack',
      description:
        'Complete content production pack including photography, video reels, and copy for launch.',
      type: 'Content Production',
      status: ProjectStatus.PRE_PRODUCTION,
      priority: Priority.MEDIUM,
      startDate: new Date('2024-07-10'),
      deadline: new Date('2024-09-01'),
      progress: 30,
      createdBy: carla.id,
    },
  });
  const techDeck = await prisma.project.create({
    data: {
      clientId: techstart.id,
      name: 'TechStart Pitch Deck',
      description: 'Investor pitch deck design and animation for Series A funding round.',
      type: 'Design',
      status: ProjectStatus.WAITING_APPROVAL,
      priority: Priority.URGENT,
      startDate: new Date('2024-07-01'),
      deadline: new Date('2024-07-20'),
      progress: 90,
      createdBy: ana.id,
    },
  });
  const freshBrand = await prisma.project.create({
    data: {
      clientId: freshmart.id,
      name: 'FreshMart Brand Identity',
      description:
        'Complete brand identity system including logo, color palette, typography, and brand guidelines.',
      type: 'Branding',
      status: ProjectStatus.FINISHED,
      priority: Priority.MEDIUM,
      startDate: new Date('2024-05-15'),
      deadline: new Date('2024-07-01'),
      progress: 100,
      createdBy: ana.id,
    },
  });

  console.log('Created 6 projects');

  // ──────────────────────────── Tasks ────────────────────────────
  await prisma.task.createMany({
    data: [
      {
        projectId: apexFilm.id,
        assignedTo: bruno.id,
        title: 'Finalizar edição do brand film',
        description: 'Concluir a edição final do brand film incluindo grade de cor e mixagem de áudio.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.URGENT,
        dueDate: new Date('2024-07-22'),
        createdBy: ana.id,
      },
      {
        projectId: luxeSite.id,
        assignedTo: diana.id,
        title: 'Aprovar wireframes do website',
        description: 'Aguardando aprovação dos wireframes de alta fidelidade pelo cliente.',
        status: TaskStatus.WAITING_CLIENT,
        priority: Priority.HIGH,
        dueDate: new Date('2024-07-23'),
        createdBy: ana.id,
      },
      {
        projectId: novaCampaign.id,
        assignedTo: fernanda.id,
        title: 'Produzir 10 reels para Instagram',
        description: 'Criar e editar 10 reels curtos para campanha do Instagram com trilha.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: new Date('2024-07-25'),
        createdBy: carla.id,
      },
      {
        projectId: afterPack.id,
        assignedTo: igor.id,
        title: 'Sessão de fotos produto',
        description: 'Realizar sessão fotográfica dos produtos para o pack de conteúdo.',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: new Date('2024-07-28'),
        createdBy: carla.id,
      },
      {
        projectId: techDeck.id,
        assignedTo: ana.id,
        title: 'Revisão pitch deck slides 20-30',
        description: 'Revisar e ajustar slides finais do pitch deck conforme feedback do cliente.',
        status: TaskStatus.IN_REVIEW,
        priority: Priority.URGENT,
        dueDate: new Date('2024-07-19'),
        createdBy: ana.id,
      },
      {
        projectId: novaCampaign.id,
        assignedTo: helena.id,
        title: 'Criar copy das legendas',
        description: 'Escrever legendas criativas para todos os posts da campanha.',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: new Date('2024-07-30'),
        createdBy: carla.id,
      },
      {
        projectId: apexFilm.id,
        assignedTo: carla.id,
        title: 'Aprovação final brand film',
        description: 'Aprovação interna do corte final antes de enviar ao cliente.',
        status: TaskStatus.COMPLETED,
        priority: Priority.HIGH,
        dueDate: new Date('2024-07-15'),
        completedAt: new Date('2024-07-15'),
        createdBy: ana.id,
      },
      {
        projectId: afterPack.id,
        assignedTo: julia.id,
        title: 'Estratégia de conteúdo Q3',
        description: 'Desenvolver estratégia completa de conteúdo para o terceiro trimestre.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: new Date('2024-07-24'),
        createdBy: carla.id,
      },
      {
        projectId: luxeSite.id,
        assignedTo: eduardo.id,
        title: 'Implementar componentes React',
        description: 'Desenvolver componentes principais do frontend em React/Next.js.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: new Date('2024-07-26'),
        createdBy: ana.id,
      },
      {
        projectId: luxeSite.id,
        assignedTo: diana.id,
        title: 'Teste de usabilidade website',
        description: 'Realizar testes de usabilidade com usuários reais para validar a experiência.',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: new Date('2024-08-01'),
        createdBy: ana.id,
      },
      {
        projectId: novaCampaign.id,
        assignedTo: gabriel.id,
        title: 'Editar vídeos para TikTok',
        description: 'Adaptar os reels da campanha para o formato e trends do TikTok.',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: new Date('2024-08-02'),
        createdBy: carla.id,
      },
    ],
  });

  console.log('Created 11 tasks');

  // ──────────────────────────── Deadlines ────────────────────────────
  await prisma.deadline.createMany({
    data: [
      {
        projectId: techDeck.id,
        title: 'TechStart Pitch Deck Final',
        description: 'Final delivery of pitch deck with all revisions applied.',
        dueDate: new Date('2024-07-20'),
        priority: Priority.URGENT,
        status: DeadlineStatus.PENDING,
      },
      {
        projectId: apexFilm.id,
        title: 'Apex Brand Film Cut',
        description: 'First cut of brand film for client review.',
        dueDate: new Date('2024-07-22'),
        priority: Priority.HIGH,
        status: DeadlineStatus.PENDING,
      },
      {
        projectId: luxeSite.id,
        title: 'Luxe.co Wireframe Approval',
        description: 'Client must approve wireframes to proceed to development.',
        dueDate: new Date('2024-07-23'),
        priority: Priority.HIGH,
        status: DeadlineStatus.PENDING,
      },
      {
        projectId: novaCampaign.id,
        title: 'Nova Campaign First Batch',
        description: 'Deliver first 10 reels and 5 static posts.',
        dueDate: new Date('2024-07-25'),
        priority: Priority.MEDIUM,
        status: DeadlineStatus.PENDING,
      },
      {
        projectId: afterPack.id,
        title: 'After Drinks Photo Session',
        description: 'Complete product photography session.',
        dueDate: new Date('2024-07-28'),
        priority: Priority.MEDIUM,
        status: DeadlineStatus.PENDING,
      },
      {
        projectId: luxeSite.id,
        title: 'Luxe.co Full Website Launch',
        description: 'Full website goes live.',
        dueDate: new Date('2024-08-05'),
        priority: Priority.HIGH,
        status: DeadlineStatus.PENDING,
      },
    ],
  });

  console.log('Created 6 deadlines');

  // ──────────────────────────── Comments ────────────────────────────
  await prisma.comment.createMany({
    data: [
      {
        projectId: apexFilm.id,
        userId: ana.id,
        content:
          'First cut looks great. Color grade on the opening scene needs a warmer tone before client review.',
      },
      {
        projectId: apexFilm.id,
        userId: bruno.id,
        content: "Agreed. I'll push the new grade tonight and re-export the preview by tomorrow morning.",
      },
      {
        projectId: luxeSite.id,
        userId: diana.id,
        content: 'Wireframes sent to Sofia for approval. Following up on Tuesday if no response.',
      },
      {
        projectId: techDeck.id,
        userId: ana.id,
        content: 'Investor feedback on slides 20-30 applied. Ready for final internal review.',
      },
    ],
  });

  // ──────────────────────────── Files ────────────────────────────
  await prisma.file.createMany({
    data: [
      {
        projectId: apexFilm.id,
        uploadedBy: bruno.id,
        fileName: 'brandfilm_v3_preview.mp4',
        fileUrl: 'https://drive.google.com/onetake/apex/brandfilm_v3_preview.mp4',
        fileType: 'video/mp4',
        fileSize: 883_000_000,
      },
      {
        projectId: apexFilm.id,
        uploadedBy: ana.id,
        fileName: 'storyboard_final.pdf',
        fileUrl: 'https://drive.google.com/onetake/apex/storyboard_final.pdf',
        fileType: 'application/pdf',
        fileSize: 4_400_000,
      },
      {
        projectId: luxeSite.id,
        uploadedBy: diana.id,
        fileName: 'wireframes_hifi_v2.fig',
        fileUrl: 'https://drive.google.com/onetake/luxe/wireframes_hifi_v2.fig',
        fileType: 'application/octet-stream',
        fileSize: 38_000_000,
      },
    ],
  });

  // ──────────────────────────── Calendar Events ────────────────────────────
  await prisma.calendarEvent.createMany({
    data: [
      {
        title: 'Creative Review - Nova Foods',
        startDate: new Date('2024-07-17T14:00:00Z'),
        endDate: new Date('2024-07-17T15:00:00Z'),
        type: EventType.MEETING,
        projectId: novaCampaign.id,
        clientId: nova.id,
        location: 'Office - Room 2',
        createdBy: carla.id,
      },
      {
        title: 'Drone Shoot - Apex Exteriors',
        startDate: new Date('2024-07-19T07:00:00Z'),
        endDate: new Date('2024-07-19T12:00:00Z'),
        type: EventType.SHOOTING,
        projectId: apexFilm.id,
        clientId: apex.id,
        location: 'Apex HQ Rooftop',
        createdBy: ana.id,
      },
      {
        title: 'TechStart Pitch Deck Final',
        startDate: new Date('2024-07-20T18:00:00Z'),
        endDate: new Date('2024-07-20T18:00:00Z'),
        type: EventType.DELIVERY,
        projectId: techDeck.id,
        clientId: techstart.id,
        createdBy: ana.id,
      },
      {
        title: 'Weekly Team Sync',
        startDate: new Date('2024-07-22T09:30:00Z'),
        endDate: new Date('2024-07-22T10:15:00Z'),
        type: EventType.INTERNAL,
        location: 'Office - Main Room',
        createdBy: ana.id,
      },
      {
        title: 'Luxe.co Wireframe Approval',
        startDate: new Date('2024-07-23T15:00:00Z'),
        endDate: new Date('2024-07-23T16:00:00Z'),
        type: EventType.REVIEW,
        projectId: luxeSite.id,
        clientId: luxe.id,
        location: 'Google Meet',
        createdBy: diana.id,
      },
      {
        title: 'IG Post - Apex Teaser 02',
        startDate: new Date('2024-07-24T18:00:00Z'),
        endDate: new Date('2024-07-24T18:30:00Z'),
        type: EventType.POSTING,
        projectId: apexFilm.id,
        clientId: apex.id,
        createdBy: fernanda.id,
      },
      {
        title: 'Product Photo Session',
        startDate: new Date('2024-07-28T09:00:00Z'),
        endDate: new Date('2024-07-28T16:00:00Z'),
        type: EventType.SHOOTING,
        projectId: afterPack.id,
        clientId: afterDrinks.id,
        location: 'Studio A',
        createdBy: igor.id,
      },
    ],
  });

  console.log('Created comments, files and calendar events');

  // ──────────────────────────── Instagram Metrics ────────────────────────────
  await prisma.instagramMetrics.createMany({
    data: [
      {
        clientId: apex.id,
        projectId: apexFilm.id,
        postName: 'Campanha Apex - Hero Video',
        postType: 'Reels',
        views: 145200,
        likes: 8920,
        comments: 312,
        shares: 1540,
        saves: 2100,
        engagementRate: 8.9,
        performanceStatus: PerformanceStatus.TOP_PERFORMING,
        postDate: new Date('2024-07-12'),
      },
      {
        clientId: nova.id,
        projectId: novaCampaign.id,
        postName: 'Nova Foods - Produto Destaque',
        postType: 'Carrossel',
        views: 98500,
        likes: 5640,
        comments: 189,
        shares: 890,
        saves: 1200,
        engagementRate: 7.2,
        performanceStatus: PerformanceStatus.TOP_PERFORMING,
        postDate: new Date('2024-07-10'),
      },
      {
        clientId: afterDrinks.id,
        projectId: afterPack.id,
        postName: 'After Drinks - Lifestyle',
        postType: 'Foto',
        views: 12400,
        likes: 340,
        comments: 28,
        shares: 45,
        saves: 78,
        engagementRate: 3.1,
        performanceStatus: PerformanceStatus.NEEDS_IMPROVEMENT,
        postDate: new Date('2024-07-14'),
      },
      {
        clientId: luxe.id,
        projectId: luxeSite.id,
        postName: 'Luxe.co - Coleção Verão',
        postType: 'Reels',
        views: 67800,
        likes: 3210,
        comments: 134,
        shares: 567,
        saves: 890,
        engagementRate: 6.2,
        performanceStatus: PerformanceStatus.TOP_PERFORMING,
        postDate: new Date('2024-07-08'),
      },
      {
        clientId: nova.id,
        projectId: novaCampaign.id,
        postName: 'Nova Foods - Receita Stories',
        postType: 'Stories',
        views: 8900,
        likes: 156,
        comments: 12,
        shares: 23,
        saves: 34,
        engagementRate: 2.4,
        performanceStatus: PerformanceStatus.NEEDS_IMPROVEMENT,
        postDate: new Date('2024-07-15'),
      },
    ],
  });

  // ──────────────────────────── Metrics snapshot ────────────────────────────
  await prisma.metrics.create({
    data: {
      period: '2024-07',
      projectsCompleted: 8,
      tasksCompleted: 116,
      tasksLate: 4,
      avgDeliveryTime: 6.4,
      clientSatisfaction: 4.8,
      revenueImpact: 48700,
    },
  });

  // ──────────────────────────── Notifications ────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: ana.id,
        title: 'Deadline Tomorrow',
        message: 'TechStart Pitch Deck is due tomorrow. 90% complete.',
        type: 'deadline',
        actionUrl: `/projects/${techDeck.id}`,
      },
      {
        userId: ana.id,
        title: 'New Comment',
        message: 'Ricardo Apex left a comment on the brand film review.',
        type: 'comment',
        actionUrl: `/projects/${apexFilm.id}`,
      },
      {
        userId: diana.id,
        title: 'Task Approved',
        message: 'Wireframes approved by Sofia Luxe. Ready to proceed.',
        type: 'approval',
        actionUrl: '/tasks',
      },
      {
        userId: ana.id,
        title: 'Urgent Task',
        message: 'Pitch deck review slides 20-30 are overdue.',
        type: 'task',
        actionUrl: '/tasks',
      },
      {
        userId: ana.id,
        title: 'New Upload',
        message: 'Bruno Costa uploaded 3 raw files to Apex Brand Film.',
        type: 'task',
        actionUrl: `/projects/${apexFilm.id}`,
      },
      {
        userId: carla.id,
        title: 'Meeting Reminder',
        message: 'Creative review with Nova Foods team at 14:00.',
        type: 'system',
        actionUrl: '/calendar',
      },
      {
        userId: fernanda.id,
        title: 'Instagram Report Ready',
        message: 'Weekly Instagram metrics report is ready to view.',
        type: 'system',
        actionUrl: '/metrics',
      },
      {
        userId: ana.id,
        title: 'Invoice Paid',
        message: 'After Drinks Co. paid invoice #2024-041 - R$ 12.500.',
        type: 'system',
      },
    ],
  });

  // ──────────────────────────── Integrations ────────────────────────────
  await prisma.integration.createMany({
    data: [
      { provider: IntegrationProvider.GOOGLE_CALENDAR, status: IntegrationStatus.CONNECTED, connectedBy: ana.id },
      { provider: IntegrationProvider.GMAIL, status: IntegrationStatus.CONNECTED, connectedBy: ana.id },
      { provider: IntegrationProvider.GOOGLE_DRIVE, status: IntegrationStatus.CONNECTED, connectedBy: ana.id },
      { provider: IntegrationProvider.INSTAGRAM_META, status: IntegrationStatus.CONNECTED, connectedBy: fernanda.id },
      { provider: IntegrationProvider.WHATSAPP_BUSINESS, status: IntegrationStatus.DISCONNECTED },
      { provider: IntegrationProvider.OPENAI, status: IntegrationStatus.CONNECTED, connectedBy: ana.id },
      { provider: IntegrationProvider.MCP, status: IntegrationStatus.DISCONNECTED },
      { provider: IntegrationProvider.MANOS_AI, status: IntegrationStatus.DISCONNECTED },
    ],
  });

  // ──────────────────────────── Activity log ────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      {
        userId: bruno.id,
        action: 'uploaded 3 raw files',
        entityType: 'project',
        entityId: apexFilm.id,
      },
      {
        userId: ana.id,
        action: 'changed project status from PRE_PRODUCTION to EDITING',
        entityType: 'project',
        entityId: apexFilm.id,
        metadata: { from: 'PRE_PRODUCTION', to: 'EDITING' },
      },
      {
        userId: carla.id,
        action: 'completed task "Aprovação final brand film"',
        entityType: 'project',
        entityId: apexFilm.id,
      },
      {
        userId: ana.id,
        action: 'created project "TechStart Pitch Deck"',
        entityType: 'project',
        entityId: techDeck.id,
      },
    ],
  });

  console.log('Created Instagram metrics, KPI snapshot, notifications, integrations and activity log');
  console.log('Seed complete. Login with ana@onetake.studio / onetake123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
