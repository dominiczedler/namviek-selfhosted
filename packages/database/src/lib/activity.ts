import { Activity, ActivityObjectType, Prisma } from '@prisma/client'
import { activityModel } from './_prisma'

export const mdActivityAdd = (data: Omit<Activity, 'id'>) => {
  return activityModel.create({
    data: data as Prisma.ActivityCreateInput
  })
}

export const mdActivityAddMany = (data: Omit<Activity, 'id'>[]) => {
  return activityModel.createMany({
    data: data as Prisma.ActivityCreateManyInput[]
  })
}

export const mdActivityDel = (id: string) => {
  return activityModel.delete({
    where: {
      id
    }
  })
}

export const mdActivityUpdate = (id: string, data: Omit<Activity, 'id'>) => {
  return activityModel.update({
    where: {
      id
    },
    data: data as Prisma.ActivityUpdateInput
  })
}

export const mdActivityGetAllByTask = (taskId: string) => {
  return activityModel.findMany({
    where: {
      objectId: taskId,
      objectType: ActivityObjectType.TASK
    }
    // take: 5,
    // skip: 0
  })
}
