-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('GUEST', 'MEMBER', 'MANAGER', 'LEADER');

-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('ADMIN', 'MANAGER', 'MEMBER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('REJECTED', 'ACCEPTED', 'INVITING');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('URGENT', 'HIGH', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('DONE', 'INPROCESS', 'TODO');

-- CreateEnum
CREATE TYPE "ActivityObjectType" AS ENUM ('TASK', 'PROJECT');

-- CreateEnum
CREATE TYPE "OrgStorageType" AS ENUM ('AWS_S3', 'DIGITAL_OCEAN_S3');

-- CreateEnum
CREATE TYPE "CounterType" AS ENUM ('TASK', 'PROJECT', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('NUMBER', 'TEXT', 'DATE', 'SELECT', 'MULTISELECT', 'CHECKBOX', 'URL', 'EMAIL', 'FILES', 'PHONE', 'PERSON', 'CREATED_AT', 'CREATED_BY', 'UPDATED_AT', 'UPDATED_BY');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TASK', 'BUG', 'NEW_FEATURE', 'IMPROVEMENT');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('FILE', 'FOLDER');

-- CreateEnum
CREATE TYPE "FileOwnerType" AS ENUM ('USER', 'TASK', 'DISCUSSION', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ProjectViewType" AS ENUM ('LIST', 'BOARD', 'CALENDAR', 'TIMELINE', 'GOAL', 'TEAM', 'ACTIVITY', 'DASHBOARD', 'GRID');

-- CreateEnum
CREATE TYPE "StatsType" AS ENUM ('PROJECT_TASK_BY_DAY', 'MEMBER_TASK_BY_DAY');

-- CreateEnum
CREATE TYPE "DashboardComponentType" AS ENUM ('LINE', 'SUMMARY', 'PIE', 'LISTTAB', 'LIST', 'COLUMN', 'BURNDOWN', 'BURNUP');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('TASK_CREATED', 'TASK_TITLE_CHANGED', 'TASK_DESC_CHANGED', 'TASK_DUEDATE_CHANGED', 'TASK_ASSIGNEE_ADDED', 'TASK_ASSIGNEE_REMOVED', 'TASK_STATUS_CREATED', 'TASK_STATUS_CHANGED', 'TASK_PROGRESS_CHANGED', 'TASK_PRIORITY_CHANGED', 'TASK_POINT_CHANGED', 'TASK_VISION_CHANGED', 'TASK_COMMENT_CREATED', 'TASK_COMMENT_CHANGED', 'TASK_COMMENT_REMOVED', 'TASK_ATTACHMENT_ADDED', 'TASK_ATTACHMENT_REMOVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "status" "UserStatus",
    "country" TEXT,
    "bio" TEXT,
    "photo" TEXT,
    "dob" TIMESTAMP(3),
    "resetToken" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cover" TEXT,
    "avatar" TEXT,
    "maxStorageSize" INTEGER,
    "desc" TEXT,
    "createdAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationStorage" (
    "id" TEXT NOT NULL,
    "type" "OrgStorageType" NOT NULL,
    "config" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "OrganizationStorage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembers" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL,
    "createdAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "OrganizationMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "type" "CounterType" NOT NULL,
    "counter" INTEGER NOT NULL,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "icon" TEXT,
    "hidden" BOOLEAN,
    "width" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "desc" TEXT,
    "data" JSONB,
    "config" JSONB,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "dueDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL,
    "type" "TaskType",
    "checklistDone" INTEGER,
    "checklistTodos" INTEGER,
    "cover" TEXT,
    "plannedStartDate" TIMESTAMP(3),
    "plannedDueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "priority" "TaskPriority",
    "visionId" TEXT,
    "taskStatusId" TEXT,
    "tagIds" TEXT[],
    "assigneeIds" TEXT[],
    "fileIds" TEXT[],
    "parentTaskId" TEXT,
    "progress" INTEGER,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "taskPoint" INTEGER,
    "customFields" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grid" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover" TEXT,
    "projectId" TEXT NOT NULL,
    "customFields" JSONB,
    "isDeleted" BOOLEAN,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Grid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "StatusType" NOT NULL DEFAULT 'TODO',

    CONSTRAINT "TaskStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskChecklist" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "done" BOOLEAN,
    "doneAt" TIMESTAMP(3),

    CONSTRAINT "TaskChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskPoint" (
    "id" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "TaskPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAutomation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "when" JSONB NOT NULL,
    "then" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TaskAutomation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheduler" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "cronId" TEXT,
    "trigger" JSONB NOT NULL,
    "action" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Scheduler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileStorage" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyName" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "url" TEXT,
    "size" DOUBLE PRECISION,
    "mimeType" TEXT,
    "parentId" TEXT,
    "owner" TEXT,
    "ownerType" "FileOwnerType",
    "isDeleted" BOOLEAN DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "FileStorage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectViewId" TEXT,
    "desc" TEXT,
    "cover" TEXT,
    "icon" TEXT,
    "isArchived" BOOLEAN DEFAULT false,
    "createdBy" TEXT,
    "countMemberTask" BOOLEAN DEFAULT false,
    "countProjectTask" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSettingNotification" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "taskChanges" BOOLEAN DEFAULT false,
    "remind" BOOLEAN DEFAULT false,
    "overdue" BOOLEAN DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "ProjectSettingNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectView" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" "ProjectViewType" NOT NULL,
    "onlyMe" BOOLEAN,
    "icon" TEXT,
    "projectId" TEXT,
    "order" INTEGER,
    "data" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vision" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT,
    "organizationId" TEXT,
    "parentId" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "progress" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "Vision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL,
    "uid" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "type" "StatsType" NOT NULL,
    "data" JSONB,
    "uid" TEXT,
    "projectId" TEXT,
    "orgId" TEXT,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardComponent" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT,
    "title" TEXT,
    "type" "DashboardComponentType",
    "config" JSONB,
    "x" INTEGER DEFAULT 0,
    "y" INTEGER DEFAULT 0,
    "width" INTEGER DEFAULT 3,
    "height" INTEGER DEFAULT 1,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DashboardComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "title" TEXT DEFAULT 'Untitled',
    "projectId" TEXT,
    "isDefault" BOOLEAN DEFAULT false,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "objectType" "ActivityObjectType" NOT NULL,
    "type" "ActivityType" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "scopes" TEXT[],
    "createdAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timer" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Application_clientId_key" ON "Application"("clientId");

-- AddForeignKey
ALTER TABLE "OrganizationMembers" ADD CONSTRAINT "OrganizationMembers_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardComponent" ADD CONSTRAINT "DashboardComponent_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
