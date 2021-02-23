import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Document from 'App/Models/Document'

export default class DocumentsController {
  public async index({}: HttpContextContract) {}

  public async create({ view }: HttpContextContract) {
    return view.render('documents/create')
  }

  public async store({ request, response, session, auth, logger }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string(),
      description: schema.string.optional(),
      tags: schema.string.optional({}, [rules.maxLength(100)]),
      file: schema.file({
        size: '2mb',
        extnames: ['pdf'],
      }),
    })
    const documentData = await request.validate({
      schema: validationSchema,
      messages: {
        'title.required': 'O titulo é obrigatório, por favor preencha este campo',
        'file.required': 'O arquivo é obrigatório, por favor faça o upload',
        'tags.maxLength': 'O campo tags deve ter no maximo 100 caracteres',
        'file.size': 'O arquivo deve ter no maximo 2mb',
        'file.extname': 'Formato de arquivo inválido',
      },
    })
    try {
      const user = auth.user
      const pathUrl = `${Date.now()}-${documentData.file.clientName}`
      await documentData.file.move(Application.tmpPath('uploads'), {
        name: pathUrl,
      })
      if (user) {
        const document = await user.related('documents').create(documentData)
        await document.related('file').create({ pathUrl })
      }
      session.flash('sucess', 'Arquivo adicionado com sucesso')
      return response.redirect().toRoute('session.index')
    } catch (error) {
      logger.error(error)
      session.flash('error', error.messsage)

      return response.redirect().back()
    }
  }

  public async edit({ view, params, auth, session }: HttpContextContract) {
    const { id } = params
    const user = auth.user
    if (user) {
      await user.load('documents', (builder) => {
        builder.where('id', '=', `${id}`)
      })
      session.put('documents', user.documents)
    }
    return view.render('documents/edit')
  }

  public async update({ request, params, response }: HttpContextContract) {
    const { id } = params
    const validationSchema = schema.create({
      title: schema.string(),
      description: schema.string.optional(),
      tags: schema.string.optional({}, [rules.maxLength(100)]),
      file: schema.file.optional({
        size: '2mb',
        extnames: ['pdf'],
      }),
    })
    const documentData = await request.validate({
      schema: validationSchema,
      messages: {
        'title.required': 'O titulo é obrigatório, por favor preencha este campo',
        'file': 'O arquivo é obrigatório, por favor faça o upload',
        'tags.maxLength': 'O campo tags deve ter no maximo 100 caracteres',
        'file.size': 'O arquivo deve ter no maximo 2mb',
        'file.extname': 'Formato de arquivo inválido',
      },
    })
    try {
      const document = await Document.findOrFail(id)
      if (documentData.file) {
        const pathUrl = `${Date.now()}-${documentData.file}`
        await documentData.file.move(Application.tmpPath('uploads'), {
          name: pathUrl,
        })
        document.related('file').query().delete()
        await document.related('file').create({ pathUrl })
      }
      document.merge(documentData)
      await document.save()
      return response.redirect().toRoute('home.index')
    } catch (error) {}
  }

  public async download({ request, response }: HttpContextContract) {
    const { pathUrl } = request.get()

    const link = Application.tmpPath(`uploads/${pathUrl}`)
    response.download(link)
  }

  public async destroy({}: HttpContextContract) {}
}
