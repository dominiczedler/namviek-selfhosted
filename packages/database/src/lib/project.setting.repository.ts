import { ProjectSettingNotification } from '@prisma/client'
import { projectNotifyModel } from './_prisma'

export class ProjectSettingRepository {
  async getMyNotifySettings({
    uid,
    projectId
  }: {
    uid: string
    projectId: string
  }) {
    return projectNotifyModel.findFirst({
      where: {
        uid,
        projectId
      }
    })
  }
  async getAllNotifySettings(projectId: string) {
    const settings = await projectNotifyModel.findMany({
      where: {
        projectId,
        taskChanges: true
      },
      select: {
        uid: true
      }
    })

    if (settings.length) return settings.map(st => st.uid)


    return []
  }

  async getAllRemindSettings(projectId: string) {
    const settings = await projectNotifyModel.findMany({
      where: {
        projectId,
        remind: true
      },
      select: {
        uid: true
      }
    })

    if (settings.length) return settings.map(st => st.uid)

    return []
  }

  async updateOrCreateNotifySetting(
    data: Omit<ProjectSettingNotification, 'id'>
  ) {
    const { uid, projectId } = data
    const myNotifySetting = await projectNotifyModel.findFirst({
      where: {
        uid,
        projectId
      }
    })

    if (myNotifySetting) {
      return projectNotifyModel.update({
        where: {
          id: myNotifySetting.id
        },
        data: data as any
      })
    } else {
      return projectNotifyModel.create({
        data: data as any
      })
    }
  }

  async createNotifySetting(data: Omit<ProjectSettingNotification, 'id'>) {
    return projectNotifyModel.create({
      data: data as any
    })
  }
}
