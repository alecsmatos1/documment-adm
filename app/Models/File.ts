import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Document from 'App/Models/Document'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pathUrl: string

  @column()
  public documentId: number

  @belongsTo(() => Document)
  public document: BelongsTo<typeof Document>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
